export function getGreeting(name: string): {
  title: string;
  subtitle: string;
} {
  const hour = new Date().getHours();

  if (hour < 5) {
    return {
      title: `Up late, ${name}? 👀`,
      subtitle: "What are we working on?",
    };
  }

  if (hour < 12) {
    return {
      title: `Good morning, ${name} ☀️`,
      subtitle: "What are we getting into today?",
    };
  }

  if (hour < 18) {
    return {
      title: `Hey ${name} 👋`,
      subtitle: "What can I help you with?",
    };
  }

  return {
    title: `Evening, ${name} 🌙`,
    subtitle: "What's on your mind?",
  };
}