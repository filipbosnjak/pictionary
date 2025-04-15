import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createRoom = mutation({
  args: {
    name: v.string(),
    maxPlayers: v.number(),
    creatorName: v.string(),
    customId: v.string(),
  },
  handler: async (ctx, { name, maxPlayers, creatorName, customId }) => {
    console.log("Creating room with customId:", customId);
    
    // Check if customId already exists
    const existing = await ctx.db
      .query("rooms")
      .withIndex("by_custom_id", (q) => q.eq("customId", customId))
      .first();

    if (existing) {
      throw new Error("Room ID already exists");
    }

    const roomId = await ctx.db.insert("rooms", {
      customId,
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
    
    console.log("Room created with ID:", roomId);
    return { internalId: roomId, customId };
  },
});

export const getRoomByCustomId = query({
  args: { customId: v.string() },
  handler: async (ctx, { customId }) => {
    console.log("Searching for room with customId:", customId);
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_custom_id", (q) => q.eq("customId", customId))
      .first();
    console.log("Found room:", room ? "yes" : "no");
    return room;
  },
});

export const joinRoom = mutation({
  args: {
    customId: v.string(),
    playerName: v.string(),
  },
  handler: async (ctx, { customId, playerName }) => {
    console.log("Attempting to join room with customId:", customId);
    
    // First, list all rooms to debug
    const allRooms = await ctx.db.query("rooms").collect();
    console.log("All rooms:", allRooms.map(r => ({ id: r._id, customId: r.customId })));
    
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_custom_id", (q) => q.eq("customId", customId))
      .first();

    console.log("Found room:", room ? "yes" : "no");

    if (!room) {
      throw new Error(`Room not found with customId: ${customId}`);
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

    await ctx.db.patch(room._id, {
      players: [...room.players, newPlayer],
    });

    console.log("Successfully joined room");
    return { internalId: room._id, customId };
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

export const removePlayerFromRoom = mutation({
  args: {
    roomId: v.id("rooms"),
    playerId: v.string(),
  },
  handler: async (ctx, { roomId, playerId }) => {
    const room = await ctx.db.get(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    // Remove the player from the room
    const updatedPlayers = room.players.filter(player => player.id !== playerId);

    // If the room is empty after removing the player, delete the room
    if (updatedPlayers.length === 0) {
      await ctx.db.delete(roomId);
      return { deleted: true };
    }

    // Update the room with the remaining players
    await ctx.db.patch(roomId, {
      players: updatedPlayers,
    });

    return { deleted: false };
  },
}); 