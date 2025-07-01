
import { ConvexReactClient } from "convex/react";

// Get the token identifier from localStorage on initialization
const storedTokenIdentifier = localStorage.getItem('convex_token_identifier');

export const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL as string,
  {
    auth: {
      storage: localStorage,
      // Explicitly set the token identifier if available
      token: storedTokenIdentifier || undefined,
    }
  }
);
