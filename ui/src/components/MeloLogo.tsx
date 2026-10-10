import { motion, useReducedMotion } from "framer-motion";
import mainLogoCard from "../assets/MainLogoCard.svg";

type MeloLogoProps = {
  isThinking?: boolean;
  label?: string;
  className?: string;
};

export default function MeloLogo({
  isThinking = false,
  label = "Melo",
  className = "h-8 w-8",
}: MeloLogoProps) {
  const reduceMotion = useReducedMotion();
  const animateThinking = isThinking && !reduceMotion;

  return (
    <motion.span
      role="img"
      aria-label={label}
      className={`relative inline-flex ${className}`}
      animate={animateThinking ? { scale: [1, 1.045, 1] } : { scale: 1 }}
      transition={
        animateThinking
          ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.4, ease: "easeOut" }
      }
    >
      <img
        src={mainLogoCard}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-contain"
      />

      <motion.svg
        viewBox="0 0 280 280"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        initial={false}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isThinking && (
          <>
            <rect x="48" y="52" width="184" height="36" fill="white" />

            <motion.g
              initial={reduceMotion ? false : { scaleY: 0.15 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: reduceMotion ? 0 : 0.22,
                ease: "easeOut",
              }}
              style={{ transformOrigin: "140px 70px" }}
            >
              <path
                d="M59 70C65 56 75 52 84 52C93 52 103 56 109 70C103 84 93 88 84 88C75 88 65 84 59 70Z"
                fill="white"
                stroke="#FF5722"
                strokeWidth="7"
                strokeLinejoin="round"
              />
              <path
                d="M171 70C177 56 187 52 196 52C205 52 215 56 221 70C215 84 205 88 196 88C187 88 177 84 171 70Z"
                fill="white"
                stroke="#FF5722"
                strokeWidth="7"
                strokeLinejoin="round"
              />
            </motion.g>

            <motion.g
              animate={
                animateThinking
                  ? { x: [0, -7, 7, 0] }
                  : { x: 0 }
              }
              transition={{
                duration: 1.6,
                repeat: 0,
                times: [0, 0.3, 0.7, 1],
                ease: "easeInOut",
              }}
              fill="#FF5722"
            >
              <circle cx="84" cy="70" r="6" />
              <circle cx="196" cy="70" r="6" />
            </motion.g>
          </>
        )}
      </motion.svg>
    </motion.span>
  );
}
