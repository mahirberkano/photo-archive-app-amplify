'use client';

import { withAuthenticator } from '@aws-amplify/ui-react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CommentForm from '@/components/Comments/CommentForm';

function HomePage() {
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [comments, setComments] = useState({}); // { photoId: [yorumlar] }
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      await fetchPhotos();
    } catch (err) {
      console.log('Kullanıcı giriş yapmamış');
    }
  }

  async function fetchPhotos() {
    try {
      const res = await fetch(`/api/photos?username=all`);
      const data = await res.json();
      setPhotos(data);

      // ✅ Fotoğraflar geldikten sonra yorumları da çekelim
      for (const photo of data) {
        await fetchComments(photo.photoarchive);
      }
    } catch (error) {
      console.error("Fotoğraflar alınamadı:", error);
    }
  }

  async function fetchComments(photoId) {
    try {
      const res = await fetch(`/api/comments?photoId=${photoId}`);
      const data = await res.json();

      setComments((prev) => ({
        ...prev,
        [photoId]: data, // backend'den gelen yorum listesi
      }));
    } catch (error) {
      console.error("Yorumlar alınamadı:", error);
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  // ✅ Yeni yorum geldiğinde state güncelle
  const handleNewComment = (photoId, comment) => {
    setComments((prev) => ({
      ...prev,
      [photoId]: [comment, ...(prev[photoId] || [])],
    }));
  };

  return (
    <div className="container">
      <nav className="navbar">
        <h1>📸 Secure Photo Archive</h1>
        {user ? (
          <div className="nav-user">
            <span>Hoş geldin, {user.username}</span>
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <button onClick={handleSignOut} className="nav-button">Çıkış Yap</button>
          </div>
        ) : (
          <Link href="/dashboard" className="nav-link">Giriş Yap</Link>
        )}
      </nav>

      <main className="main-content">
        {user ? (
          <div className="feed">
            {photos.length === 0 ? (
              <p>Henüz hiç fotoğraf yüklenmemiş.</p>
            ) : (
              photos.map((photo) => (
                <div
                key={photo.photoarchive}
                className="photo-card border rounded-xl shadow-md p-4 mb-6 max-w-md mx-auto bg-white"
              >
                {/* Görsel */}
                <div className="w-full h-80 flex items-center justify-center bg-gray-100 rounded-md">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Caption ve kullanıcı bilgisi */}
                <div className="photo-info mt-3 text-center">
                  <p className="font-semibold">{photo.uploadedBy}</p>
                  <p className="text-gray-700">{photo.caption}</p>
                </div>

                {/* Yorumlar */}
                <div className="comments mt-3 text-left space-y-1">
                  {(comments[photo.photoarchive] || []).map((c) => (
                    <p key={c.commentId} className="text-sm">
                      <span className="font-bold">{c.author}:</span> {c.text}
                    </p>
                  ))}
                </div>

                {/* Yorum formu */}
                <CommentForm
                  photoId={photo.photoarchive}
                  author={user.username}
                  onCommentAdded={(comment) => handleNewComment(photo.photoarchive, comment)}
                />
              </div>


              ))
            )}
          </div>
        ) : (
          <div className="auth-actions">
            <h2>Güvenli Fotoğraf Arşiviniz</h2>
            <p>Fotoğraflarınızı güvenle saklayın ve paylaşın</p>
            <Link href="/dashboard">
              <button className="primary-button">Hesap Oluştur veya Giriş Yap</button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default withAuthenticator(HomePage);
