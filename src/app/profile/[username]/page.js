import { Suspense } from 'react';
import UserProfile from '@/components/Profile/UserProfile';

export default function ProfilePage({ params }) {
  return (
    <div className="profile-page">
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <UserProfile username={params.username} />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({ params }) {
  return {
    title: `${params.username} - Fotoğrafları`,
    description: `${params.username} kullanıcısının fotoğraf arşivi`,
  };
}