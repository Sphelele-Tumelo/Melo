import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiGlobe, FiPlus, FiX } from "react-icons/fi";

type ComposerToolsProps = {
  webSearch: boolean;
  onToggleWebSearch: () => void;
};

export default function ComposerTools({
  webSearch,
  onToggleWebSearch,
}: ComposerToolsProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative flex items-center gap-1.5">
      <button
        type="button"
        aria-label={open ? "Close tools" : "Open tools"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-[#8A8F98] transition-colors hover:bg-[#F5F5F5] hover:text-[#202124]"
      >
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="flex"
        >
          <FiPlus className="h-[18px] w-[18px]" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {webSearch && (
          <motion.button
            type="button"
            aria-label="Turn off web search"
            onClick={onToggleWebSearch}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 rounded-full bg-[#FFF0E9] px-2.5 py-1 text-xs font-medium text-[#FF5722]"
          >
            <FiGlobe className="h-3.5 w-3.5" />
            Search
            <FiX className="h-3 w-3" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute bottom-full left-0 z-30 mb-2 w-56 rounded-xl border border-[#E9E9E9] bg-white p-1 shadow-[0_8px_30px_rgba(18,17,26,0.12)]"
          >
            <button
              type="button"
              onClick={() => {
                onToggleWebSearch();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-[#12111A] transition-colors hover:bg-[#F5F5F5]"
            >
              <FiGlobe className="h-4 w-4 text-[#5F6368]" />
              <span className="flex-1">Web search</span>
              {webSearch && <FiCheck className="h-4 w-4 text-[#FF5722]" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}