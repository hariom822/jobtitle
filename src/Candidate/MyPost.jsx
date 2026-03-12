import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit, Heart, MessageCircle, X, Check } from "lucide-react";

export default function MyPost() {
  const [posts, setPosts] = useState([]);
  const [editOpen, setEditOpen] = useState(null);
  const [editText, setEditText] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const res = await axios.get(
      `http://localhost:8800/post/user/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPosts(res.data);
  };

  const deletePost = async (postId) => {
    await axios.delete(`http://localhost:8800/post/delete/${postId}`);
    fetchPosts();
  };

  const updatePost = async (id) => {
    await axios.post(`http://localhost:8800/post/update/${id}`, { description: editText });
    setEditOpen(null);
    fetchPosts();
  };

  const deleteComment = async (id) => {
    await axios.delete(`http://localhost:8800/commant/delete/${id}`);
    fetchPosts();
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-16 pb-10">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 mb-6">
        <div className="max-w-2xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Edit size={20} className="text-blue-700" />
            <h1 className="text-lg font-bold text-gray-800">My Posts</h1>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-3 py-0.5 rounded-full">
              {posts.length} Posts
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 flex flex-col gap-4">

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="bg-white border border-dashed border-gray-300 rounded-lg py-20 text-center">
            <MessageCircle size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">You haven't posted anything yet.</p>
          </div>
        )}

        {posts.map(post => (
          <div key={post._id} className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition overflow-hidden">

            {/* Post Image */}
            {post.Image && (
              <img src={post.Image} alt="" className="w-full object-cover max-h-64" />
            )}

            <div className="p-5">

              {/* Title + Action Buttons */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-base font-bold text-gray-800">{post.title}</h2>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setEditOpen(post._id); setEditText(post.description); }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 transition"
                  >
                    <Edit size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => deletePost(post._id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-200 px-3 py-1.5 rounded hover:bg-red-50 transition"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{post.description}</p>

              {/* Edit Box */}
              {editOpen === post._id && (
                <div className="mb-4 bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Edit Description</label>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 resize-none bg-white mb-2"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditOpen(null)}
                      className="flex items-center gap-1 text-xs font-semibold text-gray-600 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100 transition"
                    >
                      <X size={11} /> Cancel
                    </button>
                    <button
                      onClick={() => updatePost(post._id)}
                      className="flex items-center gap-1 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded transition"
                    >
                      <Check size={11} /> Update
                    </button>
                  </div>
                </div>
              )}

              {/* Likes */}
              <div className="border-t border-gray-100 pt-3 mb-3">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                  <Heart size={15} className="text-red-500 fill-red-500" />
                  {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
                </p>
                {post.likes?.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-1">
                    {post.likes.map((u) => (
                      <span key={u._id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {u.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className="border-t border-gray-100 pt-3">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-3">
                  <MessageCircle size={15} className="text-blue-600" />
                  {post.Comment?.length || 0} {post.Comment?.length === 1 ? "Comment" : "Comments"}
                </p>

                {post.Comment?.length === 0 && (
                  <p className="text-xs text-gray-400 ml-1">No comments yet.</p>
                )}

                <div className="flex flex-col gap-2">
                  {post.Comment?.map((c) => (
                    <div key={c._id} className="flex items-start gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-700 text-xs font-bold">
                          {c.userId?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-gray-700">{c.userId?.name}</p>
                          <button
                            onClick={() => deleteComment(c._id)}
                            className="text-red-500 hover:text-red-700 transition flex-shrink-0"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
