import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { supabase } from '../lib/supabase';
import { useAuth } from '../state/AuthContext';

// Placed at module scope, not inside the hook's effect: a push that
// arrives during cold start can be missed if this hasn't run yet by
// the time it does.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Registers this device for push the moment someone's signed in, so
 * the escalation Edge Function (supabase/functions/check-escalations)
 * has somewhere to actually send a notification once a trusted
 * contact needs to be told. Fails quietly when there's no EAS project
 * id yet — that's the expected state before `eas init` has been run,
 * not an error worth surfacing.
 */
export function useRegisterPushToken() {
  const { session } = useAuth();
  const userId = session?.user.id;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      const existing = await Notifications.getPermissionsAsync();
      let status = existing.status;
      if (status !== 'granted') {
        const requested = await Notifications.requestPermissionsAsync();
        status = requested.status;
      }
      if (status !== 'granted') return;

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) return;

      const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
      if (cancelled || !token) return;

      const { error } = await supabase
        .from('push_tokens')
        .upsert({ user_id: userId, token, platform: Platform.OS }, { onConflict: 'token' });
      if (error) console.warn('Failed to register push token', error);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);
}
