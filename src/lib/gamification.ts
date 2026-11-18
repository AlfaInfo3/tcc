// Helper to calculate Level from XP
// Level 1: 0-100
// Level 2: 101-300
// Level 3: 301-600
// Formula: Level = Math.floor(Math.sqrt(XP / 100)) + 1 ? Simplified.

export function calculateLevel(xp: number): number {
    return Math.floor(xp / 100) + 1;
}

export function getNextLevelXp(level: number): number {
    return level * 100;
}

export function getLevelProgress(xp: number): number {
    const level = calculateLevel(xp);
    const currentLevelBase = (level - 1) * 100;
    const currentXpInLevel = xp - currentLevelBase;
    
    // Percentage
    return Math.min(100, Math.floor((currentXpInLevel / 100) * 100));
}
