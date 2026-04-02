import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
// import { Button, Input, RTE, Select } from "..";
import { Button, Input, Select } from "..";
import QuillEditor from "../QuillEditor.jsx";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const slugTransform = useCallback((value) => {
    if (!value) return "";
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z\d\s]+/g, "-")
      .replace(/\s+/g, "-");
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), {
          shouldValidate: true,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  const submit = async (data) => {
    try {
      const file = data.image?.[0];

      if (post) {
        // EDITING — image optional, keep old one if not provided
        const updatedData = {
          title: data.title,
          content: data.content,
          status: data.status,
          featuredImage: file
            ? (await appwriteService.uploadFile(file))?.$id
            : post.featuredImage,
        };
        const dbPost = await appwriteService.updatePost(post.$id, updatedData);
        if (dbPost) navigate(`/post/${dbPost.$id}`);
        return; // ← stop here, don't run create logic
      }

      // CREATING — image is required
      if (!file) {
        alert("Please select a featured image");
        return;
      }

      const uploadedFile = await appwriteService.uploadFile(file);
      if (!uploadedFile?.$id) {
        alert("File upload failed");
        return;
      }

      const dbPost = await appwriteService.createPost({
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        featuredImage: uploadedFile.$id,
        userId: userData.$id,
      });

      if (dbPost) navigate(`/post/${dbPost.$id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      {/* LEFT */}
      <div className="w-full md:w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />

        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) =>
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            })
          }
        />

        <QuillEditor
          name="content"
          control={control}
          defaultValue={post?.content || ""}
        />
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />

        {post && post.featuredImage && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          bgColor={post ? "bg-[#EE6983]" : "bg-[#EE6983]"}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
