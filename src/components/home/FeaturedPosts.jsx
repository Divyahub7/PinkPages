import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import appwriteService from "../../appwrite/config";
import { FaArrowRight } from "react-icons/fa6";

export default function FeaturedPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    appwriteService.getPosts().then((res) => {
      if (res) setPosts(res.documents.slice(0, 3));
    });
  }, []);

  if (posts.length === 0) return null;

  const [main, ...rest] = posts;
  const defaultImage = "/blog.jpg";

  return (
    <section className="bg-[#FCF5EE] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#EE6983] text-sm font-semibold uppercase tracking-widest mb-2">
              Fresh off the page
            </p>
            <h2
              className="text-4xl font-black text-[#2d2d2d]"
              style={{ fontFamily: "Quicksand, sans-serif" }}
            >
              Latest Posts
            </h2>
          </div>
          <Link
            to="/all-posts"
            className="hidden sm:flex items-center gap-2 text-[#EE6983] hover:text-[#d45570] text-sm font-semibold transition"
          >
            View all <FaArrowRight size={12} />
          </Link>
        </div>

        {/* Magazine grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main big post */}
          <Link to={`/post/${main.$id}`} className="group">
            <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-lg">
              <img
                src={
                  main.featuredImage
                    ? appwriteService.getFilePreview(main.featuredImage)
                    : defaultImage
                }
                alt={main.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-[#FFC4C4] text-xs font-semibold uppercase tracking-widest mb-2">
                  {main.userName || "PinkPages Author"}
                </p>
                <h3 className="text-white text-2xl font-bold leading-tight">
                  {main.title}
                </h3>
              </div>
            </div>
          </Link>

          {/* Two stacked posts */}
          <div className="flex flex-col gap-6">
            {rest.map((post) => (
              <Link key={post.$id} to={`/post/${post.$id}`} className="group">
                <div className="relative h-[195px] rounded-3xl overflow-hidden shadow-md">
                  <img
                    src={
                      post.featuredImage
                        ? appwriteService.getFilePreview(post.featuredImage)
                        : defaultImage
                    }
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-[#FFC4C4] text-xs font-semibold uppercase tracking-widest mb-1">
                      {post.userName || "PinkPages Author"}
                    </p>
                    <h3 className="text-white text-lg font-bold leading-tight">
                      {post.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/all-posts"
            className="inline-flex items-center gap-2 text-[#EE6983] font-semibold text-sm"
          >
            View all posts <FaArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
