import { useState, useEffect } from "react";
import { FiCode, FiImage, FiSmile, FiMenu } from "react-icons/fi";
import mainLogoCard from "../assets/MainLogoCard.svg";
import { getGreeting } from "../utils/greetings";

type ChatBoxProps = {
    onStartChat: (message: string) => void;
    displayName: string | null;
    onOpenSignIn?: () => void;
    onOpenSignUp?: () => void;
    onOpenSidebar?: () => void;
};

export default function ChatBox({
    onStartChat,
    displayName,
    onOpenSignIn,
    onOpenSignUp,
    onOpenSidebar

}: ChatBoxProps) {
    const [message, setMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token") || localStorage.getItem("melo_token");
        setIsLoggedIn(!!token || !!displayName);
    }, [displayName]);

    const suggestions = [
        { label: "Help me plan my day", icon: FiSmile },
        { label: "Write something for me", icon: FiCode },
        { label: "Create an image", icon: FiImage },
    ];

    const greeting = getGreeting(displayName || "there");

    function submitMessage() {
        if (!message.trim()) return;
        onStartChat(message.trim());
        setMessage("");
    }

    return (
        <main className="flex min-w-0 flex-1 flex-col bg-white">
         <header className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 sm:px-8
             bg-white/70 backdrop-blur-xl supports-backdrop-filter:bg-white/60
             border-b border-white/20">
         
             <div className="flex items-center">
                 <button
                     type="button"
                     aria-label="Open sidebar"
                     onClick={onOpenSidebar}
                     className="rounded-lg p-2 text-[#5F6368] transition-colors hover:bg-[#F5F5F5] md:hidden"
                 >
                     <FiMenu className="h-5 w-5" />
                 </button>
             </div>
         
             <div className="flex items-center gap-2">
                 {!isLoggedIn && (
                     <>
                         {/* Mobile: compact pill buttons */}
                         <div className="flex items-center gap-2 md:hidden">
                             <button
                                 type="button"
                                 onClick={onOpenSignIn}
                                 className="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium
                                 bg-white/80 backdrop-blur-md border border-[#E9E9E9]
                                 text-[#12111A] shadow-[0_2px_10px_rgba(0,0,0,0.06)]
                                 hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all"
                             >
                                 Log in
                             </button>
                             <button
                                 type="button"
                                 onClick={onOpenSignUp}
                                 className="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium
                                 bg-[#12111A] text-white
                                 shadow-[0_2px_12px_rgba(18,17,26,0.2)]
                                 hover:bg-black hover:shadow-[0_4px_18px_rgba(18,17,26,0.3)]
                                 backdrop-blur-md border border-white/10 transition-all"
                             >
                                 Sign up
                             </button>
                         </div>
         
                         {/* Desktop: standard-sized buttons */}
                         <div className="hidden items-center gap-2 md:flex">
                             <button
                                 type="button"
                                 onClick={onOpenSignIn}
                                 className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium bg-white border border-[#E9E9E9] text-[#12111A] hover:bg-[#FAFAFA] transition"
                             >
                                 Log in
                             </button>
                             <button
                                 type="button"
                                 onClick={onOpenSignUp}
                                 className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium bg-[#12111A] text-white hover:bg-black transition"
                             >
                                 Sign up
                             </button>
                         </div>
                     </>
                 )}
         
                 {isLoggedIn && (
                     <button
                         type="button"
                         className="rounded-full px-3 py-2 text-sm font-medium text-[#5F6368] transition-colors hover:bg-[#F5F5F5] hover:text-[#202124]"
                     >
                         Melo
                     </button>
                 )}
             </div>
         </header>

            <section className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-8 pt-12 sm:px-5 sm:pb-10 sm:pt-0">
                <div className="w-full max-w-180">

                    <div className="mb-10 text-center">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center">
                            <img src={mainLogoCard} alt="Melo" className="h-full w-full object-contain" />
                        </div>
                        <h1 className="text-center text-[clamp(24px,7vw,30px)] font-medium tracking-[-0.03em] text-[#12111A]">
                            {greeting.title}
                        </h1>
                        <p className="mt-2 text-sm text-[#8A8F98]">{greeting.subtitle}</p>
                    </div>

                    <div className="mb-4 flex flex-wrap justify-center gap-2 px-1">
                        {suggestions.map(({ label, icon: Icon }) => (
                            <button
                                key={label}
                                type="button"
                                onClick={() => setMessage(label)}
                                className="flex items-center gap-2 rounded-full border border-[#E9E9E9] px-3.5 py-2 text-[13px] font-medium text-[#5F6368] transition-colors hover:border-[#D8D8D8] hover:bg-[#FAFAFA] hover:text-[#202124]"
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </button>
                        ))}
                    </div>

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitMessage();
                        }}
                        className="rounded-2xl border border-[#DCDCDC] bg-white p-2 shadow-[0_4px_20px_rgba(18,17,26,0.06)] transition-shadow focus-within:border-[#BDBDBD] focus-within:shadow-[0_6px_26px_rgba(18,17,26,0.1)]"
                    >
                        <textarea
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" && !event.shiftKey) {
                                    event.preventDefault();
                                    submitMessage();
                                }
                            }}
                            rows={2}
                            placeholder="Message Melo..."
                            aria-label="Message Melo"
                            className="block w-full resize-none bg-transparent px-3 py-2 text-[16px] font-medium text-[#12111A] outline-none placeholder:text-[#A0A0A0]"
                        />
                        <div className="flex items-center justify-between px-1">
                            <span />
                            <button
                                type="submit"
                                aria-label="Start chat"
                                disabled={!message.trim()}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF5722] text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-35"
                            >
                                <span className="text-lg leading-none">↑</span>
                            </button>
                        </div>
                    </form>

                    <p className="mt-3 text-center text-[11px] text-[#A0A0A0]">
                        Melo is AI and can make mistakes. Check important information.
                    </p>
                </div>
            </section>
        </main>
    );
}