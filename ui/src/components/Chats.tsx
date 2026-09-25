import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import mainLogoCard from "../assets/MainLogoCard.svg";
import {
  FiArrowUp,
  FiCopy,
  FiEdit2,
  FiHeart,
  FiMoreHorizontal,
  FiPaperclip,
  FiRefreshCw,
  FiShare2,
  FiThumbsDown,
  FiThumbsUp,
  FiVolume2,
} from "react-icons/fi";
import type { Message } from "../api/message";

import MarkdownMessage from "./MarkdownMessage"

type ChatsProps = {
  messages: Message[];
  isThinking: boolean;
  conversationTitle: string;
  onSend: (content: string) => void;
  onRestart: () => void;
};

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="rounded-lg p-1.5 text-[#969696] transition-colors hover:bg-[#F5F5F5] hover:text-[#363636]"
    >
      {children}
    </button>
  );
}

export default function Chats({
  messages,
  isThinking,
  conversationTitle,
  onSend,
  onRestart,
}: ChatsProps) {
  const [draft, setDraft] = useState("");
  const [liked, setLiked] = useState<boolean | null>(null);
  
  // ✅ Changed from number | null to string | null
  const [copied, setCopied] = useState<string | null>(null);


  const [hasStartedResponse, setHasStartedResponse] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [thinkingLabel, setThinkingLabel] = useState("Thinking");


  const [showCatchUp, setShowCatchUp] = useState(false);

  const scrollContainerRef = useRef<HTMLElement>(null);
  const shouldAutoScrollRef = useRef(true);

  useEffect(() => {
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");

  if (lastAssistantMessage?.content) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasStartedResponse(true);
  }

  if (!isThinking) {
    setHasStartedResponse(false);
  }
}, [messages, isThinking]);


useEffect(() => {
  if (!shouldAutoScrollRef.current) return;

  const container = scrollContainerRef.current;

  if (!container) return;

  requestAnimationFrame(() => {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "auto",
    });
  });
}, [messages]);

