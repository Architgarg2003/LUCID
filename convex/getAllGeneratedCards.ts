// import { query } from "./_generated/server";
// import { v } from "convex/values";

// export const getAllGeneratedCards = query({
//     args: {},
//     handler: async (ctx) => {
//         try {
//             const cards = await ctx.db.query("generatedCards").collect();
//             return cards;
//         } catch (error) {
//             console.error("Error in getAllGeneratedCards query:", error);
//             throw new Error("Failed to retrieve generated cards");
//         }
//     },
// });


import { query } from "./_generated/server";
import { v } from "convex/values";

export const getAllGeneratedCards = query({
    handler: async (ctx) => {
        try {
            const cards = await ctx.db.query("generatedCards").collect();

            if (!cards || cards.length === 0) {
                console.log("No cards found in the database");
                return [];
            }

            console.log(`Retrieved ${cards.length} cards from the database`);
            return cards;
        } catch (error:any) {
            console.error("Error in getAllGeneratedCards query:", error);
            throw new Error(`Failed to retrieve generated cards: ${error.message}`);
        }
    },
});