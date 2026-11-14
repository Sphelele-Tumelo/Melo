import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiChevronDown, FiGlobe } from "react-icons/fi";
import mainLogoCard from "../assets/MainLogoCard.svg";
import type { MeloActivity, WebSource } from "../api/message";

// Only used when the server hasn't sent a real status yet.
const FILLER_LABELS = [
  "Connecting the dots",
  "Working through it",
  "Checking the logic",
  "Cooking something up",
  "Almost there",
  "Consulting the imaginary whiteboard",
];

const ACTIVITY_LABELS: Record<Exclude<MeloActivity, "idle">, string> = {
  searching_memories: "Remembering",
  searching_web: "Searching the web",
  reading_sources: "Reading sources",
  preparing_answer: "Putting it together",
};

function useElapsedSeconds() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  return seconds;
}

// Rendered with key={activity}, so its timer restarts on every new step.
function StatusLabel({ activity }: { activity: MeloActivity }) {
  const seconds = useElapsedSeconds();

  let label: string;

  if (activity === "idle") {
    label =
      seconds < 4
        ? "Thinking"
        : (FILLER_LABELS[Math.floor((seconds - 4) / 3) % FILLER_LABELS.length] ??
          "Thinking");
  } else if (activity === "searching_web" && seconds >= 8) {
    label = "Search is slow today, still trying";
  } else {
    label = ACTIVITY_LABELS[activity];
  }

  return (
    <motion.span
      key={label}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="melo-shimmer min-w-0 text-[13px] font-medium"
    >
      {label}
      <motion.span
        aria-hidden="true"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="inline-block w-5 text-left"
      >
        ...
      </motion.span>
    </motion.span>
  );
}

function LogoOrb({ orbiting }: { orbiting: boolean }) {
  return (
    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
      <motion.img
        src={mainLogoCard}
        alt=""
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="h-full w-full"
      />

      {orbiting && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{
            opacity: { duration: 0.2 },
            rotate: { duration: 1.6, repeat: Infinity, ease: "linear" },
          }}
          className="pointer-events-none absolute -inset-1.5"
        >
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#FF5722]" />
        </motion.div>
      )}
    </div>
  );
}

function domainOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function SourceChips({
  sources,
  max = 4,
}: {
  sources: WebSource[];
  max?: number;
}) {
  const visible = sources.slice(0, max);
  const extra = sources.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map((source, index) => (
        <motion.a
          key={source.id}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          title={source.title}
          initial={{ opacity: 0, scale: 0.85, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 24,
            delay: index * 0.08,
          }}
          className="inline-flex max-w-40 items-center gap-1 rounded-full border border-[#E9E9E9] bg-white px-2.5 py-1 text-[11px] font-medium text-[#5F6368] transition-colors hover:bg-[#F5F5F5] hover:text-[#202124]"
        >
          <FiGlobe className="h-3 w-3 shrink-0" />
          <span className="truncate">{domainOf(source.url)}</span>
        </motion.a>
      ))}

      {extra > 0 && (
        <span className="text-[11px] text-[#8A8F98]">+{extra}</span>
      )}
    </div>
  );
}

// Collapsed line shown under a finished reply.
export function SourcesFooter({ sources }: { sources: WebSource[] }) {
  const [open, setOpen] = useState(false);

  if (sources.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex items-center gap-1 text-[12px] text-[#8A8F98] transition-colors hover:text-[#5F6368]"
      >
        Used {sources.length} {sources.length === 1 ? "source" : "sources"}
        <FiChevronDown
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-2">
          <SourceChips sources={sources} max={10} />
        </div>
      )}
    </div>
  );
}

type ThinkingIndicatorProps = {
  activity: MeloActivity;
  sources: WebSource[];
};

export default function ThinkingIndicator({
  activity,
  sources,
}: ThinkingIndicatorProps) {
  const orbiting =
    activity === "searching_web" || activity === "reading_sources";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      role="status"
      aria-live="polite"
      className="flex min-w-0 flex-col gap-2"
    >
      <div className="flex min-w-0 items-center gap-3">
        <LogoOrb orbiting={orbiting} />
        <StatusLabel key={activity} activity={activity} />
      </div>

      {sources.length > 0 && (
        <div className="pl-12">
          <SourceChips sources={sources} />
        </div>
      )}
    </motion.div>
  );
}