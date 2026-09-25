import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiShield,
  FiX,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import MainLogoCard from "../assets/MainLogoCard.svg";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const legalSections = [
  {
    title: "1. Acceptance of Terms",
    body: "By using Melo, you agree to these Terms and the Melo Privacy Policy. These terms govern access to the AI assistant, account creation, content processing, and support services.",
  },
  {
    title: "2. AI Service Use",
    body: "Melo provides AI-generated recommendations, conversation support, and productivity assistance. Outputs may be incomplete or incorrect. You are responsible for reviewing any content before relying on it for important decisions.",
  },
  {
    title: "3. User Data and Privacy",
    body: "We collect and process account information, chat activity, and usage data to secure the platform and improve the service. We do not sell personal data and we use third-party processors only under strict confidentiality obligations.",
  },
  {
    title: "4. Prohibited Activity",
    body: "You may not use Melo for unlawful, abusive, harmful, deceptive, or spam-related activity. We may suspend or remove access when misuse is detected.",
  },
  {
    title: "5. Content Ownership",
    body: "You keep ownership of your input content, but you grant Melo a limited license to process, store, and improve the service in accordance with the Privacy Policy and these Terms.",
  },
  {
    title: "6. Liability and Safety",
    body: "Melo is provided as-is and is not liable for indirect, incidental, or consequential losses arising from use of the platform. Use good judgment and do not rely on AI output for medical, legal, or safety-critical decisions without review.",
  },
];

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[10px] border border-black/[0.06] bg-[#F7F6F3]">
        <img
          src={MainLogoCard}
          alt="Melo"
          className="h-full w-full object-contain"
        />
      </div>

      <span className="text-[17px] font-semibold tracking-[-0.04em] text-[#181716]">
        Melo
      </span>
    </div>
  );
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-[12px] font-medium tracking-[-0.01em] text-[#66625D]"
    >
      {children}
    </label>
  );
}

function LegalModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#171615]/35 p-4 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.985 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-[82vh] w-full max-w-2xl flex-col overflow-hidden border border-black/[0.08] bg-[#FCFBF8] shadow-[0_30px_100px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-center justify-between border-b border-black/[0.07] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center border border-black/[0.07] bg-white">
              <FiShield className="h-4 w-4 text-[#F15A24]" />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#99948D]">
                Legal
              </p>

              <h2 className="mt-0.5 text-[17px] font-semibold tracking-[-0.03em] text-[#1B1917]">
                Terms & Privacy
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close terms"
            className="flex h-8 w-8 items-center justify-center text-[#817C75] transition-colors hover:bg-black/[0.04] hover:text-[#181716]"
          >
            <FiX />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-7">
          <div className="space-y-7 text-[13px] leading-7 text-[#625E58]">
            <p>
              Melo is an AI companion designed to help you think, organize,
              and create. By using our product, you agree to comply with these
              terms and our privacy policy, which explains how we process your
              account details, conversation data, and platform usage.
            </p>

            {legalSections.map((section) => (
              <section key={section.title}>
                <h3 className="mb-1.5 text-[13px] font-semibold text-[#24211F]">
                  {section.title}
                </h3>

                <p>{section.body}</p>
              </section>
            ))}

            <section>
              <h3 className="mb-1.5 text-[13px] font-semibold text-[#24211F]">
                7. Acceptance
              </h3>

              <p>
                By continuing to use Melo, you confirm that you have read,
                understood, and accepted these Terms and our Privacy Policy. If
                you do not agree, do not use the service.
              </p>
            </section>
          </div>
        </div>

        <div className="border-t border-black/[0.07] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="ml-auto block bg-[#181716] px-5 py-2.5 text-[12px] font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DesktopAside() {
  return (
    <aside className="relative hidden min-h-screen flex-1 overflow-hidden bg-[#171615] lg:flex">
      <div className="absolute inset-0">
        <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-[#F15A24]/[0.08] blur-[100px]" />

        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-white/[0.035] blur-[100px]" />
      </div>

      <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
        <div className="flex items-center justify-between">
          <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/40">
            NeoMind Intelligence
          </div>

          <div className="h-px w-20 bg-white/10" />
        </div>

        <div className="max-w-xl">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 56 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-8 h-px bg-[#F15A24]"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-white/35"
          >
            Your space for thought
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08 }}
            className="max-w-[680px] text-[clamp(3.5rem,6vw,6.8rem)] font-medium leading-[0.9] tracking-[-0.075em] text-[#F4F1EA]"
          >
            Keep your
            <br />
            thoughts
            <br />
            moving.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-8 max-w-md text-[14px] leading-7 text-white/45"
          >
            Melo gives your ideas somewhere to go — conversations, questions,
            plans, and everything in between.
          </motion.p>
        </div>

        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-white/25">
          <span>01 / 02</span>
          <span>melo</span>
        </div>
      </div>
    </aside>
  );
}

