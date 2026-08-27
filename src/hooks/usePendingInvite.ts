import * as Linking from 'expo-linking';
import { useCallback, useEffect, useState } from 'react';

/** Pulls the invite token out of `alive://join/<token>` (or its Expo Go dev-client equivalent). */
function extractToken(url: string | null): string | null {
  if (!url) return null;
  try {
    const { path, queryParams } = Linking.parse(url);
    if (path) {
      const match = path.match(/(?:^|\/)join\/([^/]+)$/);
      if (match) return match[1];
    }
    const queryToken = queryParams?.invite;
    if (typeof queryToken === 'string') return queryToken;
  } catch {
    // Not a URL we understand — nothing to extract.
  }
  return null;
}

/**
 * Watches for the trusted-contact invite link (see ContactsStep's
 * "Send them an invite link") on both cold start and while the app is
 * already open, and holds onto the token until whoever opened it is
 * signed in and AuthGate can actually claim it (accept_invite in
 * supabase/migrations/0001_init.sql).
 */
export function usePendingInvite() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      const found = extractToken(url);
      if (found) setToken(found);
    });
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const found = extractToken(url);
      if (found) setToken(found);
    });
    return () => subscription.remove();
  }, []);

  const clear = useCallback(() => setToken(null), []);

  return { pendingInviteToken: token, clearPendingInvite: clear };
}
