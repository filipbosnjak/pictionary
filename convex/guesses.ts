import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

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
      await ctx.db.patch(roomId, { players: updatedPlayers });

      // Wait for 2 seconds to show celebration
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Start next round
      await ctx.scheduler.runAfter(0, internal.rooms.nextRound, { roomId });
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