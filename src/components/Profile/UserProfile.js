'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { getUrl } from 'aws-amplify/storage';
import Image from 'next/image';

// ✅ Data client
const client = generateClient();

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
            <div
              key={photo.id || idx}
              className="masonry-item"
            >
              {photo.url ? (
                <Image
                  src={photo.url}
                  alt={photo.caption || 'Fotoğraf'}
                  width={400}
                  height={300}
                  className="rounded-lg shadow-md mb-2"
                  unoptimized
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
                  {photo.createdAt
                    ? new Date(photo.createdAt).toLocaleDateString('tr-TR')
                    : ''}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
