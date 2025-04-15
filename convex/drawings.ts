import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateDrawing = mutation({
  args: {
    roomId: v.id("rooms"),
    paths: v.array(v.object({
      points: v.array(v.object({
        x: v.number(),
        y: v.number(),
      })),
      color: v.string(),
      width: v.number(),
    })),
  },
  handler: async (ctx, { roomId, paths }) => {
    const existingDrawing = await ctx.db
      .query("drawings")
      .filter(q => q.eq(q.field("roomId"), roomId))
      .first();

    if (existingDrawing) {
      await ctx.db.patch(existingDrawing._id, { paths });
    } else {
      await ctx.db.insert("drawings", { roomId, paths });
    }
  },
});

export const getDrawing = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    return await ctx.db
      .query("drawings")
      .filter(q => q.eq(q.field("roomId"), roomId))
      .first();
  },
}); 