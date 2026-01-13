"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error);
        router.push("/login");
        return;
      }

      if (data?.session) {
        router.push("/feed");
      } else {
        router.push("/login");
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
      Confirming your GlowSpace account… ✨
    </div>
  );
}