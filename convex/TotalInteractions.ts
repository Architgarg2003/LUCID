import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const Push_totalInteractions = mutation({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            // Check if a record with the given userId already exists
            const existingInteraction = await ctx.db
                .query("TotalInteraction")
                .filter((q) => q.eq(q.field("userId"), args.userId))
                .first();

            if (existingInteraction) {
                // If the record exists, update the InteractionNumber by incrementing it
                const updatedInteraction = await ctx.db.patch(existingInteraction._id, {
                    InteractionNumber: existingInteraction.InteractionNumber + 1, // Note the 'n' suffix for BigInt literal
                });
                return updatedInteraction;
            } else {
                // If the record doesn't exist, insert a new one with InteractionNumber initialized to 0
                const newInteraction = await ctx.db.insert("TotalInteraction", {
                    userId: args.userId,
                    InteractionNumber: 1, // Note the 'n' suffix for BigInt literal
                });
                return newInteraction;
            }
        } catch (error) {
            console.error("Error in push_test_answer mutation:", error);
            throw new Error("Failed to store or update TotalInteraction");
        }
    },
});



export const Get_TotalInteraction = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const { userId } = args;

        const interaction = await ctx.db
            .query("TotalInteraction")
            .filter((q) => q.eq(q.field("userId"), userId))
            .first();

        if (!interaction) {
            return null; // Or you could return a default value like { userId, InteractionNumber: 0 }
        }

        return interaction;
    },
});