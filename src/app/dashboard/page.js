'use client';

import { withAuthenticator } from '@aws-amplify/ui-react';
import { getCurrentUser } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PhotoUpload from '@/components/Upload/PhotoUpload';
import UserProfile from '@/components/Profile/UserProfile';

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.log('Kullanıcı giriş yapmamış');
      router.push('/');
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  if (!user) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Kontrol Paneli</h1>
        <div className="user-actions">
          <span>Merhaba, {user.username}</span>
          <button onClick={handleSignOut} className="signout-button">Çıkış Yap</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'upload' ? 'nav-button active' : 'nav-button'}
          onClick={() => setActiveTab('upload')}
        >
          Fotoğraf Yükle
        </button>
        <button 
          className={activeTab === 'profile' ? 'nav-button active' : 'nav-button'}
          onClick={() => setActiveTab('profile')}
        >
          Profilim
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'upload' && <PhotoUpload />}
        {activeTab === 'profile' && <UserProfile username={user.username} />}
      </main>
    </div>
  );
}

export default withAuthenticator(DashboardPage);