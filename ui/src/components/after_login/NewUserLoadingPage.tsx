import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainCardLogo from "../../assets/MainLogoCard.svg";

const scenes = [
  {
    word: "THINK",
    eyebrow: "Start with a thought.",
    description: "Give your ideas somewhere to begin.",
    gradient:
      "radial-gradient(circle at 15% 50%, rgba(124,58,237,0.18), transparent 42%), radial-gradient(circle at 80% 20%, rgba(167,139,250,0.10), transparent 38%)",
    accent: "#7C3AED",
    direction: -80,
  },
  {
    word: "LIVE",
    eyebrow: "Make space for life.",
    description: "Plan, reflect, create, and keep moving.",
    gradient:
      "radial-gradient(circle at 50% 100%, rgba(255,87,34,0.20), transparent 45%), radial-gradient(circle at 85% 25%, rgba(255,179,0,0.12), transparent 38%)",
    accent: "#FF5722",
    direction: 70,
  },
  {
    word: "BUILD",
    eyebrow: "Turn thoughts into action.",
    description: "Make something real, one step at a time.",
    gradient:
      "radial-gradient(circle at 85% 50%, rgba(255,179,0,0.20), transparent 42%), radial-gradient(circle at 20% 20%, rgba(255,87,34,0.10), transparent 38%)",
    accent: "#FFB300",
    direction: 80,
  },
];

export default function NewUserLoadingPage() {
  const navigate = useNavigate();

  const [sceneIndex, setSceneIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const sceneTimer = window.setInterval(() => {
      setSceneIndex((current) => {
        if (current >= scenes.length - 1) {
          window.clearInterval(sceneTimer);
          return current;
        }

        return current + 1;
      });
    }, 1600);

    const finishTimer = window.setTimeout(() => {
      setFinished(true);
    }, 4500);

    const redirectTimer = window.setTimeout(() => {
      navigate("/app", { replace: true });
    }, 5000);

    return () => {
      window.clearInterval(sceneTimer);
      window.clearTimeout(finishTimer);
      window.clearTimeout(redirectTimer);
    };
  }, [navigate]);

  const scene = scenes[sceneIndex];

  return (
    <main className="fixed inset-0 z-50 min-h-screen overflow-hidden bg-[#FFFDFB] font-sans text-[#12111A]">
      {/* Ambient scene background */}
      <AnimatePresence mode="sync">
        {!finished && (
          <motion.div
            key={`background-${scene.word}`}
            initial={{
              opacity: 0,
              scale: 1.08,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1.02,
            }}
            transition={{
              duration: 1.2,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute inset-0"
            style={{
              background: scene.gradient,
            }}
          />
        )}
      </AnimatePresence>

      {/* Soft white veil */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.62)_45%,rgba(255,255,255,0.82)_100%)]" />

      {/* Subtle grain-like grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] `bg-[linear-gradient(#12111A_1px,transparent_1px),linear-gradient(90deg,#12111A_1px,transparent_1px)] bg-size-[48px_48px]" />

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-14">
        {/* Top brand */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 shadow-[0_12px_30px_rgba(18,17,26,0.07)] backdrop-blur-md">
              <img
                src={MainCardLogo}
                alt="Melo"
                className="h-7 w-7 object-contain"
              />
            </div>

            <span className="text-[18px] font-semibold tracking-[-0.045em] text-[#1A1720]">
              Melo
            </span>
          </div>

          <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#96919A]">
            Welcome
          </div>
        </motion.header>

        {/* Main animation */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative flex w-full max-w-6xl items-center justify-center">
            <AnimatePresence mode="wait">
              {!finished ? (
                <motion.div
                  key={scene.word}
                  initial={{
                    opacity: 0,
                    x: scene.direction,
                    scale: 0.92,
                    filter: "blur(12px)",
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    x: scene.direction * -0.45,
                    scale: 1.03,
                    filter: "blur(10px)",
                  }}
                  transition={{
                    duration: 0.75,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex w-full flex-col items-center text-center"
                >
                  {/* Eyebrow */}
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.12,
                      duration: 0.45,
                    }}
                    className="mb-7 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#77717C]"
                  >
                    {scene.eyebrow}
                  </motion.p>

                  {/* Main word */}
                  <div className="relative overflow-hidden">
                    <motion.h1
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{
                        delay: 0.08,
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="select-none text-[clamp(5rem,18vw,13rem)] font-semibold leading-[0.78] tracking-[-0.09em] text-[#17131C]"
                    >
                      {scene.word}
                    </motion.h1>
                  </div>

                  {/* Accent line */}
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 72, opacity: 1 }}
                    transition={{
                      delay: 0.35,
                      duration: 0.55,
                      ease: "easeOut",
                    }}
                    className="mt-9 h-0.75 rounded-full"
                    style={{
                      backgroundColor: scene.accent,
                    }}
                  />

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.42,
                      duration: 0.45,
                    }}
                    className="mt-6 max-w-sm text-sm leading-6 text-[#716B74] sm:text-base"
                  >
                    {scene.description}
                  </motion.p>
                </motion.div>
              ) : (
                /* Final Melo reveal */
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex flex-col items-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.1,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FFF1E9] shadow-[0_22px_60px_rgba(255,87,34,0.14)]"
                  >
                    <img
                      src={MainCardLogo}
                      alt="Melo"
                      className="h-14 w-14 object-contain"
                    />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.22,
                      duration: 0.55,
                    }}
                    className="text-[clamp(2.7rem,7vw,5rem)] font-semibold leading-none tracking-[-0.075em] text-[#17131C]"
                  >
                    Welcome to Melo.
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.34,
                      duration: 0.5,
                    }}
                    className="mt-4 text-base text-[#716B74] sm:text-lg"
                  >
                    Build. Think. Live.
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom attribution */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.7,
            duration: 0.5,
          }}
          className="flex items-end justify-between"
        >
          <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#A09BA3]">
            Your space
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#AAA5AD]">
              A product by
            </span>

            <span className="mt-1 text-[12px] font-semibold tracking-[-0.03em] text-[#2A252D]">
              Neo<span className="text-[#FF5722]">Mind</span>
            </span>
          </div>
        </motion.footer>
      </div>
    </main>
  );
}