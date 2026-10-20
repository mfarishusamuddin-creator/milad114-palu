import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import { fetchProfileWithRole } from "../api/auth.api";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const profileQuery = useQuery({
    queryKey: ["profile", session?.user.id],
    queryFn: () => fetchProfileWithRole(session!.user.id),
    enabled: !!session,
    staleTime: 60_000,
  });

  const isSuperAdmin = profileQuery.data?.roles?.is_superadmin ?? false;

  return {
    session,
    profile: profileQuery.data ?? null,
    isSuperAdmin,
    isLoading: sessionLoading || (!!session && profileQuery.isLoading),
  };
}
