
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import {
  FirestorePermissionError,
  type SecurityRuleContext,
} from '@/firebase/errors';
import { useApp } from '@/contexts/app-provider';

// This is a client-side only component that will listen for Firestore permission errors
// and throw them as uncaught exceptions to be picked up by Next.js's error overlay.
export function FirebaseErrorListener() {
  const { authUser } = useApp();

  useEffect(() => {
    const handler = (error: FirestorePermissionError) => {
      if (process.env.NODE_ENV === 'development') {
        const contextualError = new Error(
          `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${JSON.stringify(
            {
              auth: authUser,
              ...error.context,
            },
            null,
            2
          )}`
        );
        contextualError.name = 'FirestorePermissionError';
        // Throwing the error will cause it to be picked up by the Next.js error overlay
        // This is only for development and will not happen in production.
        throw contextualError;
      }
    };

    errorEmitter.on('permission-error', handler);

    return () => {
      errorEmitter.off('permission-error', handler);
    };
  }, [authUser]);

  return null; // This component doesn't render anything
}
