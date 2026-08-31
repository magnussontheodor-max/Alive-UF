#!/usr/bin/env bash
# Builds the no-login preview: same screens, same components, real
# code — but AuthContext/ProfileContext/CheckInContext are seeded with
# local demo data instead of talking to Supabase (see
# src/lib/previewMode.ts). Produces one self-contained file,
# dist-preview/alive-preview.html, meant to be handed straight to the
# Artifact publisher — no separate asset files, no server needed.
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf .expo web-preview dist-preview
EXPO_PUBLIC_PREVIEW_MODE=true npx expo export --platform web --output-dir web-preview --clear
node scripts/inline-preview.js
