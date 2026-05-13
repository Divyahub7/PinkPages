import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";
import Reactions from "./Reactions";

function PostCard({ $id, title, featuredImage }) {
  const defaultImage = import.meta.env.BASE_URL + "blog.jpg";
  const imageUrl = featuredImage
    ? appwriteService.getFilePreview(featuredImage)
    : defaultImage;

  return (
    <div className="w-full bg-white rounded-2xl hover:shadow-lg shadow-md transition-shadow duration-300 border border-pink-100">
      {/* Clickable part */}
      <Link to={`/post/${$id}`} className="block p-6 pb-2">
        <div className="w-full justify-center mb-4">
          <img
            src={imageUrl}
            alt={title}
            className="rounded-xl w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </Link>

      {/* Reactions outside the Link */}
      <div className="px-6 pb-4">
        <Reactions postId={$id} align="right" />
      </div>
    </div>
  );
}

export default PostCard;
