import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import Reactions from "../components/Reactions";
import Comments from "../components/Comments";

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) setPost(post);
        else navigate("/");
      });
    } else navigate("/");
  }, [slug, navigate]);

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  return post ? (
    <div className="min-h-screen py-10 px-4" style={{ background: "#FCF5EE" }}>
      {/* Page wrapper — centered, full vertical, slight rounded */}
      <div
        className="mx-auto w-full max-w-4xl bg-white rounded-lg overflow-hidden"
        style={{
          boxShadow: "0 8px 40px rgba(255, 182, 193, 0.45)",
          minHeight: "90vh",
        }}
      >
        {/* ── Image at top, full width of page, fixed height ── */}
        <div className="w-full mx-auto px-6 pt-6">
          <img
            src={
              post.featuredImage
                ? appwriteService.getFilePreview(post.featuredImage)
                : import.meta.env.BASE_URL + "blogpost.jpg"
            }
            alt={post.title}
            className="w-full h-80 object-cover rounded-sm"
          />
        </div>

        {/* ── Page content area ── */}
        <div className="px-10 py-8">
          {/* Title */}
          <h1
            className="text-3xl font-bold text-[#374151] mb-2"
            style={{ fontFamily: "Quicksand, sans-serif" }}
          >
            {post.title}
          </h1>

          {/* Meta row — author + edit/delete */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-pink-100 gap-3">
            <span className="text-base text-pink-400 font-medium flex items-center gap-1">
              🌸 By{" "}
              <Link
                to={`/user/${post.userId}`}
                className="text-pink-500 font-semibold ml-1 hover:underline"
              >
                {post.userName || "A PinkPages Author"}
              </Link>
            </span>

            {isAuthor && (
              <div className="flex gap-2">
                <Link to={`/edit-post/${post.$id}`}>
                  <button className="bg-pink-100 hover:bg-pink-200 text-pink-600 text-base font-semibold px-4 py-1.5 rounded-full transition">
                    ✏️ Edit
                  </button>
                </Link>
                <button
                  onClick={deletePost}
                  className="bg-red-50 hover:bg-red-100 text-red-400 text-base font-semibold px-4 py-1.5 rounded-full transition"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="text-[#374151] leading-relaxed text-[1.05rem]">
            {parse(post.content)}
          </div>
        </div>

        <Reactions postId={post.$id} align="left" />
        <Comments postId={post.$id} />

        {/* ── Footer of page ── */}
        <div className="px-10 pb-8 pt-4 border-t border-pink-50">
          <Link
            to="/all-posts"
            className="text-pink-400 hover:text-pink-600 text-base font-medium transition"
          >
            ← Back to All Posts
          </Link>
        </div>
      </div>
    </div>
  ) : null;
}
