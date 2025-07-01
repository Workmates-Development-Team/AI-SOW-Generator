import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createSow = mutation({
  args: {
    title: v.string(),
    sowNumber: v.string(),
    clientName: v.string(),
    slides: v.array(
      v.object({
        id: v.string(),
        type: v.string(),
        template: v.string(),
        title: v.string(),
        content: v.string(),
        contentType: v.string(),
      })
    ),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new Error("Not authenticated or user not found");
    }

    const sowId = await ctx.db.insert("sows", {
      userId: user._id,
      title: args.title,
      sowNumber: args.sowNumber,
      clientName: args.clientName,
      slides: args.slides,
    });

    return sowId;
  },
});

export const getSows = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity?.tokenIdentifier || "")
      )
      .unique();

    if (!user) {
      return [];
    }

    return ctx.db
      .query("sows")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();
  },
});
