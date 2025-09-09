'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signOut } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import { getUrl } from 'aws-amplify/storage';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './custom.css'; // Özel stiller

import CommentForm from '@/components/Comments/CommentForm';
import { AmplifyProvider } from '@/components/AmplifyProvider';

// ✅ Amplify Data client
const client = generateClient();

function HomePage() {
  const [photos, setPhotos] = useState([]);
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const router = useRouter();

  // 🔥 Fotoğrafları sayfa yüklenince al
  useEffect(() => {
    fetchPhotos();
  }, []);

  // --- Fetch Photos ---
  async function fetchPhotos() {
    try {
      const { data, errors } = await client.models.Photo.list();
      if (errors) throw new Error(errors.map((e) => e.message).join(', '));

      // 🔑 Signed URL ekle
      const photosWithUrls = await Promise.all(
        data.map(async (photo) => {
          try {
            const { url } = await getUrl({
              key: photo.fileName,
              options: { accessLevel: 'public' },
            });
            return { ...photo, url: url.toString() };
          } catch (err) {
            console.error('❌ URL alınamadı:', photo.fileName, err);
            return { ...photo, url: '' };
          }
        })
      );

      setPhotos(photosWithUrls);

      // Her foto için yorumları getir
      for (const photo of photosWithUrls) {
        await fetchComments(photo.id);
      }
    } catch (error) {
      console.error('❌ Fotoğraflar alınamadı:', error);
    }
  }

  // --- Fetch Comments ---
  async function fetchComments(photoId) {
    try {
      const { data, errors } = await client.models.Comment.list({
        filter: { photoId: { eq: photoId } },
      });
      if (errors) throw new Error(errors.map((e) => e.message).join(', '));

      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setComments((prev) => ({
        ...prev,
        [photoId]: sorted,
      }));
    } catch (error) {
      console.error('❌ Yorumlar alınamadı:', error);
    }
  }

  // --- Sign Out ---
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('❌ Çıkış hatası:', error);
    }
  };

  // --- Yeni yorum ekleme ---
  const handleNewComment = (photoId, comment) => {
    setComments((prev) => ({
      ...prev,
      [photoId]: [comment, ...(prev[photoId] || [])],
    }));
  };

  // --- Toggle comments visibility ---
  const toggleComments = (photoId) => {
    setShowComments(prev => ({
      ...prev,
      [photoId]: !prev[photoId]
    }));
  };

  return (
    <AmplifyProvider>
      <Authenticator
      >
        {({ user }) => (
          <div className="instagram-feed">
            {/* Instagram-style Header */}
            <header className="header">
              <div className="header-content">
                <h1 className="logo">PhotoShare</h1>
                {user && (
                  <div className="nav-actions">
                    <span className="nav-username">{user?.username}</span>
                    <Link href="/dashboard" className="nav-link">
                      Dashboard
                    </Link>
                    <button onClick={handleSignOut} className="sign-out-btn">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
              {user ? (
                <div>
                  {photos.length === 0 ? (
                    <div className="loading-container">
                      <div className="spinner"></div>
                      <p>Loading photos...</p>
                    </div>
                  ) : (
                    photos.map((photo) => (
                      <article key={photo.id} className="post-card">
                        {/* Post Header */}
                        <div className="post-header">
                          <div className="avatar">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="username">{user.username}</span>
                        </div>

                        {/* Image */}
                        <div className="image-container">
                          {photo.url ? (
                            <img
                              src={photo.url}
                              alt={photo.caption}
                              className="post-image"
                            />
                          ) : (
                            <div style={{ textAlign: 'center', color: '#8e8e8e' }}>
                              <div style={{ 
                                width: '48px', 
                                height: '48px', 
                                margin: '0 auto 12px',
                                background: '#dbdbdb',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <p>Image not found</p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="post-actions">
                          <button className="action-btn">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => toggleComments(photo.id)}
                            className="action-btn"
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </button>
                          <button className="action-btn">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </button>
                        </div>

                        <div className="post-content">
                          {/* Caption */}
                          {photo.caption && (
                            <div className="caption">
                              <span className="username">{user.username}</span>
                              {photo.caption}
                            </div>
                          )}

                          {/* Comments Count */}
                          {comments[photo.id] && comments[photo.id].length > 0 && (
                            <button
                              onClick={() => toggleComments(photo.id)}
                              className="comments-toggle"
                            >
                              {showComments[photo.id] 
                                ? 'Hide comments' 
                                : `View ${comments[photo.id].length} comment${comments[photo.id].length !== 1 ? 's' : ''}`
                              }
                            </button>
                          )}

                          {/* Comments */}
                          {showComments[photo.id] && (
                            <div className="comments-list">
                              {(comments[photo.id] || []).map((comment) => (
                                <div key={comment.id} className="comment">
                                  <div className="comment-avatar">
                                    {comment.author.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="comment-text">
                                    <span className="comment-author">{comment.author}</span>
                                    {comment.text}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Comment Form */}
                          <div style={{ borderTop: '1px solid #efefef', paddingTop: '12px' }}>
                            <CommentForm
                              photoId={photo.id}
                              author={user.username}
                              onCommentAdded={(comment) =>
                                handleNewComment(photo.id, comment)
                              }
                            />
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              ) : (
                <div className="welcome-container">
                  <div className="welcome-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="welcome-title">Welcome to PhotoShare</h2>
                  <p className="welcome-subtitle">Share your moments with the world</p>
                  <p className="welcome-text">Please sign in above to get started</p>
                </div>
              )}
            </main>
          </div>
        )}
      </Authenticator>
    </AmplifyProvider>
  );
}

export default HomePage;