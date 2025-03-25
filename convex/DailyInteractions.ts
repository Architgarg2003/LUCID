import { mutation } from "./_generated/server";
import { v } from "convex/values";

const LEVEL_THRESHOLDS = [
    { threshold: 1, level: 1 },
    { threshold: 5, level: 2 },
    { threshold: 10, level: 3 },
    { threshold: 15, level: 4 },
];

export const Push_TodayInteraction = mutation({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const { userId } = args;

            // Check if a record with the given userId and date already exists
            const currentDate = new Date().toISOString().split('T')[0];

            const existingInteraction = await ctx.db
                .query('DailyInteraction')
                .filter((q) =>
                    q.and(q.eq(q.field("userId"), userId), q.eq(q.field("date"), currentDate))
                )
                .first();

            let updatedInteraction;

            if (existingInteraction) {
                // If the record exists, increment the count by 1
                const newCount = existingInteraction.count + 1;

                // Update the level based on the new count
                const newLevel = determineLevel(newCount);
                updatedInteraction = await ctx.db.patch(existingInteraction._id, {
                    count: newCount,
                    level: newLevel,
                });
            } else {
                // If no record exists, create a new one
                const newInteraction = await ctx.db.insert("DailyInteraction", {
                    userId: userId,
                    date: currentDate,
                    count: 1,
                    level: determineInitialLevel(userId),
                });
                updatedInteraction = newInteraction;
            }

            return updatedInteraction;
        } catch (error) {
            console.error("Error in Push_totalInteractions mutation:", error);
            throw new Error("Failed to store or update DailyInteraction");
        }
    },
});

function determineLevel(count:any) {
    const levels = LEVEL_THRESHOLDS.sort((a, b) => a.threshold - b.threshold);
    for (let i = 0; i < levels.length; i++) {
        if (count >= levels[i].threshold) {
            return levels[i].level;
        }
    }
    return levels[levels.length - 1].level; // Default to highest level if count exceeds all thresholds
}

function determineInitialLevel(userId:any) {
    // This could be based on some initial logic or random assignment
    // For simplicity, we'll just use a simple hash function
    const hash = userId.split('').reduce((x:any, y:any) => ((x << 5) - x) + y.charCodeAt(0), 0);
    return Math.abs(hash % 5); // Randomly assign a level between 1 and 5
}



import { query } from "./_generated/server";

export const Get_AllUserInteractions = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const { userId } = args;

        const interactions = await ctx.db
            .query("DailyInteraction")
            .filter((q) => q.eq(q.field("userId"), userId))
            .collect();

        return interactions;
    },
});