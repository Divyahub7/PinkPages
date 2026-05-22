import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import { FaTrash, FaRegCommentDots, FaReply } from "react-icons/fa6";
import toast from "react-hot-toast";

// ← Move AvatarCircle OUTSIDE Comments function
const AvatarCircle = ({ name, size = "w-9 h-9" }) => (
  <div
    className={`${size} rounded-full bg-pink-200 flex items-center justify-center text-pink-600 font-bold text-sm shrink-0`}
  >
    {name?.charAt(0).toUpperCase()}
  </div>
);

// ← Move CommentBubble OUTSIDE Comments function
const CommentBubble = ({
  comment,
  isReply = false,
  userData,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  submitting,
  handleReplySubmit,
  handleDelete,
  getReplies,
  formatDate,
}) => {
  const replies = getReplies(comment.$id);

  return (
    <div className={`flex flex-col gap-3 ${isReply ? "ml-10 mt-3" : ""}`}>
      <div className="flex items-start gap-3 group">
        <AvatarCircle
          name={comment.userName}
          size={isReply ? "w-7 h-7" : "w-9 h-9"}
        />
        <div className="flex-1">
          <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 border border-pink-100 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-gray-700">
                {comment.userName}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400">
                  {formatDate(comment.$createdAt)}
                </span>
                {userData && userData.$id === comment.userId && (
                  <button
                    onClick={() => handleDelete(comment.$id)}
                    className="opacity-0 group-hover:opacity-100 transition text-gray-300 hover:text-red-400"
                    title="Delete"
                  >
                    <FaTrash size={11} />
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {comment.content}
            </p>
          </div>

          {/* Reply button */}
          {userData && !isReply && (
            <button
              onClick={() =>
                setReplyingTo(
                  replyingTo?.id === comment.$id
                    ? null
                    : { id: comment.$id, name: comment.userName },
                )
              }
              className="mt-1 ml-1 flex items-center gap-1 text-[11px] text-pink-400 hover:text-pink-600 transition"
            >
              <FaReply size={10} />
              {replyingTo?.id === comment.$id ? "Cancel" : "Reply"}
            </button>
          )}

          {/* Reply input */}
          {replyingTo?.id === comment.$id && (
            <form onSubmit={handleReplySubmit} className="mt-3 ml-1">
              <div className="flex items-start gap-2">
                <AvatarCircle name={userData.name} size="w-7 h-7" />
                <div className="flex-1">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Replying to ${replyingTo.name}...`}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 bg-white text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 resize-none transition"
                  />
                  <div className="flex justify-end mt-1">
                    <button
                      type="submit"
                      disabled={submitting || !replyText.trim()}
                      className="px-4 py-1.5 bg-pink-400 hover:bg-pink-500 text-white text-xs font-medium rounded-full transition disabled:opacity-40"
                    >
                      {submitting ? "Posting..." : "Post Reply"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {replies.length > 0 && (
        <div className="ml-10 flex flex-col gap-3 border-l-2 border-pink-50 pl-4">
          {replies.map((reply) => (
            <div key={reply.$id} className="flex items-start gap-3 group">
              <AvatarCircle name={reply.userName} size="w-7 h-7" />
              <div className="flex-1 bg-white rounded-2xl rounded-tl-none px-4 py-3 border border-pink-100 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700">
                    {reply.userName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400">
                      {formatDate(reply.$createdAt)}
                    </span>
                    {userData && userData.$id === reply.userId && (
                      <button
                        onClick={() => handleDelete(reply.$id)}
                        className="opacity-0 group-hover:opacity-100 transition text-gray-300 hover:text-red-400"
                        title="Delete"
                      >
                        <FaTrash size={11} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {reply.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ← Comments function starts here
export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const res = await appwriteService.getComments(postId);
      if (res) setComments(res.documents);
      setLoading(false);
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userData) return;
    setSubmitting(true);

    const comment = await appwriteService.addComment({
      postId,
      userId: userData.$id,
      userName: userData.name,
      content: newComment.trim(),
      parentId: "",
    });

    if (comment) {
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
      toast.success("Comment posted!");
    }
    setSubmitting(false);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !userData || !replyingTo) return;
    setSubmitting(true);

    const reply = await appwriteService.addComment({
      postId,
      userId: userData.$id,
      userName: userData.name,
      content: replyText.trim(),
      parentId: replyingTo.id,
    });

    if (reply) {
      setComments((prev) => [...prev, reply]);
      setReplyText("");
      setReplyingTo(null);
      toast.success("Reply posted!");
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId) => {
    const success = await appwriteService.deleteComment(commentId);
    if (success) {
      setComments((prev) =>
        prev.filter((c) => c.$id !== commentId && c.parentId !== commentId),
      );
      toast.success("Comment deleted!");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const topLevelComments = comments.filter(
    (c) => !c.parentId || c.parentId === "",
  );
  const getReplies = (commentId) =>
    comments.filter((c) => c.parentId === commentId);

  return (
    <div className="my-10 border-t mx-5 border-pink-100 pt-8">
      <div className="flex items-center gap-2 mb-6">
        <FaRegCommentDots size={20} className="text-pink-400" />
        <h3 className="text-lg font-bold text-gray-700">
          Comments
          <span className="ml-2 text-sm font-normal text-pink-400">
            ({topLevelComments.length})
          </span>
        </h3>
      </div>

      {userData ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-start gap-3">
            <AvatarCircle name={userData.name} />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-white text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 resize-none transition"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-5 py-2 bg-pink-400 hover:bg-pink-500 text-white text-sm font-medium rounded-full transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 text-center py-4 bg-pink-50 rounded-2xl border border-pink-100">
          <p className="text-sm text-pink-400">
            Please <span className="font-semibold">login</span> to leave a
            comment 🌸
          </p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-pink-300 text-sm">
          Loading comments...
        </div>
      ) : topLevelComments.length === 0 ? (
        <div className="text-center py-10">
          <FaRegCommentDots size={32} className="text-pink-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            No comments yet — be the first! 🌸
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {topLevelComments.map((comment) => (
            <CommentBubble
              key={comment.$id}
              comment={comment}
              userData={userData}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              submitting={submitting}
              handleReplySubmit={handleReplySubmit}
              handleDelete={handleDelete}
              getReplies={getReplies}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
