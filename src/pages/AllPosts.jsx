import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";

function AllPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await appwriteService.getPosts();
        if (res && res.documents) {
          // Map to match PostCard props
          const mappedPosts = res.documents.map((post) => ({
            $id: post.$id,
            title: post.title,
            featuredImage: post.featuredImage || null, // handle missing images
          }));
          setPosts(mappedPosts);
        }
      } catch (err) {
        console.log("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <PostCard key={post.$id} {...post} />
          ))}
        </div>
        <div className="flex justify-center mt-30">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/039/660/817/small/adorable-coquette-teddy-bear-with-pink-ribbon-bow-watercolor-illustration-png.png"
            alt="sad teddy"
            className="w-48 md:w-64 animate-pulse"
          />
        </div>

        {/* {posts.length === 0 && (
          <div className="flex flex-col items-center mt-12">
            <p className="text-gray-700 text-xl mb-4">No posts yet</p>
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/039/660/817/small/adorable-coquette-teddy-bear-with-pink-ribbon-bow-watercolor-illustration-png.png"
              alt="sad teddy"
              className="w-48 md:w-64 animate-bounce"
            />
          </div>
        )} */}
      </Container>
    </div>
  );
}

export default AllPosts;
