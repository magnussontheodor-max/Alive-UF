import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/PrimaryButton';
import { TextField } from '../components/TextField';
import { Wordmark } from '../components/Wordmark';
import { useAuth } from '../state/AuthContext';
import { colors, spacing, typography } from '../theme';

type Step = 'email' | 'code';

/**
 * Gates the whole app. Two steps, one field each: an email, then the
 * 6-digit code sent to it (see AuthContext for why a typed code rather
 * than a tapped link). Nothing here is stored locally — a successful
 * verifyCode() flips AuthContext's session, and App.tsx reacts to that,
 * not to anything this screen does directly.
 */
export function SignInScreen() {
  const { sendCode, verifyCode } = useAuth();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSendCode = email.trim().length > 3 && email.includes('@');
  const canVerify = code.trim().length === 6;

  const handleSendCode = async () => {
    if (!canSendCode || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await sendCode(email.trim());
      setStep('code');
    } catch {
      setError("Couldn't send that. Check the address and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!canVerify || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await verifyCode(email.trim(), code.trim());
      // Success flips AuthContext's session; App.tsx reacts to that on its own.
    } catch {
      setError("That code didn't work. Check it and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Wordmark size="large" />
            {step === 'email' ? (
              <>
                <Text style={styles.tagline}>Enter your email and we'll send you a code to sign in.</Text>
                <View style={styles.field}>
                  <TextField
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    returnKeyType="done"
                    autoFocus
                    onSubmitEditing={canSendCode ? handleSendCode : undefined}
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.tagline}>Enter the 6-digit code we sent to {email}.</Text>
                <View style={styles.field}>
                  <TextField
                    value={code}
                    onChangeText={setCode}
                    placeholder="123456"
                    keyboardType="number-pad"
                    returnKeyType="done"
                    autoFocus
                    onSubmitEditing={canVerify ? handleVerify : undefined}
                  />
                </View>
              </>
            )}
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          <View style={styles.bottom}>
            {step === 'email' ? (
              <PrimaryButton
                label={isSubmitting ? 'Sending…' : 'Send code'}
                onPress={handleSendCode}
                disabled={!canSendCode || isSubmitting}
              />
            ) : (
              <PrimaryButton
                label={isSubmitting ? 'Checking…' : 'Continue'}
                onPress={handleVerify}
                disabled={!canVerify || isSubmitting}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  tagline: {
    ...typography.body,
    color: colors.inkMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    maxWidth: 280,
  },
  field: {
    alignSelf: 'stretch',
    marginTop: spacing.xl,
  },
  error: {
    ...typography.bodyMuted,
    color: colors.ink,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  bottom: {
    paddingBottom: spacing.lg,
  },
});
