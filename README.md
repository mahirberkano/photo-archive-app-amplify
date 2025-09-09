'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { getUrl } from 'aws-amplify/storage';
import Image from 'next/image';

// ✅ Data client
const client = generateClient();

// Instagram-style profile CSS
const profileStyles = `
  .profile-container {
    max-width: 935px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: #fafafa;
    min-height: 100vh;
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 44px;
    padding: 30px 0;
    background: white;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .profile-avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 80px;
    flex-shrink: 0;
  }
  
  .profile-avatar-text {
    color: white;
    font-size: 48px;
    font-weight: 700;
  }
  
  .profile-info {
    flex: 1;
  }
  
  .profile-username {
    font-size: 28px;
    font-weight: 300;
    color: #262626;
    margin-bottom: 20px;
  }
  
  .profile-stats {
    display: flex;
    gap: 40px;
    margin-bottom: 20px;
  }
  
  .profile-stat {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .profile-stat-number {
    font-weight: 600;
    color: #262626;
    font-size: 16px;
  }
  
  .profile-stat-label {
    color: #262626;
    font-size: 16px;
  }
  
  .profile-divider {
    border: none;
    height: 1px;
    background-color: #dbdbdb;
    margin: 44px 0;
  }
  
  .photos-section-header {
    display: flex;
    justify-content: center;
    border-top: 1px solid #dbdbdb;
    background: white;
    margin-bottom: 28px;
  }
  
  .photos-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 16px 0;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1px;
    color: #262626;
    border-top: 1px solid #262626;
  }
  
  .photos-tab svg {
    width: 12px;
    height: 12px;
    stroke: currentColor;
    stroke-width: 2;
  }
  
  .photos-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    max-width: 100%;
  }
  
  .photo-item {
    aspect-ratio: 1;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    background: #f5f5f5;
  }
  
  .photo-item:hover .photo-overlay {
    opacity: 1;
  }
  
  .photo-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .photo-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .photo-stats {
    display: flex;
    gap: 30px;
    color: white;
    font-weight: 600;
    font-size: 16px;
  }
  
  .photo-stat {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .photo-stat svg {
    width: 19px;
    height: 19px;
    fill: white;
  }
  
  .photo-placeholder {
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8e8e8e;
    font-size: 14px;
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
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
  }
  
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    color: #ed4956;
    font-size: 16px;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
  }
  
  .empty-state-icon {
    width: 62px;
    height: 62px;
    border: 2px solid #262626;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  }
  
  .empty-state-icon svg {
    width: 24px;
    height: 24px;
    stroke: #262626;
    stroke-width: 1.5;
  }
  
  .empty-state-title {
    font-size: 28px;
    font-weight: 300;
    color: #262626;
    margin-bottom: 10px;
  }
  
  .empty-state-text {
    font-size: 14px;
    color: #8e8e8e;
  }
  
  @media (max-width: 768px) {
    .profile-header {
      flex-direction: column;
      text-align: center;
    }
    
    .profile-avatar {
      margin-right: 0;
      margin-bottom: 30px;
      width: 120px;
      height: 120px;
    }
    
    .profile-avatar-text {
      font-size: 36px;
    }
    
    .profile-stats {
      justify-content: center;
    }
    
    .photos-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 3px;
    }
  }
`;

export default function UserProfile({ username }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (username) {
      fetchUserPhotos();
    }
  }, [username]);

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    setShowModal(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closePhotoModal = () => {
    setShowModal(false);
    setSelectedPhoto(null);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        closePhotoModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showModal]);

  const fetchUserPhotos = async () => {
    try {
      // ✅ Query Amplify Data directly
      const { data, errors } = await client.models.Photo.list({
        filter: { uploadedBy: { eq: username } },
      });

      if (errors) throw new Error(errors.map((e) => e.message).join(', '));

      // ✅ Generate signed S3 URLs for each photo
      const photosWithUrls = await Promise.all(
        data.map(async (photo) => {
          try {
            const { url } = await getUrl({
              key: photo.fileName, // Gen2 uses `key`, not `path`
              options: { expiresIn: 3600, accessLevel: 'public' },
            });
            return { ...photo, url: url.toString() };
          } catch (err) {
            console.error('URL fetch error:', err);
            return { ...photo, url: null };
          }
        })
      );

      setPhotos(photosWithUrls);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Error loading photos');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: profileStyles }} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: profileStyles }} />
        <div className="error-container">{error}</div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: profileStyles }} />
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="profile-avatar-text">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="profile-info">
            <h1 className="profile-username">{username}</h1>
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-number">{photos.length}</span>
                <span className="profile-stat-label">posts</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-number">0</span>
                <span className="profile-stat-label">followers</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-number">0</span>
                <span className="profile-stat-label">following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Photos Section Header */}
        <div className="photos-section-header">
          <div className="photos-tab">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21,15 16,10 5,21"></polyline>
            </svg>
            <span>Posts</span>
          </div>
        </div>

        {/* Photos Grid */}
        {photos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
              </svg>
            </div>
            <h2 className="empty-state-title">No Posts Yet</h2>
            <p className="empty-state-text">When {username} shares photos, they'll appear here.</p>
          </div>
        ) : (
          <div className="photos-grid">
            {photos.map((photo, idx) => (
              <div
                key={photo.id || idx}
                className="photo-item"
                onClick={() => openPhotoModal(photo)}
              >
                {photo.url ? (
                  <>
                    <Image
                      src={photo.url}
                      alt={photo.caption || 'Photo'}
                      width={300}
                      height={300}
                      className="photo-image"
                      unoptimized
                    />
                    <div className="photo-overlay">
                      <div className="photo-stats">
                        <div className="photo-stat">
                          <svg viewBox="0 0 24 24">
                            <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938z"></path>
                          </svg>
                          <span>0</span>
                        </div>
                        <div className="photo-stat">
                          <svg viewBox="0 0 24 24">
                            <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                          </svg>
                          <span>0</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="photo-placeholder">
                    Photo not available
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal rendered via portal */}
        <PhotoModal />
      </div>
    </>
  );
}