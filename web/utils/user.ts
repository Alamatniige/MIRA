export const getInitials = (fullName: string): string => {
    if (!fullName) return "??";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const AVATAR_GRADIENTS = [
    "from-slate-500 to-slate-600",
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-violet-500 to-purple-600",
    "from-amber-500 to-orange-500",
    "from-pink-500 to-rose-500",
    "from-sky-500 to-blue-600",
];

export const getAvatarGradient = (userId: string): string => {
    if (!userId) return AVATAR_GRADIENTS[0];
    // Simple hash based on string length and character codes
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
    return AVATAR_GRADIENTS[index];
};
