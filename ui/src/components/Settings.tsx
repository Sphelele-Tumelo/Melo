import { useState } from "react";
import {
	FiArrowLeft,
	FiBell,
	FiChevronDown,
	FiHelpCircle,
	FiLock,
	FiMoon,
	FiSliders,
	FiUser,
} from "react-icons/fi";

type SettingsProps = {
	onBack: () => void;
};

function SettingRow({
	icon: Icon,
	title,
	description,
	children,
}: {
	icon: typeof FiUser;
	title: string;
	description: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center gap-4 border-b border-[#EEEEEE] py-5 last:border-b-0">
			<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F7F7F7] text-[#6F6F6F]">
				<Icon className="h-4.25 w-4.25" />
			</div>
			<div className="min-w-0 flex-1">
				<h2 className="text-[14px] font-medium text-[#202020]">{title}</h2>
				<p className="mt-1 text-[12px] leading-5 text-[#8A8F98]">{description}</p>
			</div>
			{children}
		</div>
	);
}

export default function Settings({ onBack }: SettingsProps) {
	const [darkMode, setDarkMode] = useState(false);
	const [notifications, setNotifications] = useState(true);
	const [personalizedReplies, setPersonalizedReplies] = useState(true);
	const [model, setModel] = useState("Melo");

	return (
		<main className="min-w-0 flex-1 overflow-y-auto bg-[#FCFCFC]">
			<div className="mx-auto w-full max-w-180 px-4 py-6 pl-16 sm:px-10 sm:py-8 sm:pl-10">
				<button
					type="button"
					onClick={onBack}
					className="mb-8 flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] font-medium text-[#6F6F6F] transition-colors hover:bg-[#F1F1F1] hover:text-[#202020]"
				>
					<FiArrowLeft className="h-4 w-4" />
					Back to chat
				</button>

				<header className="mb-8">
					<h1 className="text-[28px] font-medium tracking-[-0.03em] text-[#12111A]">Settings</h1>
					<p className="mt-2 text-[14px] text-[#8A8F98]">Make Melo feel right for you.</p>
				</header>

				<section className="overflow-hidden rounded-2xl border border-[#E9E9E9] bg-white px-5 shadow-[0_4px_20px_rgba(18,17,26,0.03)]">
					<div className="flex items-center gap-4 border-b border-[#EEEEEE] py-5">
						<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-[15px] font-medium text-[#6D28D9]">T</div>
						<div className="min-w-0 flex-1">
							<p className="text-[15px] font-medium text-[#202020]">Tumelo Zonke</p>
							<p className="mt-1 text-[12px] text-[#8A8F98]">Personal account</p>
						</div>
						<button type="button" className="rounded-lg border border-[#E4E4E4] px-3 py-2 text-[12px] font-medium text-[#5F6368] transition-colors hover:bg-[#F7F7F7]">Edit profile</button>
					</div>

					<SettingRow icon={FiSliders} title="Model" description="Choose the personality you want to chat with.">
						<label className="relative">
							<span className="sr-only">Select model</span>
							<select value={model} onChange={(event) => setModel(event.target.value)} className="appearance-none rounded-lg border border-[#E4E4E4] bg-white py-2 pl-3 pr-8 text-[12px] font-medium text-[#3F3F3F] outline-none focus:border-[#FF5722]">
								<option>Melo</option>
								<option>Madelyn</option>
							</select>
							<FiChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A8F98]" />
						</label>
					</SettingRow>

					<SettingRow icon={FiMoon} title="Appearance" description="Use a darker look when you need it.">
						<button type="button" role="switch" aria-checked={darkMode} aria-label="Toggle dark mode" onClick={() => setDarkMode((active) => !active)} className={`relative h-6 w-11 rounded-full transition-colors ${darkMode ? "bg-[#FF5722]" : "bg-[#D9D9D9]"}`}>
							<span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${darkMode ? "translate-x-6" : "translate-x-1"}`} />
						</button>
					</SettingRow>

					<SettingRow icon={FiBell} title="Notifications" description="Get notified when Melo has something ready.">
						<button type="button" role="switch" aria-checked={notifications} aria-label="Toggle notifications" onClick={() => setNotifications((active) => !active)} className={`relative h-6 w-11 rounded-full transition-colors ${notifications ? "bg-[#FF5722]" : "bg-[#D9D9D9]"}`}>
							<span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${notifications ? "translate-x-6" : "translate-x-1"}`} />
						</button>
					</SettingRow>

					<SettingRow icon={FiUser} title="Personalized replies" description="Let Melo remember your preferences in this app.">
						<button type="button" role="switch" aria-checked={personalizedReplies} aria-label="Toggle personalized replies" onClick={() => setPersonalizedReplies((active) => !active)} className={`relative h-6 w-11 rounded-full transition-colors ${personalizedReplies ? "bg-[#FF5722]" : "bg-[#D9D9D9]"}`}>
							<span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${personalizedReplies ? "translate-x-6" : "translate-x-1"}`} />
						</button>
					</SettingRow>

					<SettingRow icon={FiLock} title="Privacy and data" description="Manage your conversations and data preferences.">
						<button type="button" className="text-[12px] font-medium text-[#FF5722] hover:text-[#D94718]">Manage</button>
					</SettingRow>
				</section>

				<button type="button" className="mt-5 flex items-center gap-2 px-2 text-[13px] font-medium text-[#8A8F98] hover:text-[#FF5722]"><FiHelpCircle className="h-4 w-4" />Help center</button>
			</div>
		</main>
	);
}