function MobileIntro({
  onOpen,
}: {
  onOpen: () => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex min-h-screen flex-col bg-[#171615] px-6 py-7 lg:hidden"
    >
      <div className="flex items-center justify-between">
        <Brand />

        <span className="text-[10px] uppercase tracking-[0.16em] text-white/35">
          01 / 02
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 44 }}
          transition={{ duration: 0.7 }}
          className="mb-7 h-px bg-[#F15A24]"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/35"
        >
          Your space for thought
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="text-[clamp(3.8rem,18vw,6rem)] font-medium leading-[0.88] tracking-[-0.075em] text-[#F4F1EA]"
        >
          Keep
          <br />
          your
          <br />
          thoughts
          <br />
          moving.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.65, delay: 0.4 }}
          className="mt-7 max-w-xs text-[13px] leading-6 text-white/40"
        >
          Conversations, ideas and plans — all in one place.
        </motion.p>
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="group flex w-full items-center justify-between border-t border-white/10 py-5 text-left"
      >
        <span className="text-[12px] font-medium text-white/65">
          Continue to Melo
        </span>

        <span className="flex h-9 w-9 items-center justify-center border border-white/10 text-white transition-all group-hover:border-[#F15A24] group-hover:bg-[#F15A24]">
          <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </button>
    </motion.section>
  );
}

function LoginForm({
  onBack,
}: {
  onBack?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!email || !password || isLoading) return;

    try {
      await login({
        email,
        password,
      });

      navigate("/welcome");
    } catch {
      // AuthStore already stores the error.
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#FCFBF8] px-6 py-7 sm:px-12 lg:min-h-0 lg:px-16 xl:px-20">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute right-6 top-7 flex items-center gap-2 text-[11px] font-medium text-[#8B867E] transition-colors hover:text-[#181716] sm:right-12 lg:hidden"
        >
          <FiArrowLeft />
          Back
        </button>
      )}

      <div className="hidden lg:block">
        <Brand />
      </div>

      <div className="mx-auto flex w-full max-w-[390px] flex-1 flex-col justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#AAA49C]">
            Welcome back
          </p>

          <h1 className="text-[42px] font-medium leading-none tracking-[-0.065em] text-[#191817]">
            Good to see
            <br />
            you again<span className="text-[#F15A24]">.</span>
          </h1>

          <p className="mt-5 max-w-sm text-[13px] leading-6 text-[#88837B]">
            Pick up where you left off.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          onSubmit={handleSubmit}
          className="mt-10"
        >
          <div className="space-y-6">
            <div>
              <FieldLabel htmlFor="signin-email">Email</FieldLabel>

              <input
                id="signin-email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                className="w-full border-b border-[#D9D5CF] bg-transparent px-0 py-3 text-[14px] text-[#1C1A18] outline-none transition-colors placeholder:text-[#B7B2AA] focus:border-[#F15A24]"
              />
            </div>

            <div>
              <FieldLabel htmlFor="signin-password">
                Password
              </FieldLabel>

              <div className="relative">
                <input
                  id="signin-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Your password"
                  required
                  className="w-full border-b border-[#D9D5CF] bg-transparent px-0 py-3 pr-9 text-[14px] text-[#1C1A18] outline-none transition-colors placeholder:text-[#B7B2AA] focus:border-[#F15A24]"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#99938B] transition-colors hover:text-[#181716]"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 border-l-2 border-red-400 bg-red-50/60 px-3 py-2.5 text-[12px] leading-5 text-red-600"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group mt-8 flex w-full items-center justify-between bg-[#181716] px-5 py-4 text-[13px] font-medium text-white transition-all hover:bg-[#292725] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{isLoading ? "Signing in..." : "Continue"}</span>

            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            ) : (
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-8"
        >
          <div className="mb-5 flex items-center gap-4">
            <span className="h-px flex-1 bg-[#E7E3DD]" />
            <span className="text-[10px] uppercase tracking-[0.14em] text-[#AAA49C]">
              or
            </span>
            <span className="h-px flex-1 bg-[#E7E3DD]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex h-11 items-center justify-center gap-2 border border-[#DEDAD4] bg-transparent text-[11px] font-medium text-[#5E5A54] transition-colors hover:bg-white"
            >
              <FcGoogle className="h-4 w-4" />
              Google
            </button>

            <button
              type="button"
              className="flex h-11 items-center justify-center gap-2 border border-[#DEDAD4] bg-transparent text-[11px] font-medium text-[#5E5A54] transition-colors hover:bg-white"
            >
              <FaMicrosoft className="h-4 w-4 text-[#2F6FED]" />
              Microsoft
            </button>
          </div>

          <p className="mt-7 text-center text-[12px] text-[#8C877F]">
            New to Melo?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-medium text-[#F15A24] hover:underline"
            >
              Create an account
            </button>
          </p>
        </motion.div>
      </div>

      <div className="text-center text-[10px] leading-5 text-[#AAA49C]">
        By continuing, you agree to Melo&apos;s{" "}
        <button
          type="button"
          className="text-[#777169] underline underline-offset-2"
          onClick={() => window.dispatchEvent(new Event("open-melo-terms"))}
        >
          Terms
        </button>{" "}
        and Privacy Policy.
      </div>
    </div>
  );
}

export default function SignIn() {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [mobileAuthOpen, setMobileAuthOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#FCFBF8] text-[#181716]">
      <div className="hidden min-h-screen lg:flex">
        <DesktopAside />

        <section className="w-[46%] max-w-[650px]">
          <LoginForm />
        </section>
      </div>

      <div className="lg:hidden">
        <AnimatePresence mode="wait">
          {!mobileAuthOpen ? (
            <MobileIntro
              key="intro"
              onOpen={() => setMobileAuthOpen(true)}
            />
          ) : (
            <motion.div
              key="auth"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="min-h-screen"
            >
              <LoginForm onBack={() => setMobileAuthOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showTermsModal && (
          <LegalModal onClose={() => setShowTermsModal(false)} />
        )}
      </AnimatePresence>

      <button
        type="button"
        className="hidden"
        onClick={() => setShowTermsModal(true)}
      />
    </main>
  );
}