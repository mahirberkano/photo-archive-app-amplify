'use client';

import { Amplify } from 'aws-amplify';
import config from '@/aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// Client-side konfigürasyon
Amplify.configure(config);

export function AmplifyProvider({ children }) {
  return (
    <Authenticator.Provider>
      {children}
    </Authenticator.Provider>
  );
}