'use client';

import { useState } from "react";

export default function CommentForm({ photoId, author, onCommentAdded }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId, text, author }),
      });

      const data = await res.json();
      if (res.ok) {
        // ✅ Yeni yorumu üst componente bildir
        onCommentAdded({
          photoId,
          commentId: data.commentId,
          text,
          author,
          createdAt: data.createdAt,
        });
        setText("");
      } else {
        console.error("Yorum ekleme hatası:", data.error);
      }
    } catch (err) {
      console.error("Yorum gönderilemedi:", err);
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
        {loading ? "Gönderiliyor..." : "Gönder"}
      </button>
    </form>
  );
}
