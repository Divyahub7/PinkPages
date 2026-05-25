import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Container } from "../components";
import { Helmet } from "react-helmet-async";

export default function Profile() {
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const avatarUrl = userData
    ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userData.name)}&backgroundColor=ffb3c6,ffc8dd,ffccd5`
    : null;

  useEffect(() => {
    if (!userData) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch profile
        const prof = await appwriteService.getProfile(userData.$id);
        if (prof) {
          setProfile(prof);
          setBio(prof.bio || "");
        } else {
          // Auto-create profile on first visit
          const newProfile = await appwriteService.createProfile({
            userId: userData.$id,
            bio: "",
            avatarId: "",
          });
          setProfile(newProfile);
        }

        // Fetch user's posts
        const res = await appwriteService.getPosts();
        if (res?.documents) {
          const userPosts = res.documents.filter(
            (post) => post.userId === userData.$id,
          );
          setPosts(userPosts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData, navigate]);

  const handleSaveBio = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await appwriteService.updateProfile(profile.$id, {
        bio,
        avatarId: profile.avatarId || "",
      });
      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCF5EE]">
        <Helmet>
          <title>My Profile | PinkPages</title>
        </Helmet>
        <p className="text-pink-400 text-lg animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF5EE] py-10 px-4">
      <Container>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* ── LEFT — Profile Card ── */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(255,182,193,0.35)] p-8 flex flex-col items-center text-center sticky top-8">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-200 shadow-md mb-4">
                <img
                  src={avatarUrl}
                  alt={userData?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name */}
              <h1 className="text-2xl font-bold text-[#374151] mb-1">
                {userData?.name}
              </h1>

              {/* Email */}
              <p className="text-sm text-pink-400 mb-4">{userData?.email}</p>

              {/* Stats */}
              <div className="w-full bg-pink-50 rounded-xl p-4 mb-6">
                <div className="flex justify-around">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-500">
                      {posts.length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Posts</p>
                  </div>
                  <div className="w-px bg-pink-200" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-500">
                      {posts.filter((p) => p.status === "active").length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Published</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="w-full text-left mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    About Me
                  </h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-pink-400 hover:text-pink-600 transition"
                    >
                      ✏️ Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      maxLength={500}
                      placeholder="Tell the world about yourself..."
                      className="w-full border border-pink-200 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleSaveBio}
                        disabled={saving}
                        className="flex-1 bg-pink-400 hover:bg-pink-500 text-white text-sm font-semibold py-2 rounded-full transition"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setBio(profile?.bio || "");
                        }}
                        className="flex-1 bg-pink-50 hover:bg-pink-100 text-pink-400 text-sm font-semibold py-2 rounded-full transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {profile?.bio || (
                      <span className="text-pink-300 italic">
                        No bio yet — tell us about yourself! ✨
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Write button */}
              <Link to="/add-post" className="w-full">
                <button className="w-full bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2.5 rounded-full transition">
                  ✍️ Write a Post
                </button>
              </Link>
            </div>
          </div>

          {/* ── RIGHT — Posts Grid ── */}
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold text-[#374151] mb-6">
              My Posts
              <span className="ml-2 text-base text-pink-400 font-normal">
                ({posts.length})
              </span>
            </h2>

            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-[0_8px_32px_rgba(255,182,193,0.2)]">
                <p className="text-gray-400 text-lg mb-2">No posts yet 🌸</p>
                <p className="text-gray-300 text-sm">
                  Start writing your first story!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {posts.map((post) => {
                  const imageUrl = post.featuredImage
                    ? appwriteService.getFilePreview(post.featuredImage)
                    : import.meta.env.BASE_URL + "blog.jpg";

                  return (
                    <Link to={`/post/${post.$id}`} key={post.$id}>
                      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(255,182,193,0.25)] hover:shadow-[0_8px_32px_rgba(255,182,193,0.4)] transition-all duration-300 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={post.title}
                          className="w-full h-44 object-cover"
                          onError={(e) => {
                            e.target.src =
                              import.meta.env.BASE_URL + "blog.jpg";
                          }}
                        />
                        <div className="p-4">
                          <h3 className="font-bold text-[#374151] mb-1 line-clamp-2">
                            {post.title}
                          </h3>
                          <div className="flex items-center justify-between mt-3">
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                post.status === "active"
                                  ? "bg-green-50 text-green-500"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {post.status === "active"
                                ? "✅ Published"
                                : "⏸ Draft"}
                            </span>
                            <Link
                              to={`/edit-post/${post.$id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-pink-400 hover:text-pink-600 transition"
                            >
                              ✏️ Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
