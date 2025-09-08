'use client';

import { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import { AmplifyProvider } from '../AmplifyProvider';
// ✅ Amplify Data client
const client = generateClient();

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
        text,
        author,
        createdAt: new Date().toISOString(),
      });

      if (errors) {
        console.error('❌ Yorum ekleme hatası:', errors);
        return;
      }

      onCommentAdded(data); // ✅ Use returned `id`
      setText('');
    } catch (err) {
      console.error('❌ Yorum gönderilemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Yorum yaz..."
        className="flex-1 border rounded px-2 py-1"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        {loading ? 'Gönderiliyor...' : 'Gönder'}
      </button>
    </form>
  );
}
