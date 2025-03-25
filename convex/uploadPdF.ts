import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const saveFile = mutation({
    args: {
        storageId: v.id("_storage"),
        fileName: v.string(),
        fileType: v.string(),
        userId:v.string(),
    },
    handler: async (ctx, args) => {
        const { storageId, fileName, fileType, userId } = args;
        await ctx.db.insert("files", { storageId,fileName, fileType, userId });
    },
});

//file.ts