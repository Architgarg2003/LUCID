import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const handleDailyInteraction = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const { userId } = args;

        // Check if the user exists
        const existingUser = await ctx.db
            .query("DailyInteraction")
            .filter((q) => q.eq(q.field("userId"), userId))
            .first();

        if (!existingUser) {
            // User doesn't exist, create entries for 5 months ago and today
            const today = new Date();
            const fiveMonthsAgo = new Date(today);
            fiveMonthsAgo.setMonth(today.getMonth() - 5);

            // Create entry for 5 months ago
            await ctx.db.insert("DailyInteraction", {
                userId,
                date: fiveMonthsAgo.toISOString().split('T')[0],
                count: 0,
                level: 0
            });

            // Create entry for today
            await ctx.db.insert("DailyInteraction", {
                userId,
                date: today.toISOString().split('T')[0],
                count: 0,
                level: 0
            });

            return "New user entries created";
        }

        return "User already exists";
    },
});








export const onLoginInteraction = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const { userId } = args;
        const today = new Date();


        // Check if the user exists
        const existingUser = await ctx.db
            .query("DailyInteraction")
            .filter((q) => q.and(q.eq(q.field("userId"), userId), q.eq(q.field("date"), today.toISOString().split('T')[0])))
            .first();

        if (!existingUser) {
            // User doesn't exist, create entries for 5 months ago and today
            const today = new Date();
            // Create entry for today
            await ctx.db.insert("DailyInteraction", {
                userId,
                date: today.toISOString().split('T')[0],
                count: 0,
                level: 0
            });

            return "Todays userEntry created";
        }

        return "Todays UserEntry already exists";
    },
});