import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, { roomId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_room", q => q.eq("roomId", roomId))
      .order("desc")
      .take(50);
  },
});

export const send = mutation({
  args: {
    roomId: v.id("rooms"),
    playerId: v.string(),
    playerName: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { roomId, playerId, playerName, content }) => {
    await ctx.db.insert("messages", {
      roomId,
      playerId,
      playerName,
      content,
      timestamp: Date.now(),
    });
  },
}); 