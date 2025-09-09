'use client';

import React, { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import { v4 as uuidv4 } from 'uuid';
import outputs from '../../../amplify_outputs.json';

// Amplify Data client
const client = generateClient({ authMode: 'userPool', ...outputs });

// Instagram-style upload CSS
const uploadStyles = `
  .upload-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }
  
  .upload-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    border: 1px solid #dbdbdb;
  }
  
  .upload-header {
    padding: 20px 24px;
    border-bottom: 1px solid #efefef;
    text-align: center;
  }
  
  .upload-title {
    font-size: 18px;
    font-weight: 600;
    color: #262626;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .upload-icon {
    width: 24px;
    height: 24px;
    stroke: #262626;
    stroke-width: 1.5;
  }
  
  .upload-form {
    padding: 24px;
  }
  
  .file-section {
    margin-bottom: 24px;
  }
  
  .file-input {
    display: none;
  }
  
  .file-drop-zone {
    border: 2px dashed #dbdbdb;
    border-radius: 12px;
    padding: 40px 20px;
    text-align: center;
    background: #fafafa;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
  }
  
  .file-drop-zone:hover {
    border-color: #0095f6;
    background: #f0f8ff;
  }
  
  .file-drop-zone.drag-over {
    border-color: #0095f6;
    background: #f0f8ff;
    transform: scale(1.02);
  }
  
  .file-drop-icon {
    width: 48px;
    height: 48px;
    stroke: #8e8e8e;
    stroke-width: 1.5;
    margin: 0 auto 16px;
  }
  
  .file-drop-text {
    color: #262626;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  .file-drop-subtext {
    color: #8e8e8e;
    font-size: 14px;
    margin-bottom: 16px;
  }
  
  .file-button {
    background: #0095f6;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }
  
  .file-button:hover:not(:disabled) {
    background: #1877f2;
    transform: translateY(-1px);
  }
  
  .file-button:disabled {
    background: #8e8e8e;
    cursor: not-allowed;
  }
  
  .file-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
    padding: 12px;
    background: #f0f8ff;
    border-radius: 8px;
    border: 1px solid #0095f6;
  }
  
  .file-info-icon {
    width: 20px;
    height: 20px;
    stroke: #0095f6;
    stroke-width: 2;
    flex-shrink: 0;
  }
  
  .file-name {
    color: #262626;
    font-size: 14px;
    font-weight: 500;
    flex: 1;
    word-break: break-all;
  }
  
  .file-remove {
    background: none;
    border: none;
    color: #ed4956;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background 0.2s;
  }
  
  .file-remove:hover {
    background: rgba(237, 73, 86, 0.1);
  }
  
  .preview-section {
    margin-bottom: 24px;
    text-align: center;
  }
  
  .preview-container {
    position: relative;
    display: inline-block;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  .preview-image {
    max-width: 100%;
    max-height: 400px;
    width: auto;
    height: auto;
    border-radius: 12px;
    display: block;
  }
  
  .preview-overlay {
    position: absolute;
    top: 8px;
    right: 8px;
  }
  
  .preview-remove {
    background: rgba(0, 0, 0, 0.7);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .preview-remove:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }
  
  .caption-section {
    margin-bottom: 24px;
  }
  
  .caption-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #262626;
    margin-bottom: 8px;
  }
  
  .caption-input {
    width: 100%;
    min-height: 80px;
    padding: 12px 16px;
    border: 1px solid #dbdbdb;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    resize: vertical;
    background: white;
    transition: border-color 0.2s;
  }
  
  .caption-input:focus {
    outline: none;
    border-color: #0095f6;
    box-shadow: 0 0 0 2px rgba(0, 149, 246, 0.2);
  }
  
  .caption-input::placeholder {
    color: #8e8e8e;
  }
  
  .caption-counter {
    text-align: right;
    font-size: 12px;
    color: #8e8e8e;
    margin-top: 4px;
  }
  
  .upload-button {
    width: 100%;
    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
    color: white;
    border: none;
    padding: 14px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    font-family: inherit;
    position: relative;
    overflow: hidden;
  }
  
  .upload-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
  
  .upload-button:disabled {
    background: #8e8e8e;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .upload-button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .upload-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-message {
    background: #ffebee;
    color: #c62828;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    border: 1px solid #ffcdd2;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .error-icon {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    stroke-width: 2;
    flex-shrink: 0;
  }
  
  .success-message {
    background: #e8f5e8;
    color: #2e7d32;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    border: 1px solid #c8e6c9;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .success-icon {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    stroke-width: 2;
    flex-shrink: 0;
  }
  
  @media (max-width: 768px) {
    .upload-container {
      margin: 0 16px;
    }
    
    .upload-form {
      padding: 20px;
    }
    
    .file-drop-zone {
      padding: 32px 16px;
    }
    
    .preview-image {
      max-height: 300px;
    }
  }
`;

export default function PhotoUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile?.type.startsWith('image/')) {
      setError('Please upload only image files');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setSuccess('');
    setFile(selectedFile);

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      const fileId = uuidv4();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${fileId}.${fileExtension}`;

      // Get Cognito user → username
      const user = await getCurrentUser();
      const username = user.username;

      // Upload to S3
      await uploadData({
        key: fileName,
        data: file,
        options: {
          accessLevel: 'public',
          contentType: file.type,
        },
      }).result;

      console.log('✅ S3 upload successful:', fileName);

      // Save to DynamoDB (direct Data client)
      const { data, errors } = await client.models.Photo.create({
        id: fileId,
        fileName: fileName,
        caption,
        uploadedBy: username,
        createdAt: new Date().toISOString(),
      });

      if (errors) {
        throw new Error(errors.map((e) => e.message).join(', '));
      }

      console.log('✅ DynamoDB record successful:', data);

      onUploadSuccess?.();
      setFile(null);
      setCaption('');
      setPreviewUrl('');
      setSuccess('Photo uploaded successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload error: ' + error.message);
    }

    setIsUploading(false);
  };

  const maxCaptionLength = 2200;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: uploadStyles }} />
      <div className="upload-container">
        <div className="upload-card">
          <div className="upload-header">
            <h2 className="upload-title">
              <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Share a new photo
            </h2>
          </div>

          <div className="upload-form">
            {error && (
              <div className="error-message">
                <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            )}

            {!previewUrl && (
              <div className="file-section">
                <div
                  className={`file-drop-zone ${dragOver ? 'drag-over' : ''}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <svg className="file-drop-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div className="file-drop-text">Drag and drop your photo here</div>
                  <div className="file-drop-subtext">or click to browse your files</div>
                  <button type="button" className="file-button" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Select Photo'}
                  </button>
                </div>
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  className="file-input"
                  id="file-upload"
                  disabled={isUploading}
                />
              </div>
            )}

            {file && !previewUrl && (
              <div className="file-info">
                <svg className="file-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="file-name">{file.name}</span>
                <button type="button" onClick={removeFile} className="file-remove">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {previewUrl && (
              <div className="preview-section">
                <div className="preview-container">
                  <img src={previewUrl} alt="Preview" className="preview-image" />
                  <div className="preview-overlay">
                    <button type="button" onClick={removeFile} className="preview-remove">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="caption-section">
              <label htmlFor="caption" className="caption-label">
                Write a caption
              </label>
              <textarea
                id="caption"
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value.slice(0, maxCaptionLength))}
                className="caption-input"
                rows="4"
                disabled={isUploading}
                maxLength={maxCaptionLength}
              />
              <div className="caption-counter">
                {caption.length}/{maxCaptionLength}
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={isUploading || !file}
              className="upload-button"
            >
              <div className="upload-button-content">
                {isUploading && <div className="upload-spinner"></div>}
                <span>{isUploading ? 'Sharing...' : 'Share Photo'}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}