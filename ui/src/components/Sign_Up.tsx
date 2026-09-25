import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiEye, FiEyeOff, FiShield, FiX } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTypewriter } from "../utils/useTypewriter";
import MainLogoCard from "../assets/MainLogoCard.svg";
import { useAuthStore } from "../store/authStore";

const termsSections = [
	{
		title: "1. Acceptance of Terms",
		body:
			"By creating an account with Melo, you agree to these Terms and Conditions and the Melo Privacy Policy. These terms govern your access to and use of our AI chat services, mobile and web experiences, account features, and all related software and content provided by Melo.",
	},
	{
		title: "2. Your Account and Eligibility",
		body:
			"You must be at least 18 years old or have parental or guardian consent to use the Service. You are responsible for the accuracy of your account information and for keeping your login credentials secure. You may not share your account with others or use the Service for unlawful, fraudulent, abusive, or harmful purposes.",
	},
	{
		title: "3. AI Services and Output",
		body:
			"Melo provides AI-generated assistance, summaries, recommendations, and conversational responses. While we aim to be helpful and accurate, AI-generated content may be incomplete, outdated, or incorrect. You are responsible for reviewing any output before relying on it for medical, legal, financial, safety-critical, or other consequential decisions.",
	},
	{
		title: "4. User Content and Data",
		body:
			"You retain ownership of the content you submit to Melo, but you grant Melo a limited license to process, store, analyze, and improve the Service in order to operate, secure, and improve the model experience. This includes using aggregated, de-identified data to improve reliability, safety, and product quality, subject to our Privacy Policy.",
	},
	{
		title: "5. Prohibited Use",
		body:
			"You may not use Melo to generate or distribute harmful content, spam, fraud, illegal material, personal data misuse, harassment, or activity that interferes with the stability, security, or integrity of the Service. We may suspend or terminate accounts that violate these rules.",
	},
	{
		title: "6. Privacy and Data Protection",
		body:
			"Melo processes your personal information to create and secure your account, provide the Service, prevent abuse, and improve product performance. We collect the data necessary for authentication, account support, usage analytics, and model operation. We do not sell personal data. We may share information with service providers that help us operate the platform under strict confidentiality obligations.",
	},
	{
		title: "7. Data Retention and Security",
		body:
			"We retain account and conversation data for as long as necessary to provide the Service, comply with legal obligations, resolve disputes, and enforce our policies. We use reasonable administrative, technical, and organizational safeguards, but no system can guarantee absolute security. You should not submit highly sensitive personal, financial, or confidential information unless you are comfortable with the inherent risks of digital processing.",
	},
	{
		title: "8. Intellectual Property",
		body:
			"The Melo platform, design, branding, software, prompts, templates, and proprietary content are owned by Melo or its licensors. You may not copy, reverse engineer, resell, or exploit the Service beyond the rights granted in these Terms.",
	},
	{
		title: "9. Service Availability and Changes",
		body:
			"We may update, maintain, or discontinue aspects of the Service at any time. We may also change these Terms and the Privacy Policy to reflect product improvements, new features, or legal requirements. Continued use after notice constitutes your acceptance of the updated terms.",
	},
	{
		title: "10. Limitation of Liability",
		body:
			"To the maximum extent permitted by law, Melo is not liable for indirect, incidental, consequential, or punitive damages, including loss of business, data, or goodwill, arising from the use of the Service. Melo's total liability for any claim shall not exceed the fees paid for the Service, if applicable, or the amount reasonably attributable to the relevant claim.",
	},
	{
		title: "11. Termination",
		body:
			"Melo may suspend or terminate your access if you violate these Terms or if the Service is no longer commercially viable. Upon termination, your right to use the Service ends, but certain provisions relating to liability, dispute resolution, and data retention may survive.",
	},
	{
		title: "12. Governing Law and Disputes",
		body:
			"These Terms are governed by the laws of the jurisdiction where Melo is established, without regard to conflict of law principles. Any dispute arising from these Terms will be resolved through good-faith negotiation and, if necessary, through the competent courts of that jurisdiction.",
	},
];

const fieldVariants = {
	hidden: { opacity: 0, y: 12 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: 0.08 * i, duration: 0.4, ease: "easeOut" as const },
	}),
};


