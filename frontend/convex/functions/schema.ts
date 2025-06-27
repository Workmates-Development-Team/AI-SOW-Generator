import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    sowno: v.int64(),
    data: v.string(),
  }),
});