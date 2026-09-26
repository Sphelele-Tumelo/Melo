export function getGreeting(name?: string | null): {
    title: string;
    subtitle: string;
} {
    const hour = new Date().getHours();

    const displayName = name?.trim();

    if (hour < 5) {
        return {
            title: displayName
                ? `Up late, ${displayName}? 👀`
                : "Up late? 👀",
            subtitle: "What are we working on?",
        };
    }

    if (hour < 12) {
        return {
            title: displayName
                ? `Good morning, ${displayName} ☀️`
                : "Good morning ☀️",
            subtitle: "What are we getting into today?",
        };
    }

    if (hour < 18) {
        return {
            title: displayName
                ? `Hey ${displayName} 👋`
                : "Hey 👋",
            subtitle: "What can I help you with?",
        };
    }

    return {
        title: displayName
            ? `Evening, ${displayName} 🌙`
            : "Good evening 🌙",
        subtitle: "What's on your mind?",
    };
}