import { action } from "./_generated/server";
import { v } from "convex/values";
import { getEmbeddings } from "./createEmbedding";
import { internal } from "./_generated/api";
import { internalQuery } from "./_generated/server";


export const getCardById = internalQuery({
    args: { cardId: v.string() },
    handler: async (ctx, args) => {
        const test = await ctx.db
            .query("generatedCards")
            .filter((q) => q.eq(q.field("_id"), args.cardId))
            .first();
        return test;
    },
});



export const similarCards = action({
    args: {
        text: v.string(),
    },
    handler: async (ctx, args) => {
        // 1. Generate an embedding from you favorite third party API:
        const embedding = await getEmbeddings(args.text);
        console.log(embedding.values);
        // 2. Then search for similar foods!
        const results = await ctx.vectorSearch("generatedCards", "by_embedding", {
            vector: embedding.values,
            limit:20
        });

        const fullResults:any = await Promise.all(
            results.map(async (result) => {
                const card = await ctx.runQuery(internal.GeneratedCardSearch.getCardById,({ cardId: result._id }));
                return card ? { ...card } : null;
            })
        );

        // 3. Fetch the results
        return fullResults;
       
    },
});

