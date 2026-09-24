import { useState, useRef, useEffect } from "react";
import melo from "../assets/melo-icon.svg";
import {
  FiEdit3,
  FiSidebar,
  FiSearch,
  FiSettings,
  FiMoreHorizontal,
  FiTrash2,
} from "react-icons/fi";
import { FaMapPin } from 'react-icons/fa'
import type { Conversation } from "../api/conversation";

type SidebarProps = {
  onOpenSettings: () => void;
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  displayName: string | null;
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  onPinConversation?: (conversationId: string) => void;
  
};

export default function Sidebar({
  onOpenSettings,
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onNewChat,
  displayName,
  onSelectConversation,
  onDeleteConversation,
  onPinConversation,
 
}: SidebarProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the open menu on any outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortedConversations = [...conversations].sort((a, b) => {
  if (a.is_pinned && !b.is_pinned) return -1;
  if (!a.is_pinned && b.is_pinned) return 1;
  return 0;
  });

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[min(280px,85vw)] flex-col border-r border-[#E9E9E9] bg-white px-3 py-4 text-[#12111A] shadow-[8px_0_28px_rgba(18,17,26,0.08)] transition-transform duration-300 ease-out md:relative md:z-auto md:w-65 md:shrink-0 md:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-2 py-1">
        <a href="/" aria-label="Melo home" className="flex items-center gap-2">
          <img src={melo} alt="Melo logo" className="h-5 w-5" />
          <h2 className="text-[16px] font-semibold tracking-tight text-[#FF5722]">
            Melo
          </h2>
        </a>

        <button
          type="button"
          aria-label="Collapse sidebar"
          onClick={onClose}
          className="ml-auto rounded-md p-1.5 text-[#5F6368] transition-colors hover:bg-[#F5F5F5] hover:text-[#202124]"
        >
          <FiSidebar className="h-4 w-4" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="mt-5 space-y-0.5" aria-label="Main navigation">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] font-medium text-[#12111A] transition-colors hover:bg-[#F5F5F5]"
        >
          <FiEdit3 className="h-4 w-4 shrink-0 text-[#5F6368]" />
          <span>New chat</span>
        </button>

        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] font-medium text-[#5F6368] transition-colors hover:bg-[#F5F5F5] hover:text-[#202124]"
        >
          <FiSearch className="h-4 w-4 shrink-0" />
          <span>Search</span>
        </button>
      </nav>

      {/* History Label */}
      <div className="mt-6 px-2.5 py-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8F98]">
          History
        </span>
      </div>

      {/* Conversation History */}
      <div className="mt-1 flex-1 space-y-0.5 overflow-y-auto">
        {sortedConversations.length === 0 ? (
          <p className="px-2.5 py-2 text-[12px] text-[#A0A0A0]">
            No conversations yet
          </p>
        ) : (
          sortedConversations.map((conversation) => {
            const isPinned = conversation.is_pinned;
            const isMenuOpen = openMenuId === conversation.id;

            return (
              <div key={conversation.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`flex w-full items-center rounded-md py-1.5 pl-2.5 pr-8 text-left text-[13px] font-normal transition-colors hover:bg-[#F5F5F5] ${
                    conversation.id === activeConversationId
                      ? "bg-[#F5F5F5] font-medium text-[#12111A]"
                      : "text-[#5F6368]"
                  }`}
                >
                  {isPinned && (
                    <FaMapPin className="mr-1.5 h-3 w-3 shrink-0 rotate-45 text-[#8A8F98]" />
                  )}
                  <span className="truncate">
                    {conversation.title || "New conversation"}
                  </span>
                </button>

                {/* Three-dot menu trigger — visible on hover, or always if its menu is open */}
                <button
                  type="button"
                  aria-label="Conversation options"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(isMenuOpen ? null : conversation.id);
                  }}
                  className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#8A8F98] transition-opacity hover:bg-[#E9E9E9] hover:text-[#202124] ${
                    isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <FiMoreHorizontal className="h-3.5 w-3.5" />
                </button>

                {/* Dropdown: Pin / Delete */}
                {isMenuOpen && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 top-full z-10 mt-1 w-36 rounded-lg border border-[#E9E9E9] bg-white py-1 shadow-[0_4px_20px_rgba(18,17,26,0.12)]"
                  >
                    {onPinConversation && (
                      <button
                        type="button"
                        onClick={() => {
                          onPinConversation(conversation.id);
                          setOpenMenuId(null);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] text-[#12111A] hover:bg-[#F5F5F5]"
                      >
                        <FaMapPin className="h-3.5 w-3.5" />
                        {isPinned ? "Unpin" : "Pin"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteConversation(conversation.id);
                        setOpenMenuId(null);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] text-red-600 hover:bg-red-50"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Section */}
      <div className="mt-auto flex items-center justify-between border-t border-[#F0F0F0] pt-3 px-1">
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-md px-1.5 py-1 transition-colors hover:bg-[#F5F5F5]"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E9E9E9] text-[12px] font-medium text-[#5F6368]">
            {displayName ? (
              displayName.charAt(0).toUpperCase()
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            )}
          </span>

          <span className="truncate text-left">
            <span className="block truncate text-[13px] font-medium text-[#12111A]">
              {displayName || "User"}
            </span>
          </span>
        </button>

        <button
          type="button"
          aria-label="Settings"
          onClick={onOpenSettings}
          className="rounded-md p-1.5 text-[#5F6368] transition-colors hover:bg-[#F5F5F5] hover:text-[#202124]"
        >
          <FiSettings className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}