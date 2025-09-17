import { useState, useEffect, useCallback, useRef } from "react";
import {
  checkForUpdatesDetailed,
  getUpdatesSince,
  UpdateInfo,
} from "@/sanity/services/gallery";

export interface UseGalleryUpdatesOptions {
  enabled?: boolean;
  pollingInterval?: number;
  onUpdateDetected?: (updateInfo: UpdateInfo) => void;
  onError?: (error: Error) => void;
}

export interface GalleryUpdateState {
  hasUpdates: boolean;
  isChecking: boolean;
  lastCheck: number;
  updateInfo: UpdateInfo | null;
  error: Error | null;
}

export function useGalleryUpdates(options: UseGalleryUpdatesOptions = {}) {
  const {
    enabled = true,
    pollingInterval = 30000, // 30 seconds
    onUpdateDetected,
    onError,
  } = options;

  const [state, setState] = useState<GalleryUpdateState>({
    hasUpdates: false,
    isChecking: false,
    lastCheck: Date.now(),
    updateInfo: null,
    error: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastKnownUpdate = useRef<number>(Date.now());

  const checkForUpdates = useCallback(async () => {
    if (!enabled || state.isChecking) return;

    setState((prev) => ({ ...prev, isChecking: true, error: null }));

    try {
      const updateInfo = await checkForUpdatesDetailed(lastKnownUpdate.current);

      setState((prev) => ({
        ...prev,
        hasUpdates: updateInfo.hasUpdates,
        isChecking: false,
        lastCheck: Date.now(),
        updateInfo,
      }));

      if (updateInfo.hasUpdates) {
        lastKnownUpdate.current = updateInfo.lastUpdate;
        onUpdateDetected?.(updateInfo);
      }
    } catch (error) {
      const err = error as Error;
      setState((prev) => ({
        ...prev,
        isChecking: false,
        error: err,
        lastCheck: Date.now(),
      }));
      onError?.(err);
    }
  }, [enabled, state.isChecking, onUpdateDetected, onError]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (enabled && pollingInterval > 0) {
      intervalRef.current = setInterval(checkForUpdates, pollingInterval);
    }
  }, [enabled, pollingInterval, checkForUpdates]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetUpdateState = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hasUpdates: false,
      updateInfo: null,
      error: null,
    }));
    lastKnownUpdate.current = Date.now();
  }, []);

  const forceCheck = useCallback(async () => {
    await checkForUpdates();
  }, [checkForUpdates]);

  // Start/stop polling based on enabled state
  useEffect(() => {
    if (enabled) {
      startPolling();
      // Initial check
      checkForUpdates();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling, checkForUpdates]);

  // Handle visibility change to pause/resume polling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else if (enabled) {
        startPolling();
        // Check for updates when tab becomes visible again
        checkForUpdates();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, startPolling, stopPolling, checkForUpdates]);

  return {
    ...state,
    checkForUpdates: forceCheck,
    resetUpdateState,
    startPolling,
    stopPolling,
  };
}
