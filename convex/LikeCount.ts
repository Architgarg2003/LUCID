import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const increaseLikeCount = mutation({
    args: {
        cardId: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const { cardId } = args;

            // Check if an entry with the given cardId already exists
            const existingEntry = await ctx.db.query("upVoteCount")
                .filter((q) => q.eq(q.field("cardId"), cardId))
                .first();

            if (existingEntry) {
                // If the entry exists, update the count
                await ctx.db.patch(existingEntry._id, {
                    count: existingEntry.count + 1,
                });
                return existingEntry._id; // or return the updated entry if needed
            } else {
                // If the entry does not exist, create a new one with count = 1
                const newEntryId = await ctx.db.insert("upVoteCount", {
                    cardId,
                    count: 1,
                });
                return newEntryId; // return the ID of the new entry
            }
        } catch (error) {
            console.error("Error in increaseLikeCount mutation:", error);
            throw new Error("Failed to increase like count");
        }
    }
});




export const decreaseLikeCount = mutation({
    args: {
        cardId: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const { cardId } = args;

            // Check if an entry with the given cardId already exists
            const existingEntry = await ctx.db.query("upVoteCount")
                .filter((q) => q.eq(q.field("cardId"), cardId))
                .first();

            if (existingEntry) {
                // If the entry exists, update the count
                const newCount = existingEntry.count - 1;

                if (newCount <= 0) {
                    // If the count is 0 or less, you may want to delete the entry
                    await ctx.db.delete(existingEntry._id);
                    return { message: "Entry removed as count is zero or less" }; // Optionally return a message
                } else {
                    // Update the count if it is greater than 0
                    await ctx.db.patch(existingEntry._id, {
                        count: newCount,
                    });
                    return existingEntry._id; // or return the updated entry if needed
                }
            } else {
                // If no entry is found, you can return a message or handle as needed
                return { message: "No entry found to decrease count" };
            }
        } catch (error) {
            console.error("Error in decreaseLikeCount mutation:", error);
            throw new Error("Failed to decrease like count");
        }
    }
});



export const getLikeCount = query({
    args: {
        cardId: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const { cardId } = args;

            // Query the database for the entry with the given cardId
            const entry = await ctx.db.query("upVoteCount")
                .filter((q) => q.eq(q.field("cardId"), cardId))
                .first();

            if (entry) {
                // If the entry exists, return the count
                return entry.count;
            } else {
                // If no entry is found, return 0 or a default value
                return 0;
            }
        } catch (error) {
            console.error("Error in getLikeCount query:", error);
            throw new Error("Failed to retrieve like count");
        }
    }
});
