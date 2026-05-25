import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";
import Reactions from "./Reactions";

function PostCard({ $id, title, featuredImage, userName }) {
  const defaultImage = import.meta.env.BASE_URL + "blog.jpg";
  const imageUrl = featuredImage
    ? appwriteService.getFilePreview(featuredImage)
    : defaultImage;

  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden border border-pink-100 hover:shadow-lg shadow-sm transition-shadow duration-300">
      {/* Pink top strip */}
      <div className="h-1 w-full bg-pink-400" />

      {/* Clickable image + body */}
      <Link to={`/post/${$id}`} className="block">
        {/* Image with flower trademark */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-44 object-cover"
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
        </div>

        {/* Body */}
        <div className="px-4 pt-3 pb-2">
          {/* Tag */}
          <span className="inline-block bg-pink-50 text-pink-600 text-xs font-semibold px-3 py-0.5 rounded-full mb-2">
            Blog
          </span>

          {/* Title */}
          <h2 className="text-base font-bold text-gray-800 leading-snug mb-2 line-clamp-2">
            {title}
          </h2>

          {/* Author + read */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {userName ? `by ${userName}` : "PinkPages Author"}
            </span>
            <span className="text-xs text-pink-400 font-medium">🌸 Read</span>
          </div>
        </div>
      </Link>

      {/* Reactions — left aligned */}
      <div className="px-4 pb-3 border-t border-pink-50 pt-2">
        <Reactions postId={$id} align="left" />
      </div>
    </div>
  );
}

export default PostCard;
