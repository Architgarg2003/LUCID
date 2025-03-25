
import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const FetchResumeFiles = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const test = await ctx.db
            .query("files")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .order('desc')
            .collect();
        return test;
    },
});


export const getFileUrl = query({
    args: { fileId: v.string() },
    handler: async (ctx, args) => {
        // Retrieve the file from the database by its ID
        const file = await ctx.db
            .query("files")
            .filter((q) => q.eq(q.field("_id"), args.fileId))
            .first();

        // Generate URL if the file has a storageId
        const url = file?.storageId ? await ctx.storage.getUrl(file.storageId) : null;

        return {
            url,
            // You can include other file details here if needed
            // For example: name: file?.name, size: file?.size, etc.
        };
    },
});


import { ConvexError } from "convex/values";

export const deleteFile = mutation({
    args: { fileId: v.id("files") },
    handler: async (ctx, args) => {
        // Retrieve the file from the database by its ID
        const file = await ctx.db.get(args.fileId);

        if (!file) {
            throw new ConvexError("File not found");
        }

        // If the file has a storageId, delete it from the storage system
        if (file.storageId) {
            await ctx.storage.delete(file.storageId);
        }

        // Delete the file entry from the database
        await ctx.db.delete(args.fileId);

        return {
            success: true,
            message: "File deleted successfully",
        };
    },
});