import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

const WORDS = [
  "cat", "dog", "house", "tree", "car", "book", "phone", "computer",
  "pizza", "beach", "sun", "moon", "star", "flower", "bird", "fish",
  "airplane", "boat", "train", "bicycle", "chair", "table", "clock",
  "pencil", "shoe", "hat", "glasses", "umbrella", "butterfly", "rainbow"
];

const TRANSITION_DURATION = 5000; // 5 seconds countdown

export const submitGuess = mutation({
  args: {
    roomId: v.id("rooms"),
    playerId: v.string(),
    playerName: v.string(),
    guess: v.string(),
  },
  handler: async (ctx, { roomId, playerId, playerName, guess }) => {
    const room = await ctx.db.get(roomId);
    if (!room) throw new Error("Room not found");
    
    const isCorrect = room.currentWord?.toLowerCase() === guess.toLowerCase();
    
    // Record the guess
    await ctx.db.insert("guesses", {
      roomId,
      playerId,
      playerName,
      guess,
      isCorrect,
      timestamp: Date.now(),
    });

    if (isCorrect) {
      // Update player score
      const updatedPlayers = room.players.map(player => 
        player.id === playerId 
          ? { ...player, score: player.score + 100 }
          : player
      );

      // Get current drawer index and select next drawer
      const currentDrawerIndex = room.players.findIndex(p => p.id === room.currentDrawer);
      const nextDrawerIndex = (currentDrawerIndex + 1) % room.players.length;
      const nextDrawer = room.players[nextDrawerIndex].id;

      // Select random word
      const nextWord = WORDS[Math.floor(Math.random() * WORDS.length)];

      // Update room with new scores and transition data
      await ctx.db.patch(roomId, { 
        players: updatedPlayers,
        status: "transitioning",
        nextDrawer,
        nextWord,
        transitionStartTime: Date.now()
      });

      // Schedule the next round after the transition duration
      await ctx.scheduler.runAfter(TRANSITION_DURATION, internal.rooms.nextRound, { roomId });
    }

    return isCorrect;
  },
});

export const getGuesses = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    return await ctx.db
      .query("guesses")
      .filter((q) => q.eq(q.field("roomId"), roomId))
      .order("desc")
      .take(50);
  },
}); 