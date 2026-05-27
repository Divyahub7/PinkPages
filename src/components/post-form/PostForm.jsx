import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
// import { Button, Input, RTE, Select } from "..";
import { Button, Input, Select } from "..";
import QuillEditor from "../QuillEditor.jsx";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import AIAssistant from "../AIAssistant.jsx";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
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
        if (dbPost) {
          toast.success("Post updated successfully!");
          navigate(`/post/${dbPost.$id}`);
        }
        return; // ← stop here, don't run create logic
      }

      // CREATING — image is required
      if (!file) {
        toast.error("Please select a featured image");
        return;
      }

      const uploadedFile = await appwriteService.uploadFile(file);
      if (!uploadedFile?.$id) {
        toast.error("File upload failed");
        return;
      }

      const dbPost = await appwriteService.createPost({
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        featuredImage: uploadedFile.$id,
        userId: userData.$id,
        userName: userData.name,
      });

      if (dbPost) {
        toast.success("Post created successfully!");
        navigate(`/post/${dbPost.$id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          accept="image/*"
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
          bgColor="bg-[#EE6983]"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              {post ? "Updating..." : "Submitting..."}
            </span>
          ) : post ? (
            "Update"
          ) : (
            "Submit"
          )}
        </Button>
      </div>
      <AIAssistant getTitle={() => watch("title")} />
    </form>
  );
}
