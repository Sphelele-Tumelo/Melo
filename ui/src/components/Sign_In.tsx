import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight, FiEye, FiEyeOff, FiShield, FiX } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import MainLogoCard from "../assets/MainLogoCard.svg";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const legalSections = [
	{
		title: "1. Acceptance of Terms",
		body: "By using Melo, you agree to these Terms and the Melo Privacy Policy. These terms govern access to the AI assistant, account creation, content processing, and support services." 
	},
	{
		title: "2. AI Service Use",
		body: "Melo provides AI-generated recommendations, conversation support, and productivity assistance. Outputs may be incomplete or incorrect. You are responsible for reviewing any content before relying on it for important decisions." 
	},
	{
		title: "3. User Data and Privacy",
		body: "We collect and process account information, chat activity, and usage data to secure the platform and improve the service. We do not sell personal data and we use third-party processors only under strict confidentiality obligations." 
	},
	{
		title: "4. Prohibited Activity",
		body: "You may not use Melo for unlawful, abusive, harmful, deceptive, or spam-related activity. We may suspend or remove access when misuse is detected." 
	},
	{
		title: "5. Content Ownership",
		body: "You keep ownership of your input content, but you grant Melo a limited license to process, store, and improve the service in accordance with the Privacy Policy and these Terms." 
	},
	{
		title: "6. Liability and Safety",
		body: "Melo is provided as-is and is not liable for indirect, incidental, or consequential losses arising from use of the platform. Use good judgment and do not rely on AI output for medical, legal, or safety-critical decisions without review." 
	},
];

const panelWords = [
	{ text: "Build.", color: "#25167D", initial: { y: 100 } },
	{ text: "Think.", color: "#FF6B4A", initial: { x: 140 } },
	{ text: "Live.", color: "#159A9C", initial: { y: 100 } },
];

function AnimatedValues() {
	const [step, setStep] = useState(0);

	useEffect(() => {
		const interval = window.setInterval(() => {
			setStep((current) => (current + 1) % 5);
		}, 1550);

		return () => window.clearInterval(interval);
	}, []);

	return (
		<section className="relative hidden min-h-screen overflow-hidden bg-[#FFF9F2] p-10 lg:flex lg:flex-1 lg:flex-col lg:justify-between">
			<div className="absolute inset-0 bg-[linear-gradient(145deg,#FFF4E5_0%,#FFFFFF_52%,#E5FAF7_100%)]" />
			<div className="relative z-10 flex items-center justify-between text-sm font-medium text-[#706B7A]">
				<span className="tracking-[-0.02em] text-[#16131A]">Melo</span>
				<span className="rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-xs">AI companion</span>
			</div>

			<div className="relative z-10 mx-auto flex w-full max-w-150 flex-1 flex-col justify-center py-16">
				<p className="mb-7 text-xs font-semibold uppercase tracking-[0.2em] text-[#8E8898]">Intelligence that stays with you</p>
				<div className="relative flex h-67.5 items-center overflow-hidden sm:h-80">
					<AnimatePresence mode="wait">
						{step < panelWords.length ? (
							<motion.div
								key={panelWords[step].text}
								initial={{ opacity: 0, ...panelWords[step].initial }}
								animate={{ opacity: 1, x: 0, y: 0 }}
								exit={{ opacity: 0, y: -35, x: 20 }}
								transition={{ duration: 0.55, ease: "easeOut" }}
								className="text-[clamp(4rem,9vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.07em]"
								style={{ color: panelWords[step].color }}
							>
								{panelWords[step].text}
							</motion.div>
						) : (
							<motion.div
								key="all-words"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.65, ease: "easeOut" }}
								className="flex flex-wrap items-baseline gap-x-5 gap-y-2 text-[clamp(3.5rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.07em]"
							>
								{panelWords.map((word) => <span key={word.text} style={{ color: word.color }}>{word.text}</span>)}
							</motion.div>
						)}
					</AnimatePresence>
					<motion.div animate={{ opacity: step === 3 ? 1 : 0, y: step === 3 ? 0 : 12 }} transition={{ duration: 0.4 }} className="absolute bottom-2 left-0 text-[clamp(1.5rem,3vw,2.5rem)] font-medium tracking-tighter text-[#25212B]">made for your next thought.</motion.div>
				</div>
			</div>

			<div className="relative z-10 flex items-end justify-between text-xs text-[#817B88]">
				<span>Build ideas. Think clearly. Live fully.</span>
				<span>NeoMind Intelligence.com</span>
			</div>
		</section>
	);
}


