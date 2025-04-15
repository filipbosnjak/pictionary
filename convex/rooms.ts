import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createRoom = mutation({
  args: {
    name: v.string(),
    maxPlayers: v.number(),
    creatorName: v.string(),
  },
  handler: async (ctx, { name, maxPlayers, creatorName }) => {
    const roomId = await ctx.db.insert("rooms", {
      name,
      maxPlayers,
      players: [{
        id: Math.random().toString(36).substring(7),
        name: creatorName,
        score: 0,
      }],
      status: "waiting",
      createdAt: Date.now(),
    });
    return roomId;
  },
});

export const joinRoom = mutation({
  args: {
    roomId: v.string(),
    playerName: v.string(),
  },
  handler: async (ctx, { roomId, playerName }) => {
    try {
      const room = await ctx.db.get(roomId as Id<"rooms">);
      if (!room) {
        throw new Error("Room not found");
      }
      if (room.players.length >= room.maxPlayers) {
        throw new Error("Room is full");
      }
      if (room.status !== "waiting") {
        throw new Error("Game has already started");
      }

      const newPlayer = {
        id: Math.random().toString(36).substring(7),
        name: playerName,
        score: 0,
      };

      await ctx.db.patch(roomId as Id<"rooms">, {
        players: [...room.players, newPlayer],
      });

      return room;
    } catch (error) {
      throw new Error("Invalid room ID");
    }
  },
});

export const startGame = mutation({
  args: {
    roomId: v.id("rooms"),
    currentDrawer: v.string(),
    word: v.string(),
  },
  handler: async (ctx, { roomId, currentDrawer, word }) => {
    await ctx.db.patch(roomId, {
      status: "playing",
      currentDrawer,
      currentWord: word,
    });
  },
});

export const getRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    return await ctx.db.get(roomId);
  },
}); 