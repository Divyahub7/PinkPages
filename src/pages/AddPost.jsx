import React from "react";
import { Container, PostForm } from "../components";
import { Helmet } from "react-helmet-async";

function AddPost() {
  return (
    <div className="py-8">
      <Helmet>
        <title>Add Post | PinkPages</title>
      </Helmet>
      <Container>
        <PostForm />
      </Container>
    </div>
  );
}

export default AddPost;
