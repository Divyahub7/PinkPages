import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

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
    <div className="py-8">
      <Container>
        <div
          className="w-full mb-6 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(255,182,193,0.4)]
 shadow-md h-"
        >
          {/* // UPDATE LATER WITH THE REAL IMAGE */}
          {/* <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="rounded-xl"
          /> */}
          <img
            src="/blogpost.jpg"
            alt={post.title}
            className="w-full max-h-[300px] object-cover rounded-xl"
          />
        </div>
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>
        <div className="browser-css">{parse(post.content)}</div>
        {isAuthor && (
          <div className="absolute right-20 top-6s">
            <Link to={`/edit-post/${post.$id}`}>
              <Button className="mr-3">Edit</Button>
            </Link>
            <Button onClick={deletePost}>Delete</Button>
          </div>
        )}
      </Container>
    </div>
  ) : null;
}
