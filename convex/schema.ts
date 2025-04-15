import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rooms: defineTable({
    customId: v.optional(v.string()),
    name: v.string(),
    maxPlayers: v.number(),
    currentWord: v.optional(v.string()),
    currentDrawer: v.optional(v.string()),
    players: v.array(v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
    })),
    status: v.string(), // "waiting" | "playing" | "finished"
    createdAt: v.number(),
  }).index("by_custom_id", ["customId"]),
  drawings: defineTable({
    roomId: v.id("rooms"),
    paths: v.array(v.object({
      points: v.array(v.object({
        x: v.number(),
        y: v.number(),
      })),
      color: v.string(),
      width: v.number(),
    })),
  }),
  guesses: defineTable({
    roomId: v.id("rooms"),
    playerId: v.string(),
    playerName: v.string(),
    guess: v.string(),
    timestamp: v.number(),
    isCorrect: v.boolean(),
  }),
}); 