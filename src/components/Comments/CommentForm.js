'use client';

import { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import { AmplifyProvider } from '../AmplifyProvider';

// ✅ Amplify Data client
const client = generateClient();

// Instagram-style comment form CSS
const commentFormStyles = `
  .comment-form {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0;
    margin: 0;
  }
  
  .comment-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: #262626;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    resize: none;
    max-height: 80px;
    line-height: 18px;
    padding: 0;
  }
  
  .comment-input::placeholder {
    color: #8e8e8e;
  }
  
  .comment-input:focus {
    outline: none;
  }
  
  .comment-submit-btn {
    background: none;
    border: none;
    color: #0095f6;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    transition: opacity 0.2s;
  }
  
  .comment-submit-btn:hover:not(:disabled) {
    opacity: 0.7;
  }
  
  .comment-submit-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .comment-emoji-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-right: 8px;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  
  .comment-emoji-btn:hover {
    opacity: 1;
  }
  
  .comment-emoji-btn svg {
    width: 24px;
    height: 24px;
    stroke: #262626;
    stroke-width: 1.5;
  }
`;

export default function CommentForm({ photoId, author, onCommentAdded }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const { data, errors } = await client.models.Comment.create({
        photoId,
        text: text.trim(),
        author,
        createdAt: new Date().toISOString(),
      });

      if (errors) {
        console.error('❌ Comment creation error:', errors);
        return;
      }

      onCommentAdded(data); // ✅ Use returned `id`
      setText('');
    } catch (err) {
      console.error('❌ Comment could not be sent:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: commentFormStyles }} />
      <form onSubmit={handleSubmit} className="comment-form">
        {/* Emoji button (like Instagram) */}
        <button 
          type="button" 
          className="comment-emoji-btn"
          onClick={() => {
            // You can add emoji picker functionality here later
            console.log('Emoji picker clicked');
          }}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a comment..."
          className="comment-input"
          disabled={loading}
          maxLength={2200} // Instagram's comment limit
        />
        
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="comment-submit-btn"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </>
  );
}