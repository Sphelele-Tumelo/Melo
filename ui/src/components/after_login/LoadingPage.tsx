import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainCardLogo from "../../assets/MainLogoCard.svg";

export default function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      navigate("/app", { replace: true });
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [navigate]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex min-h-screen flex-col overflow-hidden bg-white font-sans text-[#12111A]"
    >
      {/* Soft ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#FFF4EC] blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-120px] h-[420px] w-[420px] rounded-full bg-[#F4F1FF] blur-3xl" />
      </div>

      {/* Main content */}
      <section className="relative flex flex-1 items-center justify-center px-6">
        <div className="flex w-full max-w-xl flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.75, opacity: 0, y: 14 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FFF8EC] shadow-[0_20px_50px_rgba(255,87,34,0.10)]"
          >
            <img
              src={MainCardLogo}
              alt="Melo logo"
              className="h-14 w-14 object-contain"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.12,
              duration: 0.5,
              ease: "easeOut",
            }}
            className="text-[clamp(2.25rem,6vw,3.5rem)] font-semibold leading-none tracking-[-0.065em] text-[#1C1823]"
          >
            Welcome back
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.24,
              duration: 0.5,
              ease: "easeOut",
            }}
            className="mt-3 max-w-md text-[15px] leading-6 text-[#747079] sm:text-base"
          >
            We&apos;ve saved your place. Let&apos;s continue where you left off.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.4,
              duration: 0.4,
            }}
            className="mt-9 flex items-center gap-2.5"
            aria-label="Loading"
          >
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.1,
                  ease: "easeInOut",
                  delay: dot * 0.14,
                }}
                className="h-2.5 w-2.5 rounded-full bg-[#FF5722]"
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Brand attribution */}
      <motion.footer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.55,
          duration: 0.45,
        }}
        className="relative flex justify-center pb-10"
      >
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-[#A09BA3]">
            A product by
          </span>

          <span className="mt-1.5 text-[13px] font-semibold tracking-[-0.03em] text-[#27232B]">
            Neo<span className="text-[#FF5722]">Mind</span>
          </span>
        </div>
      </motion.footer>
    </motion.main>
  );
}