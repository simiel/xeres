import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({
  id: 'inactivity-storage',
});

export const UserInactivityProvider = ({ children }: any) => {
  const appState = useRef(AppState.currentState);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    console.log('🚀 ~ handleAppStateChange ~ nextAppState:', nextAppState);
    if (nextAppState === 'background') {
      recordStartTime();
    } else if (nextAppState === 'active' && appState.current === 'background') {
      const startTime = storage.getNumber('startTime');
      if (startTime) {
        const currentTime = Date.now();
        const diff = currentTime - startTime;
        const inactivityTimeout = 1000 * 60 * 5; // 5 minutes
        console.log('🚀 ~ handleAppStateChange ~ diff:', diff);
        if (diff > inactivityTimeout && isSignedIn) {
          router.replace('/(authenticated)/(modals)/lock');
        }
      }
    }
    appState.current = nextAppState;
  };

  const recordStartTime = () => {
    storage.set('startTime', Date.now());
  };
  return children;
};
