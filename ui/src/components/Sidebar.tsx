import melo from "../assets/melo-icon.svg";
import {
  FiEdit3,
  FiSidebar,
  FiSearch,
  FiSettings,
} from "react-icons/fi";

type SidebarProps = {
  onOpenSettings: () => void;
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ onOpenSettings, isOpen, onClose }: SidebarProps) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[min(320px,88vw)] flex-col border-r border-[#E9E9E9] bg-white px-4 py-5 text-[#12111A] shadow-[8px_0_28px_rgba(18,17,26,0.08)] transition-transform duration-300 ease-out md:relative md:z-auto md:w-[320px] md:shrink-0 md:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
      
      {/* Header */}
      <div className="flex items-center gap-3 px-2 py-1.5">
        <a href="/" aria-label="Melo home">
          <img
            src={melo}
            alt="Melo logo"
            className="h-7 w-7"
          />
        </a>

        <h2 className="text-[19px] font-bold tracking-[-0.02em] text-[#FF5722]">
          Melo
        </h2>

        <button
          type="button"
          aria-label="Collapse sidebar"
          onClick={onClose}
          className="ml-auto rounded-lg p-2 text-[#5F6368] transition-colors hover:bg-[#F5F5F5] hover:text-[#202124]"
        >
          <FiSidebar className="h-5 w-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav
        className="mt-7 space-y-1"
        aria-label="Main navigation"
      >
        {/* New Chat */}
        <button
          type="button"
          className="
            flex w-full items-center gap-3
            rounded-lg px-3 py-2.5
            text-[15px] font-bold
            text-[#12111A]
            transition-colors
            hover:bg-[#F5F5F5]
          "
        >
          <FiEdit3 className="h-5 w-5 shrink-0" />

          <span>New chat</span>
        </button>

        {/* Search */}
        <button
          type="button"
          className="
            flex w-full items-center gap-3
            rounded-lg px-3 py-2.5
            text-[15px] font-bold
            text-[#5F6368]
            transition-colors
            hover:bg-[#F5F5F5]
            hover:text-[#202124]
          "
        >
          <FiSearch className="h-5 w-5 shrink-0" />

          <span>Search</span>
        </button>
      </nav>

      {/* History */}
      <div className="mt-8 px-2">
        <span className="text-[12px] font-bold text-[#8A8F98]">
          History
        </span>
      </div>

      {/* Conversation History */}
      <div className="mt-3">
        <button
          type="button"
          className="
            flex w-full items-center
            rounded-lg px-3 py-2
            text-left
            text-[14px] font-bold
            text-[#12111A]
            transition-colors
            hover:bg-[#F5F5F5]
          "
        >
          <span className="truncate">
            Hey Melo
          </span>
        </button>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto flex items-center justify-between px-2 pb-1">
        
        {/* User */}
        <button
          type="button"
          className="
            flex items-center gap-3
            rounded-lg px-2 py-2
            transition-colors
            hover:bg-[#F5F5F5]
          "
        >
          <span
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-full
              bg-[#EDE9FE]
              text-[13px] font-medium
              text-[#6D28D9]
            "
          >
            T
          </span>

          <span className="text-left">
            <span className="block text-[14px] font-bold text-[#12111A]">
              Tumelo Zonke
            </span>
          </span>
        </button>

        {/* Settings */}
        <button
          type="button"
          aria-label="Settings"
          onClick={onOpenSettings}
          className="
            rounded-lg p-2
            text-[#5F6368]
            transition-colors
            hover:bg-[#F5F5F5]
            hover:text-[#202124]
          "
        >
          <FiSettings className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}