'use client';

import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json'
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// Client-side konfigürasyon
Amplify.configure(outputs);

export function AmplifyProvider({ children }) {
  return (
    <Authenticator.Provider>
      {children}
    </Authenticator.Provider>
  );
}