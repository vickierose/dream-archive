"use client";

import { createAuthClient } from "@neondatabase/auth/next";

// Requests go through our same-origin /api/auth route; no secrets reach the browser.
export const authClient = createAuthClient();
