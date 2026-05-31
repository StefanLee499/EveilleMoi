"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-client";

export default function AuthHydrator() {
  const refresh = useAuth((s) => s.refresh);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return null;
}
