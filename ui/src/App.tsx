import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import Sidebar from "./components/Sidebar";
import ChatBox from "./components/ChatBox";
import Chats from "./components/Chats";
import Settings from "./components/Settings";
import SignIn from "./components/Sign_In";
import SignUp from "./components/Sign_Up";
import LoadingPage from "./components/after_login/LoadingPage";
import NewUserLoadingPage from "./components/after_login/NewUserLoadingPage";
import { useChatStore } from "./store/chatStore";
import { useState } from "react";
import { useAuthStore } from "./store/authStore"; 
import './index.css';


function AppShell() {
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { displayName, fetchCurrentUser } = useAuthStore();

  const {
    conversations,
    messages,
    activeConversationId,
    isThinking,
    createNewConversation,
    loadConversations,
    loadMessages,
    sendMessage,
    deleteConversation,
    togglePin,
    restartConversation,
  } = useChatStore();

  // Load the user's conversation list once, on app mount.
  useEffect(() => {
  loadConversations();
  fetchCurrentUser();
}, []);

  async function handleStartChat(content: string) {
    let conversationId = activeConversationId;

    if (!conversationId) {
        conversationId = await createNewConversation();
    }

    await sendMessage(content);
}
  async function handleNewChat() {
    await createNewConversation();
    setSidebarOpen(false);
  }

  async function handleDeleteConversation(conversationId: string) {
  await deleteConversation(conversationId);
}

  async function handleSelectConversation(conversationId: string) {
    await loadMessages(conversationId);
    setSidebarOpen(false);
  }

  console.log("conversations:", conversations);
  
  return (
    <div className="relative flex h-screen min-w-0 overflow-hidden bg-white dark:bg-gray-900">
      <Sidebar
        isOpen={sidebarOpen}
        onDeleteConversation={handleDeleteConversation}
        onPinConversation={togglePin}
        onClose={() => setSidebarOpen(false)}
        onOpenSettings={() => {
          setShowSettings(true);
          setSidebarOpen(false);
        }}
        conversations={conversations}
        displayName={displayName}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#12111A]/20 md:hidden"
        />
      )}
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-lg bg-white p-2 text-[#5F6368] shadow-[0_2px_12px_rgba(18,17,26,0.1)] transition-colors hover:bg-[#F5F5F5] md:hidden"
      >
        <FiMenu className="h-5 w-5" />
      </button>
      {showSettings ? (
        <Settings onBack={() => setShowSettings(false)} />
      ) : messages.length === 0 ? (
        <ChatBox onStartChat={handleStartChat} />
      ) : (
        <Chats
          messages={messages}
          isThinking={isThinking}
          onSend={sendMessage}
          onRestart={restartConversation}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/welcome" element={<LoadingPage />} />
      <Route path="/new-user-welcome" element={<NewUserLoadingPage />} />
      <Route path="/app" element={<AppShell />} />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}

export default App