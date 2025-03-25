import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const AddToWishlist = mutation({
    args: {
        userId: v.string(),
        cardId:v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const newTestAnswerId = await ctx.db.insert("wishList", {
                userId: args.userId,
                cardId: args.cardId
            });

            return newTestAnswerId;
        } catch (error) {
            console.error("Error in Adding to Wishlist mutation:", error);
            throw new Error("Failed to store in wishlist");
        }
    }
});




// export const RemoveFromWishlist = mutation({
//     args: {
//         userId: v.string(),
//         cardId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         try {

//             const existingInBucket = await ctx.db.query("wishList")
//                 .filter((q) => q.eq(q.field("userId"), args.userId))
//                 .filter((q) => q.eq(q.field("cardId"), args.cardId))
//                 .first();

//             const DeleteFromBucket = await ctx.db.delete(existingInBucket?._id);

//             return DeleteFromBucket;
//         } catch (error) {
//             console.error("Error in Adding to Wishlist mutation:", error);
//             throw new Error("Failed to store in wishlist");
//         }
//     }
// });




export const RemoveFromWishlist = mutation({
    args: {
        userId: v.string(),
        cardId: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            // Query for all matching documents
            const matchingEntries = await ctx.db.query("wishList")
                .filter((q) => q.eq(q.field("userId"), args.userId))
                .filter((q) => q.eq(q.field("cardId"), args.cardId))
                .collect();

            // If there are matching entries, delete them all
            if (matchingEntries.length > 0) {
                const deletePromises = matchingEntries.map(entry =>
                    ctx.db.delete(entry._id)
                );
                await Promise.all(deletePromises);

                return {
                    message: `Removed ${matchingEntries.length} entry/entries from wishlist`,
                    removedCount: matchingEntries.length
                };
            }

            // If no matching entries found
            return {
                message: "No matching entries found in wishlist",
                removedCount: 0
            };
        } catch (error) {
            console.error("Error in RemoveFromWishlist mutation:", error);
            throw new Error("Failed to remove from wishlist");
        }
    }
});




export const inBucket = query({
    args: {
        userId: v.string(),
        cardId: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            // Query for all matching documents
            const inWishlist = await ctx.db.query("wishList")
                .filter((q) => q.eq(q.field("userId"), args.userId))
                .filter((q) => q.eq(q.field("cardId"), args.cardId))
                .first();

            // Return true if a matching entry is found, false otherwise
            return inWishlist !== null;

        } catch (error) {
            console.error("Error in inBucket query:", error);
            throw new Error("Failed to check if card is in wishlist");
        }
    }
});






export const getUserBucket = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const { userId } = args;

            // Query the database for the entry with the given cardId
            const entry = await ctx.db.query("wishList")
                .filter((q) => q.eq(q.field("userId"), userId))
                .collect();

                return entry;
        } catch (error) {
            console.error("Error in getLikeCount query:", error);
            throw new Error("Failed to retrieve like count");
        }
    }
});
