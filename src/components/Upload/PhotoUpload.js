'use client';
import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { uploadData } from 'aws-amplify/storage';
import { getCurrentUser } from 'aws-amplify/auth';
import { v4 as uuidv4 } from 'uuid';
import config from '@/aws-exports';
import { fetchAuthSession } from 'aws-amplify/auth';
// Amplify yapılandırması
Amplify.configure(config);

export default function PhotoUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile?.type.startsWith('image/')) {
      setError('Lütfen sadece resim dosyası yükleyin');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Dosya boyutu 10MB\'dan küçük olmalıdır');
      return;
    }

    setError('');
    setFile(selectedFile);

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Lütfen önce bir dosya seçin');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const fileId = uuidv4();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${fileId}.${fileExtension}`;

      // 🔥 Cognito kullanıcısını al → username
      const user = await getCurrentUser();
      const username = user.username;

      // S3'e yükle
      const uploadResult = await uploadData({
        key: fileName,
        data: file,
        options: {
          accessLevel: 'public',
          contentType: file.type,
        }
      }).result;

      console.log('S3 yükleme başarılı:', uploadResult);
        // Yükleme başarılıysa, kimlik bilgilerini al
      const session = await fetchAuthSession();
      const identityId = session.identityId;
      const s3Key = `public/${fileName}`;
      // DynamoDB'ye kaydet
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photoId: fileId,
          caption,
          fileName: s3Key,
          uploadedBy: username,
        }),
      });

      if (!response.ok) {
        throw new Error('Fotoğraf bilgileri kaydedilemedi');
      }

      onUploadSuccess?.();
      setFile(null);
      setCaption('');
      setPreviewUrl('');
      alert('Fotoğraf başarıyla yüklendi!');
    } catch (error) {
      console.error('Upload error:', error);
      setError('Yükleme hatası: ' + error.message);
      alert('Yükleme hatası: ' + error.message);
    }

    setIsUploading(false);
  };

  return (
    <div className="upload-container">
      <h2>Fotoğraf Yükle</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="upload-form">
        <div className="file-section">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
            id="file-upload"
            disabled={isUploading}
          />
          <label htmlFor="file-upload" className="file-label">
            {isUploading ? 'Yükleniyor...' : 'Dosya Seç'}
          </label>
          {file && <span className="file-name">{file.name}</span>}
        </div>

        {previewUrl && (
          <div className="preview-section">
            <img src={previewUrl} alt="Önizleme" className="preview-image" />
          </div>
        )}

        <div className="caption-section">
          <textarea
            placeholder="Fotoğraf açıklaması..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="caption-input"
            rows="3"
            disabled={isUploading}
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={isUploading || !file}
          className="upload-button"
        >
          {isUploading ? 'Yükleniyor...' : 'Fotoğrafı Yükle'}
        </button>
      </div>
    </div>
  );
}
