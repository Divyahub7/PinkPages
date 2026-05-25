import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";

// Skeleton card component
const SkeletonCard = () => (
  <div className="w-full bg-white rounded-2xl shadow-md border border-pink-100 p-6 animate-pulse">
    <div className="w-full h-48 bg-pink-100 rounded-xl mb-4" />
    <div className="h-4 bg-pink-100 rounded-full w-3/4 mb-2" />
    <div className="h-3 bg-pink-50 rounded-full w-1/2" />
  </div>
);

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await appwriteService.getPosts();
        if (res && res.documents) {
          const mappedPosts = res.documents.map((post) => ({
            $id: post.$id,
            title: post.title,
            featuredImage: post.featuredImage || null,
            userName: post.userName || "",
          }));
          setPosts(mappedPosts);
        }
      } catch (err) {
        console.log("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const query = search.toLowerCase();
    return (
      post.title?.toLowerCase().includes(query) ||
      post.userName?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full py-12">
      <Container>
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            All Posts
          </h1>
          <p className="text-gray-600 mt-2">
            Browse through all articles and stories from our blog
          </p>

          {/* Search bar */}
          <div className="mt-6 mb-20 max-w-md mx-auto relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full px-5 py-3 pr-10 rounded-full border border-pink-200 bg-white text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 shadow-sm transition"
            />
            <FaMagnifyingGlass
              className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300 hover:text-pink-500 transition"
              size={16}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
              >
                <FaXmark size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Skeleton loaders while fetching */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.$id} {...post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-m">
              No posts found for "
              <span className="text-pink-400">{search}</span>" 🌸
            </p>
          </div>
        )}

        {/* Teddy bear — always visible */}
        <div className="flex justify-center mt-30">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/039/660/817/small/adorable-coquette-teddy-bear-with-pink-ribbon-bow-watercolor-illustration-png.png"
            alt="sad teddy"
            className="w-48 md:w-64 animate-pulse"
          />
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;
