import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"])
  .index("by_email", ["email"]),
  sows: defineTable({
    userId: v.id("users"),
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
  }),
});
