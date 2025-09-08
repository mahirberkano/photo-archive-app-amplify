'use client';

import { useState, useEffect } from 'react';
import { getUrl } from 'aws-amplify/storage';
import Image from 'next/image';

export default function UserProfile({ username }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (username) {
      fetchUserPhotos();
    }
  }, [username]);

  const fetchUserPhotos = async () => {
    try {
      const response = await fetch(`/api/photos?username=${username}`);
      if (!response.ok) throw new Error('Fotoğraflar alınamadı');
      
      const photoData = await response.json();
      
      const photosWithUrls = await Promise.all(
        photoData.map(async (photo) => {
          try {
            const { url } = await getUrl({
              path: photo.fileName,
              options: { expiresIn: 3600 }
            });
            return { ...photo, url: url.toString() };
          } catch (error) {
            console.error('URL alma hatası:', error);
            return { ...photo, url: null };
          }
        })
      );
      
      setPhotos(photosWithUrls);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('Fotoğraflar yüklenirken hata oluştu');
    }
    setLoading(false);
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {username} Kullanıcısının Fotoğrafları
      </h2>

      {photos.length === 0 ? (
        <div className="empty-state text-gray-500">
          Bu kullanıcının henüz fotoğrafı yok.
        </div>
      ) : (
        <div className="masonry">
          {photos.map((photo, idx) => (
            <div key={photo.photoId || photo.photoarchive || idx} className="masonry-item">
              {photo.url ? (
                <Image
                  src={photo.url}
                  alt={photo.caption || 'Fotoğraf'}
                  width={400}
                  height={300}
                  className="rounded-lg shadow-md mb-2"
                  unoptimized={true}
                />
              ) : (
                <div className="photo-placeholder bg-gray-200 h-40 rounded mb-2 flex items-center justify-center">
                  Fotoğraf yüklenemedi
                </div>
              )}
              <div className="p-1">
                <p className="text-sm text-gray-800">
                  {photo.caption || 'Açıklama yok'}
                </p>
                <small className="text-xs text-gray-500">
                  {new Date(photo.createdAt).toLocaleDateString('tr-TR')}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
