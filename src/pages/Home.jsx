import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import Hero from "../components/Hero";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    appwriteService.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
    });
  }, []);

  if (posts.length === 0) {
    return (
      <>
        <Hero />
        <div className="w-full py-8 h-[70vh] mt-4 text-center flex flex-col">
          <Container>
            <div className="mb-8">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                Login to read posts
              </h1>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/039/660/817/small/adorable-coquette-teddy-bear-with-pink-ribbon-bow-watercolor-illustration-png.png"
                alt="sad teddy"
                className="w-48 md:w-64"
              />
            </div>
          </Container>
        </div>
      </>
    );
  }
  return (
    <>
      <Hero />

      <div className="w-full py-12 flex flex-col">
        <Container className="flex flex-col">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Latest Posts
            </h2>
            <p className="text-gray-700 mt-2">
              Explore the newest stories and insights from our blog
            </p>
          </div>

          {/* Posts grid */}
          <div className="flex flex-wrap -m-2">
            {posts.map((post) => (
              <div key={post.$id} className="p-2 w-1/4">
                <PostCard {...post} />
              </div>
            ))}
          </div>

          {/* Teddy below posts */}
          <div className="mt-12 flex items-center justify-center">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/039/660/817/small/adorable-coquette-teddy-bear-with-pink-ribbon-bow-watercolor-illustration-png.png"
              alt="sad teddy"
              className="w-48 md:w-64 animate-pulse"
            />
          </div>
        </Container>
      </div>
    </>
  );
}

export default Home;
