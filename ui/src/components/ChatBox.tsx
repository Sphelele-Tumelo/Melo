import { useState } from "react";
import { FiCode, FiImage, FiSmile } from "react-icons/fi";
import mainLogoCard from "../assets/MainLogoCard.svg";
import { getGreeting } from "../utils/greetings";

type ChatBoxProps = {
    onStartChat: (message: string) => void;
    displayName: string | null;
};

export default function ChatBox({
    onStartChat,
    displayName,
}: ChatBoxProps) {
    const [message, setMessage] = useState("");

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
            <header className="flex h-16 items-center justify-end px-4 sm:px-8">
                <button
                    type="button"
                    className="rounded-full px-3 py-2 text-sm font-medium text-[#5F6368] transition-colors hover:bg-[#F5F5F5] hover:text-[#202124]"
                >
                    Melo
                </button>
            </header>

            <section className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-8 pt-12 sm:px-5 sm:pb-10 sm:pt-0">
                <div className="w-full max-w-180">

                    {/* Greeting */}
                    <div className="mb-10 text-center">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center">
                            <img
                                src={mainLogoCard}
                                alt="Melo"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <h1 className="text-center text-[clamp(24px,7vw,30px)] font-medium tracking-[-0.03em] text-[#12111A]">
                            {greeting.title}
                        </h1>

                        <p className="mt-2 text-[16px] text-[#8A8F98]">
                            {greeting.subtitle}
                        </p>
                    </div>

                    {/* Suggestions */}
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

                    {/* Prompt box */}
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
                                if (
                                    event.key === "Enter" &&
                                    !event.shiftKey
                                ) {
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
                                <span className="text-lg leading-none">
                                    ↑
                                </span>
                            </button>
                        </div>
                    </form>

                    <p className="mt-3 text-center text-[11px] text-[#A0A0A0]">
                        Melo is AI and can make mistakes. Check important
                        information.
                    </p>
                </div>
            </section>
        </main>
    );
}