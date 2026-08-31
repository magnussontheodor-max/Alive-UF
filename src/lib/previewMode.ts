/**
 * True only in a build made specifically for backend-free UI review
 * (see scripts/build-preview.sh) — never in the real app, on a device
 * or in Expo Go, where this env var is simply never set. AuthContext,
 * ProfileContext, and CheckInContext each check this once, at the top,
 * to skip Supabase entirely and run on locally seeded state instead —
 * see each file's own preview branch for exactly what that seeds.
 */
export const isPreviewMode = process.env.EXPO_PUBLIC_PREVIEW_MODE === 'true';
