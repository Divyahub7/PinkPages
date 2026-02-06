// import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import appwriteService from "../appwrite/config";

function PostCard({ $id, title }) {
  const defaultImage = import.meta.env.BASE_URL + "blog.jpg";
  // const [imageUrl, setImageUrl] = useState(defaultImage);

  // fix later - ERROR
  // useEffect(() => {
  //   const fetchImage = async () => {
  //     if (featuredImage) {
  //       try {
  //         const url = await appwriteService.getFilePreview(featuredImage);
  //         setImageUrl(url);
  //       } catch (err) {
  //         console.log("Error fetching image:", err);
  //       }
  //     }
  //   };

  //   fetchImage();
  // }, [featuredImage]);

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-white rounded-2xl hover:shadow-lg shadow-md p-6 transition-shadow duration-300 border border-pink-100">
        <div className="w-full justify-center mb-4">
          <img src={defaultImage} alt={title} className="rounded-xl" />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
