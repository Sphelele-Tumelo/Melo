import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import Sidebar from "./components/Sidebar";
import ChatBox from "./components/ChatBox";
import Chats, { type Message } from "./components/Chats";
import Settings from "./components/Settings";
import SignIn from "./components/Sign_In";
import SignUp from "./components/Sign_Up";
import LoadingPage from "./components/after_login/LoadingPage";
import NewUserLoadingPage from "./components/after_login/NewUserLoadingPage";
import './index.css';


function AppShell() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function startChat(content: string) {
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", content },
    ]);
    setIsThinking(true);
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: Date.now(), role: "assistant", content: "I’m here with you. Tell me a little more and we’ll work through it together." },
      ]);
      setIsThinking(false);
    }, 2200);
  }

  function restartChat() {
    setMessages([]);
    setIsThinking(false);
  }

  return (
    <div className="relative flex h-screen min-w-0 overflow-hidden bg-white dark:bg-gray-900">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenSettings={() => {
          setShowSettings(true);
          setSidebarOpen(false);
        }}
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
      {showSettings ? <Settings onBack={() => setShowSettings(false)} /> : messages.length === 0 ? <ChatBox onStartChat={startChat} /> : <Chats messages={messages} isThinking={isThinking} onSend={startChat} onRestart={restartChat} />}
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
