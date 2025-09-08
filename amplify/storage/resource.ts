import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'photoStorage',
  access: (allow) => ({
    'public/*': [
      allow.authenticated.to(['read', 'write']), // logged in users can upload + read
      allow.guest.to(['read']),                  // guests can view
    ],
  }),
});