function MobileAnimatedValues() {
    const [step, setStep] = useState(0);

    const words = [
        { text: "Build.", color: "#25167D" },
        { text: "Think.", color: "#FF6B4A" },
        { text: "Live.", color: "#159A9C" },
    ];

    useEffect(() => {
        const interval = window.setInterval(() => {
            setStep((current) => (current + 1) % words.length);
        }, 1550);

        return () => window.clearInterval(interval);
    }, );

    return (
        <section className="flex min-h-45 items-center justify-center overflow-hidden bg-[#FFF9F2] px-6 lg:hidden">
            <div className="text-center">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8E8898]">
                    Intelligence that stays with you
                </p>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={words[step].text}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.45 }}
                        className="text-5xl font-semibold tracking-[-0.07em]"
                        style={{ color: words[step].color }}
                    >
                        {words[step].text}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showTermsModal, setShowTermsModal] = useState(false);

	const { login, isLoading, error } = useAuthStore();
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
		<main className="flex min-h-screen flex-col bg-white text-[#12111A] lg:flex-row">
			<section className="flex w-full flex-col px-6 py-8 sm:px-12 lg:w-[46%] lg:max-w-155 lg:px-20">
				<div className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0E9] text-sm font-semibold text-[#FF5722]">
						<img src={MainLogoCard} alt="Melo" className="h-full w-full object-contain" />
					</div>
					<span className="text-[18px] font-medium tracking-[-0.03em]">Melo</span>
				</div>

				<div className="mx-auto flex w-full max-w-95 flex-1 flex-col justify-center py-12">
					<motion.div
						initial="hidden"
						animate="visible"
						variants={{
							hidden: {},
							visible: { transition: { staggerChildren: 0.1 } },
						}}
					>
						<motion.div
							variants={{
								hidden: { opacity: 0, scale: 0.6, rotate: -18 },
								visible: { opacity: 1, scale: 1, rotate: 0 },
							}}
							transition={{ type: "spring", stiffness: 300, damping: 16 }}
							className="mb-5 inline-block text-3xl text-[#FFB000]"
						>
							✦
						</motion.div>

						<motion.h1
							variants={{
								hidden: { opacity: 0, y: 16 },
								visible: { opacity: 1, y: 0 },
							}}
							transition={{ duration: 0.4 }}
							className="text-[32px] font-medium tracking-[-0.04em]"
						>
							Welcome back
							<span className="text-[#FF6B4A]">.</span>
						</motion.h1>

						<motion.p
							variants={{
								hidden: { opacity: 0, y: 12 },
								visible: { opacity: 1, y: 0 },
							}}
							transition={{ duration: 0.4 }}
							className="mt-2 text-[14px] leading-6 text-[#8A8F98]"
						>
							Your thoughts have been waiting. Let&apos;s pick up where you left off.
						</motion.p>
					</motion.div>

					<motion.form
						initial={{ opacity: 0, y: 18 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.32 }}
						onSubmit={handleSubmit}
						className="mt-9 space-y-4"
					>
						<label className="block text-[12px] font-medium text-[#59545E]">
							Email
							<input
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								type="email"
								autoComplete="email"
								placeholder="you@example.com"
								required
								className="mt-2 block w-full rounded-xl border border-[#DFDDE2] px-4 py-3 text-[14px] outline-none transition-colors placeholder:text-[#B1AEB5] focus:border-[#FF5722]"
							/>
						</label>

						<label className="block text-[12px] font-medium text-[#59545E]">
							Password
							<span className="relative mt-2 block">
								<input
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									placeholder="Your password"
									required
									className="block w-full rounded-xl border border-[#DFDDE2] px-4 py-3 pr-11 text-[14px] outline-none transition-colors placeholder:text-[#B1AEB5] focus:border-[#FF5722]"
								/>
								<button
									type="button"
									aria-label={showPassword ? "Hide password" : "Show password"}
									onClick={() => setShowPassword((visible) => !visible)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-[#96919A] hover:text-[#363139]"
								>
									{showPassword ? <FiEyeOff /> : <FiEye />}
								</button>
							</span>
						</label>
						{error && (
                            <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600">
                                {error}
                            </p>
                        )}

						<button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5722] px-4 py-3 text-[14px] font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#E94C1C] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign in
                                <FiArrowRight />
                            </>
                        )}
                    </button>
					</motion.form>

					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
						<div className="my-7 flex items-center gap-3 text-xs text-[#AAA5AD]">
							<span className="h-px flex-1 bg-[#ECE9ED]" />
							or
							<span className="h-px flex-1 bg-[#ECE9ED]" />
						</div>

						<div className="space-y-3">
							<button
								type="button"
								className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#DFDDE2] px-4 py-3 text-[14px] font-medium text-[#48434C] transition-colors hover:bg-[#FAF9FB]"
							>
								<FcGoogle className="h-5 w-5 shrink-0" />
								<span>Continue with Google</span>
							</button>

							<button
								type="button"
								className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#DFDDE2] px-4 py-3 text-[14px] font-medium text-[#48434C] transition-colors hover:bg-[#FAF9FB]"
							>
								<FaMicrosoft className="h-5 w-5 shrink-0 text-[#2F6FED]" />
								<span>Continue with Microsoft</span>
							</button>
						</div>

						<p className="mt-7 text-center text-[13px] text-[#8A8F98]">
							New to Melo?
							<button
								type="button"
								onClick={() => navigate("/signup")}
								className="font-medium text-[#FF6B4A] hover:underline"
							>
								Create an account
							</button>
						</p>
					</motion.div>
				</div>

				<p className="text-center text-[11px] text-[#B0ABB2]">
					By continuing, you agree to Melo&apos;s
					<button
						type="button"
						onClick={() => setShowTermsModal(true)}
						className="ml-1 font-medium text-[#FF6B4A] hover:underline"
					>
						Terms
					</button>
					and
					<button
						type="button"
						onClick={() => setShowTermsModal(true)}
						className="ml-1 font-medium text-[#FF6B4A] hover:underline"
					>
						Privacy Policy
					</button>
				</p>
			</section>

			{showTermsModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12111A]/40 p-4 backdrop-blur-[2px]">
					<div className="flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-[#ECE9ED] bg-white shadow-[0_28px_80px_rgba(18,17,26,0.18)]">
						<div className="flex items-center justify-between border-b border-[#F1EFEF] px-5 py-4 sm:px-6">
							<div className="flex items-center gap-3">
								<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF9F6] text-[#159A9C]">
									<FiShield className="h-4 w-4" />
								</div>
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7E7A82]">Legal</p>
									<h2 className="text-lg font-semibold text-[#1F1B22]">Terms & Privacy Policy</h2>
								</div>
							</div>

							<button
								type="button"
								onClick={() => setShowTermsModal(false)}
								className="rounded-lg p-2 text-[#6A6670] transition-colors hover:bg-[#F5F5F5] hover:text-[#1E1A21]"
								aria-label="Close legal terms"
							>
								<FiX className="h-5 w-5" />
							</button>
						</div>

						<div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
							<div className="space-y-4 text-[14px] leading-7 text-[#4C4651]">
								<p>
									Melo is an AI companion designed to help you think, organize, and create. By using our product, you agree to comply with these terms and our privacy policy, which explains how we process your account details, conversation data, and platform usage.
								</p>

								{legalSections.map((section) => (
									<div key={section.title}>
										<h3 className="mb-2 text-[15px] font-semibold text-[#1D1A20]">{section.title}</h3>
										<p>{section.body}</p>
									</div>
								))}

								<div>
									<h3 className="mb-2 text-[15px] font-semibold text-[#1D1A20]">7. Acceptance</h3>
									<p>
										By continuing to use Melo, you confirm that you have read, understood, and accepted these Terms and our Privacy Policy. If you do not agree, do not use the service.
									</p>
								</div>
							</div>
						</div>

						<div className="flex justify-end border-t border-[#F1EFEF] bg-[#FBFAFC] px-5 py-4 sm:px-6">
							<button
								type="button"
								onClick={() => setShowTermsModal(false)}
								className="rounded-xl bg-[#FF5722] px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#E94C1C]"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
			<div className="flex min-h-45 items-center justify-center overflow-hidden bg-[#FFF9F2] px-6 lg:hidden">
                 <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6 }}
                     className="text-center"
                 >
                     <motion.p
                         animate={{ opacity: [0.45, 1, 0.45] }}
                         transition={{
                             duration: 2.4,
                             repeat: Infinity,
                             ease: "easeInOut",
                         }}
                         className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8E8898]"
                     >
                         Intelligence that stays with you
                     </motion.p>
             
                     <motion.div
                         key={new Date().getSeconds()}
                         initial={{ opacity: 0, y: 12 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.5 }}
                         className="text-4xl font-semibold tracking-[-0.06em]"
                     >
                         <span className="text-[#25167D]">Build.</span>{" "}
                         <span className="text-[#FF6B4A]">Think.</span>{" "}
                         <span className="text-[#159A9C]">Live.</span>
                     </motion.div>
                 </motion.div>
             </div>
             <MobileAnimatedValues />
             <AnimatedValues />

			
		</main>
	);
}
