'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signOut } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import { getUrl } from 'aws-amplify/storage';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import CommentForm from '@/components/Comments/CommentForm';
import { AmplifyProvider } from '@/components/AmplifyProvider';

// ✅ Amplify Data client
const client = generateClient();

function HomePage() {
  const [photos, setPhotos] = useState([]);
  const [comments, setComments] = useState({});
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

  return (
    <AmplifyProvider>
      <Authenticator>
        {({ user }) => (
          <div className="container">
            {/* Navbar */}
            <nav className="navbar">
              <h1>📸 Secure Photo Archive</h1>
              {user && (
                <div className="nav-user">
                  <span>Hoş geldin, {user.username}</span>
                  <Link href="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="nav-button">
                    Çıkış Yap
                  </button>
                </div>
              )}
            </nav>

            {/* Main Content */}
            <main className="main-content">
              {user ? (
                <div className="feed">
                  {photos.length === 0 ? (
                    <p>Fotoğraflar yükleniyor...</p>
                  ) : (
                    photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="photo-card border rounded-xl shadow-md p-4 mb-6 max-w-md mx-auto bg-white"
                      >
                        {/* Image */}
                        <div className="w-full h-80 flex items-center justify-center bg-gray-100 rounded-md">
                          {photo.url ? (
                            <img
                              src={photo.url}
                              alt={photo.caption}
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <span className="text-gray-400">Resim bulunamadı</span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="photo-info mt-3 text-center">
                          <p className="font-semibold">{user.username}</p>
                          <p className="text-gray-700">{photo.caption}</p>
                        </div>

                        {/* Comments */}
                        <div className="comments mt-3 text-left space-y-1">
                          {(comments[photo.id] || []).map((c) => (
                            <p key={c.id} className="text-sm">
                              <span className="font-bold">{c.author}:</span> {c.text}
                            </p>
                          ))}
                        </div>

                        {/* Comment Form */}
                        <CommentForm
                          photoId={photo.id}
                          author={user.username}
                          onCommentAdded={(comment) =>
                            handleNewComment(photo.id, comment)
                          }
                        />
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="auth-actions">
                  <h2>Güvenli Fotoğraf Arşiviniz</h2>
                  <p>Fotoğraflarınızı güvenle saklayın ve paylaşın</p>
                  <p>Lütfen giriş yapın 👆</p>
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