export default function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showTermsModal, setShowTermsModal] = useState(false);
	const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
	const { register, isLoading, error } = useAuthStore();
	const navigate = useNavigate();
	const typedMessage = useTypewriter("Your mind deserves company.");
	const words = typedMessage.split(" ");

	const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!email || !password || isLoading) {
            return;
        }

        if (!hasAcceptedTerms) {
            setShowTermsModal(true);
            return;
        }

        try {
            await register({
                email,
                password,
                display_name: email.split("@")[0],
            });

            navigate("/signin");
        } catch {
            // AuthStore already stores the error.
        }
    };

    	const acceptTermsAndContinue = async () => {
        setHasAcceptedTerms(true);
        setShowTermsModal(false);

        try {
            await register({
                email,
                password,
                display_name: email.split("@")[0],
            });

            navigate("/signin");
        } catch {
            // AuthStore already stores the error.
        }
    };

	return (
		<main className="flex min-h-screen bg-white text-[#12111A]">
			<section className="flex w-full flex-col px-6 py-8 sm:px-12 lg:w-[46%] lg:max-w-155 lg:px-20">
				<motion.button
					initial={{ opacity: 0, x: -8 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3 }}
					type="button"
					onClick={() => navigate("/signin")}
					className="flex w-fit items-center gap-2 text-[13px] font-medium text-[#77727A] hover:text-[#202020]"
				>
					<FiArrowLeft />
					Back to sign in
				</motion.button>

				<div className="mx-auto flex w-full max-w-95 flex-1 flex-col justify-center py-12">
					<motion.div
						custom={0}
						initial="hidden"
						animate="visible"
						variants={fieldVariants}
						className="mb-9"
					>
						<div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl">
							<img src={MainLogoCard} alt="melo" />
						</div>

						<h1 className="text-[32px] font-medium tracking-[-0.04em]">
							Make room for more
							<span className="text-[#159A9C]">.</span>
						</h1>

						<p className="mt-2 text-[14px] leading-6 text-[#8A8F98]">
							One account for your ideas, questions, and everyday companion.
						</p>
					</motion.div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<motion.label
							custom={1}
							initial="hidden"
							animate="visible"
							variants={fieldVariants}
							className="block text-[12px] font-medium text-[#59545E]"
						>
							Email
							<input
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								type="email"
								autoComplete="email"
								placeholder="you@example.com"
								required
								className="mt-2 block w-full rounded-xl border border-[#DFDDE2] px-4 py-3 text-[14px] outline-none placeholder:text-[#B1AEB5] transition-colors duration-200 focus:border-[#159A9C]"
							/>
						</motion.label>

						<motion.label
							custom={2}
							initial="hidden"
							animate="visible"
							variants={fieldVariants}
							className="block text-[12px] font-medium text-[#59545E]"
						>
							Password
							<span className="relative mt-2 block">
								<input
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									type={showPassword ? "text" : "password"}
									autoComplete="new-password"
									placeholder="At least 8 characters"
									minLength={8}
									required
									className="block w-full rounded-xl border border-[#DFDDE2] px-4 py-3 pr-11 text-[14px] outline-none placeholder:text-[#B1AEB5] transition-colors duration-200 focus:border-[#159A9C]"
								/>
								<button
									type="button"
									aria-label={showPassword ? "Hide password" : "Show password"}
									onClick={() => setShowPassword((visible) => !visible)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-[#96919A] transition-colors hover:text-[#59545E]"
								>
									{showPassword ? <FiEyeOff /> : <FiEye />}
								</button>
							</span>
						</motion.label>

						<AnimatePresence>
							{error && (
								<motion.p
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.2 }}
									className="overflow-hidden rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600"
								>
									{error}
								</motion.p>
							)}
						</AnimatePresence>

						<motion.button
							custom={3}
							initial="hidden"
							animate="visible"
							variants={fieldVariants}
							whileHover={{ y: -2 }}
							whileTap={{ scale: 0.98 }}
							type="submit"
							disabled={isLoading}
							className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#159A9C] px-4 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#117C7E] disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isLoading ? (
								<>
									<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
									Creating account...
								</>
							) : (
								<>
									Create account
									<FiArrowRight />
								</>
							)}
						</motion.button>
					</form>

					<motion.div
						custom={4}
						initial="hidden"
						animate="visible"
						variants={fieldVariants}
						className="mt-6"
					>
						<div className="mb-4 flex items-center gap-3 text-xs text-[#AAA5AD]">
							<span className="h-px flex-1 bg-[#ECE9ED]" />
							or
							<span className="h-px flex-1 bg-[#ECE9ED]" />
						</div>

						<div className="space-y-3">
							<motion.button
								whileHover={{ y: -1 }}
								whileTap={{ scale: 0.98 }}
								type="button"
								className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#DFDDE2] bg-white px-4 py-3 text-[14px] font-medium text-[#48434C] transition-colors hover:bg-[#FAF9FB]"
							>
								<FcGoogle className="h-5 w-5 shrink-0" />
								<span>Continue with Google</span>
							</motion.button>

							<motion.button
								whileHover={{ y: -1 }}
								whileTap={{ scale: 0.98 }}
								type="button"
								className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#DFDDE2] bg-white px-4 py-3 text-[14px] font-medium text-[#48434C] transition-colors hover:bg-[#FAF9FB]"
							>
								<FaMicrosoft className="h-5 w-5 shrink-0 text-[#2F6FED]" />
								<span>Continue with Microsoft</span>
							</motion.button>
						</div>
					</motion.div>

					<motion.p
						custom={5}
						initial="hidden"
						animate="visible"
						variants={fieldVariants}
						className="mt-7 text-center text-[13px] text-[#8A8F98]"
					>
						Already have an account?
						<button
							type="button"
							onClick={() => navigate("/signin")}
							className="font-medium text-[#159A9C] hover:underline"
						>
							Sign in
						</button>
					</motion.p>
				</div>

				<AnimatePresence>
					{showTermsModal && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="fixed inset-0 z-50 flex items-center justify-center bg-[#12111A]/40 p-4 backdrop-blur-[2px]"
						>
							<motion.div
								initial={{ opacity: 0, y: 24, scale: 0.97 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 16, scale: 0.98 }}
								transition={{ duration: 0.25, ease: "easeOut" }}
								className="flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-[#ECE9ED] bg-white shadow-[0_28px_80px_rgba(18,17,26,0.18)]"
							>
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
										aria-label="Close terms and privacy policy"
									>
										<FiX className="h-5 w-5" />
									</button>
								</div>

								<div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
									<div className="space-y-4 text-[14px] leading-7 text-[#4C4651]">
										<p>
											Welcome to Melo. These Terms and Conditions and our Privacy Policy explain how we provide our AI-powered assistant, how we handle your information, and what rights and responsibilities apply when you use our platform.
										</p>

										{termsSections.map((section) => (
											<div key={section.title}>
												<h3 className="mb-2 text-[15px] font-semibold text-[#1D1A20]">{section.title}</h3>
												<p>{section.body}</p>
											</div>
										))}

										<div>
											<h3 className="mb-2 text-[15px] font-semibold text-[#1D1A20]">13. Acceptance</h3>
											<p>
												By clicking "Accept and continue," you confirm that you have read, understood, and agree to these Terms and the Melo Privacy Policy. If you do not agree, you may not use Melo.
											</p>
										</div>
									</div>
								</div>

								<div className="flex items-center justify-between gap-3 border-t border-[#F1EFEF] bg-[#FBFAFC] px-5 py-4 sm:px-6">
									<button
										type="button"
										onClick={() => setShowTermsModal(false)}
										className="rounded-xl border border-[#DFDDE2] px-4 py-2.5 text-[14px] font-medium text-[#4C4651] transition-colors hover:bg-white"
									>
										Decline
									</button>
									<motion.button
										whileHover={{ y: -1 }}
										whileTap={{ scale: 0.97 }}
										type="button"
										onClick={acceptTermsAndContinue}
										className="rounded-xl bg-[#159A9C] px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#117C7E]"
									>
										Accept and continue
									</motion.button>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<p className="text-center text-[11px] text-[#B0ABB2]">
					Your account stays yours. We keep your conversations private.
				</p>
			</section>

			<section className="hidden flex-1 items-center justify-center bg-[#FFF8EC] p-10 lg:flex">
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="max-w-130"
				>
					<p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#B08400]">
						A little space to begin
					</p>

					<p className="min-h-[3.2em] text-[clamp(3.5rem,7vw,6rem)] font-semibold leading-[0.88] tracking-[-0.07em] text-[#25167D]">
						{words.map((word, index) => (
							<span
								key={`${word}-${index}`}
								className={index === 1 ? "text-[#FF6B4A]" : index === 2 ? "text-[#159A9C]" : ""}
							>
								{word}
								{index < words.length - 1 ? " " : ""}
							</span>
						))}
						<motion.span
							animate={{ opacity: [1, 0] }}
							transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
							className="ml-1 inline-block h-[0.8em] w-1 bg-[#FF6B4A] align-[-0.08em]"
							aria-hidden="true"
						/>
					</p>
				</motion.div>
			</section>
		</main>
	);
}