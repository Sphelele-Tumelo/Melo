import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

import { FiMenu, FiX } from "react-icons/fi";

import Sidebar from "./components/Sidebar";
import ChatBox from "./components/ChatBox";
import Chats from "./components/Chats";
import Settings from "./components/Settings";

import SignIn from "./components/Sign_In";
import SignUp from "./components/Sign_Up";

import LoadingPage from "./components/after_login/LoadingPage";
import NewUserLoadingPage from "./components/after_login/NewUserLoadingPage";

import { useChatStore } from "./store/chatStore";
import { useAuthStore } from "./store/authStore";

import "./index.css";


/* ============================================================
   AUTH PROMPT MODAL
   ============================================================ */

function AuthPromptModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const navigate = useNavigate();

  function handleSignIn() {
    onClose();
    navigate("/signin");
  }

  function handleSignUp() {
    onClose();
    navigate("/signup");
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#12111A]/30 px-5 backdrop-blur-[3px]">
      <div className="relative w-full max-w-[380px] rounded-2xl border border-[#E9E9E9] bg-white p-6 shadow-[0_20px_60px_rgba(18,17,26,0.15)]">

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-2 text-[#8A8F98] transition-colors hover:bg-[#F5F5F5] hover:text-[#202124]"
        >
          <FiX className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="pr-8">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#171615] text-sm font-semibold text-white">
            M
          </div>

          <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#171615]">
            Continue to Melo
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#777B82]">
            Sign in or create an account to start a conversation with Melo.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            onClick={handleSignIn}
            className="w-full rounded-xl bg-[#171615] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#292725]"
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={handleSignUp}
            className="w-full rounded-xl border border-[#E2E2E2] bg-white px-4 py-3 text-sm font-medium text-[#242424] transition-colors hover:bg-[#F7F7F7]"
          >
            Create account
          </button>
        </div>

        <p className="mt-4 text-center text-[11px] leading-5 text-[#9A9DA3]">
          Your conversations are private to your account.
        </p>
      </div>
    </div>
  );
}


/* ============================================================
   MAIN APP SHELL
   ============================================================ */

function AppShell() {
  const navigate = useNavigate();
  const { conversationId } = useParams();

  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  

  const {
    displayName,
    isAuthenticated,
    fetchCurrentUser,
  } = useAuthStore();

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


  /* ============================================================
     INITIAL LOAD
     ============================================================ */

  useEffect(() => {
    loadConversations();
    fetchCurrentUser();
  }, []);


  /* ============================================================
     LOAD CONVERSATION FROM URL
     ============================================================ */

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    loadMessages(conversationId);
  }, [conversationId]);


  /* ============================================================
     START CHAT
     ============================================================ */

  async function handleStartChat(content: string) {
    /*
     * Logged-out visitors can see the full Melo UI,
     * but authentication is required before sending.
     */

    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    /*
     * If we're on the landing page, create a brand-new
     * conversation and give it its own URL.
     */

    if (!conversationId) {
      const newConversationId = await createNewConversation();

      navigate(`/chat/${newConversationId}`);

      await sendMessage(content);

      return;
    }

    /*
     * We're already inside a conversation.
     */

    await sendMessage(content);
  }


  /* ============================================================
     NEW CHAT
     ============================================================ */

  async function handleNewChat() {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    const newConversationId = await createNewConversation();

    navigate(`/chat/${newConversationId}`);

    setSidebarOpen(false);
    setShowSettings(false);
  }


  /* ============================================================
     DELETE CONVERSATION
     ============================================================ */

  async function handleDeleteConversation(
    conversationIdToDelete: string
  ) {
    await deleteConversation(conversationIdToDelete);

    /*
     * If the conversation currently displayed was deleted,
     * return to the Melo opening screen.
     */

    if (conversationIdToDelete === conversationId) {
      navigate("/");
    }
  }


  /* ============================================================
     SELECT CONVERSATION
     ============================================================ */

  async function handleSelectConversation(
    selectedConversationId: string
  ) {
    /*
     * The URL becomes the source of truth.
     */

    navigate(`/chat/${selectedConversationId}`);

    setSidebarOpen(false);
    setShowSettings(false);
  }


  /* ============================================================
     ACTIVE CONVERSATION
     ============================================================ */

  const activeConversation = conversations.find(
    (conversation) =>
      conversation.id === activeConversationId
  );


  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div className="relative flex h-dvh min-w-0 overflow-hidden bg-white dark:bg-gray-900">

      {/* ======================================================
          SIDEBAR
          ====================================================== */}

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


      {/* ======================================================
          MOBILE SIDEBAR BACKDROP
          ====================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#12111A]/20 md:hidden"
        />
      )}


      {/* ======================================================
          MOBILE SIDEBAR BUTTON
          ====================================================== */}

      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-lg bg-white p-2 text-[#5F6368] shadow-[0_2px_12px_rgba(18,17,26,0.1)] transition-colors hover:bg-[#F5F5F5] md:hidden"
      >
        <FiMenu className="h-5 w-5" />
      </button>


      {/* ======================================================
          MAIN CONTENT
          ====================================================== */}

      {showSettings ? (
          <Settings onBack={() => setShowSettings(false)} />
      ) : messages.length === 0 ? (
          <ChatBox
            onStartChat={handleStartChat}
            displayName={displayName}
            onOpenSignIn={() => navigate("/signin")}
            onOpenSignUp={() => navigate("/signup")}
        />
      ) : ( 

        /*
         * ACTUAL CONVERSATION
         */

        <Chats
          messages={messages}
          isThinking={isThinking}
          conversationTitle={
            activeConversation?.title || "Melo"
          }
          onSend={sendMessage}
          onRestart={restartConversation}
        />
      )}


      {/* ======================================================
          AUTH MODAL
          ====================================================== */}

      {showAuthPrompt && (
        <AuthPromptModal
          onClose={() => setShowAuthPrompt(false)}
        />
      )}

    </div>
  );
}


/* ============================================================
   ROUTES
   ============================================================ */

function App() {
  return (
    <Routes>

      {/* Landing / opening Melo UI */}
      <Route
        path="/"
        element={<AppShell />}
      />

      {/* Keep your old route working */}
      <Route
        path="/app"
        element={<AppShell />}
      />

      {/* Individual conversation */}
      <Route
        path="/chat/:conversationId"
        element={<AppShell />}
      />

      {/* Authentication */}
      <Route
        path="/signin"
        element={<SignIn />}
      />

      <Route
        path="/signup"
        element={<SignUp />}
      />

      {/* Existing welcome flows */}
      <Route
        path="/welcome"
        element={<LoadingPage />}
      />

      <Route
        path="/new-user-welcome"
        element={<NewUserLoadingPage />}
      />

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}


export default App;