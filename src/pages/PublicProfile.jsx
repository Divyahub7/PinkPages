import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import { FaRegUser } from "react-icons/fa6";
import { Helmet } from "react-helmet-async";

export default function PublicProfile() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [authorName, setAuthorName] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch posts by this user
      const res = await appwriteService.getPostsByUser(userId);
      if (res && res.documents.length > 0) {
        setPosts(res.documents);
        setAuthorName(res.documents[0].userName || "PinkPages Author");
      }

      // Fetch profile if exists
      const profileRes = await appwriteService.getProfile(userId);
      if (profileRes) setProfile(profileRes);

      setLoading(false);
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCF5EE]">
        <Helmet>
          <title>Public Profile | PinkPages</title>
        </Helmet>
        <p className="text-pink-300 text-sm animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "#FCF5EE" }}>
      <Container>
        <div className="max-w-5xl mx-auto">
          {/* Profile card */}
          <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(255,182,193,0.3)] p-8 mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              {profile?.avatarId ? (
                <img
                  src={appwriteService.getAvatarPreview(profile.avatarId)}
                  alt={authorName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-pink-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-pink-200 flex items-center justify-center border-4 border-pink-100">
                  <span className="text-3xl font-bold text-pink-500">
                    {authorName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-700 mb-1">
                {authorName}
              </h1>

              {profile?.bio ? (
                <p className="text-sm text-gray-500 mb-4 max-w-lg">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-sm text-gray-300 italic mb-4">No bio yet</p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-center sm:justify-start gap-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-pink-500">
                    {posts.length}
                  </p>
                  <p className="text-xs text-gray-400">Posts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Posts grid */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2 mb-6">
              <FaRegUser size={16} className="text-pink-400" />
              Posts by {authorName}
              <span className="text-sm font-normal text-pink-400">
                ({posts.length})
              </span>
            </h2>

            {posts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-pink-100">
                <p className="text-gray-400 text-sm">No posts yet 🌸</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.$id}
                    $id={post.$id}
                    title={post.title}
                    featuredImage={post.featuredImage}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Back link */}
          <div className="text-center mt-6">
            <Link
              to="/all-posts"
              className="text-pink-400 hover:text-pink-600 text-sm transition"
            >
              ← Back to All Posts
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