function handleScroll() {
  const container = scrollContainerRef.current;

  if (!container) return;

  const distanceFromBottom =
    container.scrollHeight -
    container.scrollTop -
    container.clientHeight;

  const nearBottom = distanceFromBottom < 120;

  shouldAutoScrollRef.current = nearBottom;

  setShowCatchUp(!nearBottom && isThinking);
}

  
  useEffect(() => {
    if (!isThinking) return;

    const thinkingLabels = [
      "Thinking",
      "Contemplating",
      "Connecting the dots",
      "Putting it together",
      "Working through it",
      "Crunching the details",
      "Checking the logic",
      "Connecting a few neurons",
      "Cooking something up",
      "Almost there",
      "One second...",
      "Let me think about that",
      "Making sense of it",
      "Running the mental gymnastics",
      "Consulting the imaginary whiteboard",
    ];
    let labelIndex = 0;
    const interval = window.setInterval(() => {
      labelIndex = (labelIndex + 1) % thinkingLabels.length;
      setThinkingLabel(thinkingLabels[labelIndex]);
    }, 1500);

    return () => window.clearInterval(interval);
  }, [isThinking]);

  async function copyMessage(message: Message) {
    await navigator.clipboard?.writeText(message.content);
    setCopied(message.id);
    window.setTimeout(() => setCopied(null), 1400);
  }

  async function shareChat() {
    const text = messages
      .map(
        (message) =>
          `${message.role === "user" ? "You" : "Melo"}: ${message.content}`
      )
      .join("\n\n");
    if (navigator.share) await navigator.share({ title: "Melo conversation", text });
    else await navigator.clipboard?.writeText(text);
  }

  function submitDraft() {
    if (!draft.trim()) return;
    onSend(draft.trim());
    setDraft("");
  }

  function editLastPrompt() {
    const lastUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user");
    if (lastUserMessage) setDraft(lastUserMessage.content);
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-white">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#F0F0F0] px-4 pl-16 sm:px-7 sm:pl-7">
        <span className="text-[14px] font-medium text-[#6F6F6F]">{conversationTitle || ""}</span>
        <div className="flex items-center gap-1">
          <IconButton label="Share conversation" onClick={shareChat}>
            <FiShare2 className="h-4 w-4" />
          </IconButton>
          <IconButton label="Restart conversation" onClick={onRestart}>
            <FiRefreshCw className="h-4 w-4" />
          </IconButton>
          <IconButton label="More options">
            <FiMoreHorizontal className="h-4 w-4" />
          </IconButton>
        </div>
      </header>

      <section
  ref={scrollContainerRef}
  onScroll={handleScroll}
  className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-5 sm:py-8"
>
        <div className="mx-auto flex w-full max-w-180 flex-col gap-8">
          <AnimatePresence initial={false} mode="popLayout">
            {messages
              .filter((message) => !(message.role === "assistant" && message.content === ""))
              .map((message, index) => (
              <motion.article
                key={message.id}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.32,
                  delay: index === messages.length - 1 ? 0.05 : 0,
                }}
                className={
                  message.role === "user" ? "flex justify-end" : "flex gap-3"
                }
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                    <img
                      src={mainLogoCard}
                      alt="Melo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <div
                  className={
                    message.role === "user" ? "max-w-[78%]" : "max-w-[88%]"
                  }
                >
                  <div className={message.role === "user" ? "..." : "pt-1 text-[16px] leading-7 text-[#303030]"}>
                    {message.role === "assistant" ? (
                      isThinking && message === [...messages].reverse().find(
                        (item) => item.role === "assistant"
                      ) ? (
                        <div className="whitespace-pre-wrap">
                          {message.content}
                        </div>
                      ) : (
                        <MarkdownMessage content={message.content} />
                      )
                    ) : (
                      message.content
                    )}
                  </div>
                  {message.role === "user" ? (
                    <div className="mt-1 flex justify-end">
                      <IconButton
                        label="Edit prompt"
                        onClick={editLastPrompt}
                      >
                        <FiEdit2 className="h-3.5 w-3.5" />
                      </IconButton>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center gap-0.5">
                      <IconButton
                        label={
                          copied === message.id ? "Copied" : "Copy response"
                        }
                        onClick={() => copyMessage(message)}
                      >
                        <FiCopy className="h-3.5 w-3.5" />
                      </IconButton>
                      <IconButton label="Read response aloud">
                        <FiVolume2 className="h-3.5 w-3.5" />
                      </IconButton>
                      <IconButton
                        label="Like response"
                        onClick={() => setLiked(true)}
                      >
                        <FiThumbsUp
                          className={`h-3.5 w-3.5 ${
                            liked === true ? "fill-[#FF5722] text-[#FF5722]" : ""
                          }`}
                        />
                      </IconButton>
                      <IconButton
                        label="Dislike response"
                        onClick={() => setLiked(false)}
                      >
                        <FiThumbsDown
                          className={`h-3.5 w-3.5 ${
                            liked === false ? "fill-[#FF5722] text-[#FF5722]" : ""
                          }`}
                        />
                      </IconButton>
                      <IconButton label="More response actions">
                        <FiHeart className="h-3.5 w-3.5" />
                      </IconButton>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}

           
          </AnimatePresence>


          {showCatchUp && (
            <button
              type="button"
              onClick={() => {
                const container = scrollContainerRef.current;
          
                if (!container) return;
          
                shouldAutoScrollRef.current = true;
                setShowCatchUp(false);
          
                container.scrollTo({
                  top: container.scrollHeight,
                  behavior: "smooth",
                });
              }}
            >
              ↓
            </button>
          )}

          <AnimatePresence>
            {isThinking && !hasStartedResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.08, 1],
                    rotate: [-3, 3, -3],
                    boxShadow: [
                      "0 0 0 0 rgba(255, 87, 34, 0)",
                      "0 0 0 7px rgba(255, 87, 34, 0.10)",
                      "0 0 0 0 rgba(255, 87, 34, 0)",
                    ],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex h-9 w-9 items-center justify-center"
                >
                  <img
                    src={mainLogoCard}
                    alt="Melo is thinking"
                    className="h-full w-full"
                  />
                </motion.div>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={thinkingLabel}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[13px] font-medium text-[#8A8F98]"
                  >
                    {thinkingLabel}
                    <span className="inline-block w-6 text-left">
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      >
                        ...
                      </motion.span>
                    </span>
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <div className="w-full shrink-0 px-3 pb-3 sm:px-5 sm:pb-5">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitDraft();
          }}
          className="mx-auto max-w-180 rounded-2xl border border-[#DCDCDC] bg-white p-2 shadow-[0_4px_20px_rgba(18,17,26,0.06)] focus-within:border-[#BDBDBD]"
        >
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submitDraft();
              }
            }}
            rows={2}
            placeholder={
              voiceMode ? "Voice mode is ready..." : "Message Melo..."
            }
            aria-label="Message Melo"
            className="block w-full resize-none bg-transparent px-3 py-2 text-[16px] font-medium text-[#12111A] outline-none placeholder:text-[#A0A0A0]"
          />
          <div className="flex items-center justify-between px-1">
            <IconButton label="Attach a file">
              <FiPaperclip className="h-4 w-4" />
            </IconButton>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Toggle voice mode"
                title="Voice mode"
                onClick={() => setVoiceMode((active) => !active)}
                className={`rounded-lg p-2 transition-colors ${
                  voiceMode
                    ? "bg-[#FFF0E9] text-[#FF5722]"
                    : "text-[#8A8F98] hover:bg-[#F5F5F5] hover:text-[#202124]"
                }`}
              >
                <FiVolume2 className="h-4 w-4" />
              </button>
              <button
                type="submit"
                aria-label="Send message"
                disabled={!draft.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF5722] text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <FiArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
        <p className="mt-3 text-center text-[11px] text-[#A0A0A0]">
          Melo is AI and can make mistakes. Check important information.
        </p>
      </div>
    </main>
  );
}