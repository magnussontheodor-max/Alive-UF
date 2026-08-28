import type { ProgressData } from '../types/progress';
import { createEmptyProgress } from '../types/progress';

const STORAGE_KEY = 'hp-pluggmotor:progress:v1';
const MAX_ATTEMPTS = 5000; // tak för att inte låta localStorage växa obegränsat

function isStorageAvailable(): boolean {
  try {
    const testKey = '__hp_pluggmotor_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const storageAvailable = typeof window !== 'undefined' && isStorageAvailable();
let memoryFallback: ProgressData | null = null;

export function loadProgress(): ProgressData {
  if (!storageAvailable) {
    return memoryFallback ?? (memoryFallback = createEmptyProgress());
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyProgress();
    const parsed = JSON.parse(raw) as ProgressData;
    if (!parsed || parsed.version !== 1) return createEmptyProgress();
    return {
      version: 1,
      cards: parsed.cards ?? {},
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
    };
  } catch {
    return createEmptyProgress();
  }
}

export function saveProgress(data: ProgressData): void {
  const trimmed: ProgressData = {
    ...data,
    attempts:
      data.attempts.length > MAX_ATTEMPTS
        ? data.attempts.slice(data.attempts.length - MAX_ATTEMPTS)
        : data.attempts,
  };
  if (!storageAvailable) {
    memoryFallback = trimmed;
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Om lagringen är full eller blockerad: fortsätt tyst i minnet för
    // den här sessionen istället för att krascha appen.
    memoryFallback = trimmed;
  }
}

export function resetProgress(): void {
  memoryFallback = createEmptyProgress();
  if (storageAvailable) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignorera
    }
  }
}
