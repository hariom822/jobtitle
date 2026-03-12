import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, MessageCircle, Share2, Plus, X, Image, Tag, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Post() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [commentOpen, setCommentOpen] = useState(null);
  const [commentText, setCommentText] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => { fetchPosts(); fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8800/users/all");
      setUsers(res.data.users);
    } catch (err) { console.log(err); }
  };

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:8800/post/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts(res.data);
  };

  const toggleUser = (id) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", content);
    formData.append("userId", userId);
    formData.append("image", image);
    formData.append("tags", JSON.stringify(selectedUsers));
    await axios.post("http://localhost:8800/post/add", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOpen(false);
    setTitle(""); setContent(""); setImage(null); setSelectedUsers([]);
    fetchPosts();
  };

  const handleLike = async (postId) => {
    await axios.post(`http://localhost:8800/post/like/${postId}`, { userId });
    fetchPosts();
  };

  const handleComment = async (postId) => {
    await axios.post(`http://localhost:8800/commant/comment/${postId}`, { userId, text: commentText });
    setCommentText("");
    setCommentOpen(null);
    fetchPosts();
  };

  const handleShare = (post) => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
    alert("Post link copied!");
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-16 pb-10">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 mb-6">
        <div className="max-w-2xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle size={20} className="text-blue-700" />
            <h1 className="text-lg font-bold text-gray-800">Community Posts</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/mypost")}
              className="border border-blue-600 text-blue-700 hover:bg-blue-50 text-sm font-semibold px-4 py-2 rounded transition"
            >
              My Posts
            </button>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded transition"
            >
              <Plus size={15} />
              Create Post
            </button>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-2xl mx-auto px-4 flex flex-col gap-4">
        {posts.map(post => (
          <div
            key={post._id}
            className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition overflow-hidden"
          >
            {/* Post Author */}
            <div className="flex items-center gap-3 px-5 pt-4 pb-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-700 text-sm font-bold">
                  {post.userId?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{post.userId?.name}</p>
                <p className="text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>

            {/* Post Title + Description */}
            <div className="px-5 pb-3">
              <h2 className="text-base font-bold text-gray-800 mb-1">{post.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{post.description}</p>
            </div>

            {/* Post Image */}
            {post.Image && (
              <img
                onClick={() => navigate(`/post/${post._id}`)}
                src={post.Image}
                alt=""
                className="w-full object-cover cursor-pointer max-h-72"
              />
            )}

            {/* Actions */}
            <div className="flex items-center border-t border-gray-100 px-2">
              <button
                onClick={() => handleLike(post._id)}
                className={`flex items-center gap-1.5 flex-1 justify-center py-3 text-sm font-medium rounded transition hover:bg-gray-50 ${post.likes.includes(userId) ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
              >
                <Heart
                  size={16}
                  className={post.likes.includes(userId) ? "fill-red-500" : ""}
                />
                Like {post.likes.length > 0 && <span className="text-xs">({post.likes.length})</span>}
              </button>

              <button
                onClick={() => setCommentOpen(commentOpen === post._id ? null : post._id)}
                className="flex items-center gap-1.5 flex-1 justify-center py-3 text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded transition"
              >
                <MessageCircle size={16} />
                Comment {post.Comment?.length > 0 && <span className="text-xs">({post.Comment.length})</span>}
              </button>

              <button
                onClick={() => handleShare(post)}
                className="flex items-center gap-1.5 flex-1 justify-center py-3 text-sm font-medium text-gray-500 hover:text-green-600 hover:bg-gray-50 rounded transition"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>

            {/* Comment Section */}
            {commentOpen === post._id && (
              <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">

                {/* Existing Comments */}
                {post.Comment?.length > 0 && (
                  <div className="mb-3 max-h-36 overflow-y-auto flex flex-col gap-2">
                    {post.Comment.map((c) => (
                      <div key={c._id} className="flex gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-700 text-xs font-bold">
                            {c.userId?.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 flex-1">
                          <p className="text-xs font-semibold text-gray-700">{c.userId?.name}</p>
                          <p className="text-xs text-gray-600">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Input */}
                <div className="flex items-center gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleComment(post._id)}
                    placeholder="Write a comment..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 bg-white"
                  />
                  <button
                    onClick={() => handleComment(post._id)}
                    className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-full transition"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl max-h-screen flex flex-col">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-800">Create Post</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto px-6 py-5 flex-1 flex flex-col gap-4">

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Post Title</label>
                <input
                  placeholder="e.g. Looking for React Developer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Content</label>
                <textarea
                  placeholder="Write something..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Image (optional)</label>
                <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded px-4 py-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                  <Image size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {image ? image.name : "Click to upload image"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
                </label>
              </div>

              {/* Tag Users */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <Tag size={11} /> Tag People
                </label>
                <input
                  placeholder="Search user to tag..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 mb-2"
                />
                <div className="max-h-28 overflow-y-auto border border-gray-200 rounded bg-white">
                  {filteredUsers.map(user => (
                    <div
                      key={user._id}
                      onClick={() => toggleUser(user._id)}
                      className={`px-3 py-2 cursor-pointer flex justify-between items-center text-sm hover:bg-gray-50 border-b border-gray-50 last:border-0 ${selectedUsers.includes(user._id) ? "bg-blue-50" : ""}`}
                    >
                      <span className="text-gray-700">{user.name}</span>
                      {selectedUsers.includes(user._id) && (
                        <span className="text-blue-700 text-xs font-bold">✓</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Tagged Users Pills */}
                {selectedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedUsers.map(id => {
                      const user = users.find(u => u._id === id);
                      return (
                        <span
                          key={id}
                          onClick={() => toggleUser(id)}
                          className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-blue-100"
                        >
                          {user?.name}
                          <X size={10} />
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                className="px-6 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition"
              >
                Publish Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
