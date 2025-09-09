'use client';

import { withAuthenticator } from '@aws-amplify/ui-react';
import { getCurrentUser } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PhotoUpload from '@/components/Upload/PhotoUpload';
import UserProfile from '@/components/Profile/UserProfile';

// Instagram-style dashboard CSS
const dashboardStyles = `
  .dashboard-container {
    min-height: 100vh;
    background-color: #fafafa;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }
  
  .dashboard-header {
    background: white;
    border-bottom: 1px solid #dbdbdb;
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 16px 0;
  }
  
  .dashboard-header-content {
    max-width: 975px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .dashboard-title {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }
  
  .user-actions {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .user-welcome {
    font-size: 14px;
    font-weight: 500;
    color: #262626;
  }
  
  .signout-button {
    background: none;
    border: none;
    color: #8e8e8e;
    font-size: 14px;
    cursor: pointer;
    font-family: inherit;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.2s;
  }
  
  .signout-button:hover {
    background: #f5f5f5;
    color: #262626;
  }
  
  .dashboard-nav {
    background: white;
    border-bottom: 1px solid #dbdbdb;
    padding: 0;
    margin: 0;
  }
  
  .dashboard-nav-content {
    max-width: 975px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    padding: 0 20px;
  }
  
  .nav-button {
    background: none;
    border: none;
    padding: 16px 24px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #8e8e8e;
    cursor: pointer;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    transition: all 0.2s;
    font-family: inherit;
    position: relative;
  }
  
  .nav-button:hover {
    color: #262626;
  }
  
  .nav-button.active {
    color: #262626;
    border-top: 1px solid #262626;
  }
  
  .nav-button:not(:last-child) {
    margin-right: 24px;
  }
  
  .nav-icon {
    width: 12px;
    height: 12px;
    margin-right: 6px;
    stroke: currentColor;
    stroke-width: 2;
  }
  
  .dashboard-content {
    max-width: 975px;
    margin: 0 auto;
    padding: 30px 20px;
    min-height: calc(100vh - 140px);
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #fafafa;
  }
  
  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #0095f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .loading-text {
    color: #8e8e8e;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }
  
  .tab-content {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  @media (max-width: 768px) {
    .dashboard-header-content {
      padding: 0 16px;
    }
    
    .dashboard-nav-content {
      padding: 0 16px;
    }
    
    .nav-button {
      padding: 16px 16px;
      font-size: 11px;
    }
    
    .nav-button:not(:last-child) {
      margin-right: 16px;
    }
    
    .dashboard-content {
      padding: 20px 16px;
    }
    
    .user-actions {
      gap: 12px;
    }
    
    .user-welcome {
      font-size: 13px;
    }
  }
`;

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
      console.log('User not logged in');
      router.push('/');
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: dashboardStyles }} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: dashboardStyles }} />
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-header-content">
            <h1 className="dashboard-title"
            >PhotoShare</h1>
            <div className="user-actions">
              <span className="user-welcome">Welcome, {user.username}</span>
              <button onClick={handleSignOut} className="signout-button">
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="dashboard-nav">
          <div className="dashboard-nav-content">
            <button
              className={activeTab === 'upload' ? 'nav-button active' : 'nav-button'}
              onClick={() => setActiveTab('upload')}
            >
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Photo
            </button>
            <button
              className={activeTab === 'profile' ? 'nav-button active' : 'nav-button'}
              onClick={() => setActiveTab('profile')}
            >
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Profile
            </button>
            <button
              className="nav-button"
              onClick={() => {
                setActiveTab('home');
                router.push('/');
              }}
            >
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="dashboard-content">
          {activeTab === 'upload' && (
            <div className="tab-content">
              <PhotoUpload />
            </div>
          )}
          {activeTab === 'profile' && <UserProfile username={user.username} />}
        </main>
      </div>
    </>
  );
}

export default withAuthenticator(DashboardPage);