import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import {
  FaHeart,
  FaFaceLaughSquint,
  FaFaceSurprise,
  FaFaceSadTear,
  FaHandsClapping,
  FaRegHeart,
  FaThumbsUp,
  FaFaceAngry,
  FaFaceFrown,
} from "react-icons/fa6";

const REACTIONS = [
  { icon: FaHeart, label: "love", color: "#e11d48" },
  { icon: FaFaceLaughSquint, label: "haha", color: "#eab308" },
  { icon: FaFaceSurprise, label: "wow", color: "#f97316" },
  { icon: FaFaceSadTear, label: "sad", color: "#3b82f6" },
  { icon: FaHandsClapping, label: "clap", color: "#a855f7" },
  { icon: FaThumbsUp, label: "ok", color: "#06b6d4" },
  { icon: FaFaceAngry, label: "what", color: "#ef4444" },
  { icon: FaFaceFrown, label: "no", color: "#64748b" },
];

export default function Reactions({ postId, align = "left" }) {
  const [reactions, setReactions] = useState([]);
  const [userReaction, setUserReaction] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const pickerRef = useRef(null);

  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchReactions = async () => {
      const res = await appwriteService.getReactions(postId);
      if (res) {
        setReactions(res.documents);
        if (userData) {
          const mine = res.documents.find((r) => r.userId === userData.$id);
          setUserReaction(mine || null);
        }
      }
    };
    fetchReactions();
  }, [postId, userData]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReaction = async (reactionLabel) => {
    if (!userData) return;
    setLoading(true);
    setShowPicker(false);

    try {
      if (userReaction) {
        if (userReaction.reaction === reactionLabel) {
          await appwriteService.deleteReaction(userReaction.$id);
          setReactions((prev) =>
            prev.filter((r) => r.$id !== userReaction.$id),
          );
          setUserReaction(null);
        } else {
          await appwriteService.updateReaction(userReaction.$id, reactionLabel);
          setReactions((prev) =>
            prev.map((r) =>
              r.$id === userReaction.$id
                ? { ...r, reaction: reactionLabel }
                : r,
            ),
          );
          setUserReaction((prev) => ({ ...prev, reaction: reactionLabel }));
        }
      } else {
        const newReaction = await appwriteService.addReaction({
          postId,
          userId: userData.$id,
          reaction: reactionLabel,
        });
        if (newReaction) {
          setReactions((prev) => [...prev, newReaction]);
          setUserReaction(newReaction);
        }
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const reactionCounts = REACTIONS.map(({ icon, label, color }) => ({
    ReactionIcon: icon,
    label,
    color,
    count: reactions.filter((r) => r.reaction === label).length,
  })).filter((r) => r.count > 0);

  const totalReactions = reactions.length;
  const userReactionData = userReaction
    ? REACTIONS.find((r) => r.label === userReaction.reaction)
    : null;

  return (
    <div
      className={`flex items-center gap-3 mt-4 mx-7 ${
        align === "right" ? "justify-end pr-2" : "justify-start pl-2"
      }`}
    >
      {/* React button + picker */}
      <div className="relative" ref={pickerRef}>
        {/* Main button */}
        <button
          onClick={() => userData && setShowPicker((prev) => !prev)}
          disabled={loading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
            ${
              userReactionData
                ? "bg-pink-50 border-pink-300"
                : "bg-white border-pink-200 text-gray-400 hover:bg-pink-50 hover:border-pink-300"
            } ${!userData ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {userReactionData ? (
            <userReactionData.icon size={16} color={userReactionData.color} />
          ) : (
            <FaRegHeart size={16} className="text-pink-300" />
          )}
          <span
            className="text-xs capitalize"
            style={{ color: userReactionData?.color || "#f9a8d4" }}
          >
            {userReactionData ? userReactionData.label : "React"}
          </span>
        </button>

        {/* Picker popup */}
        {showPicker && (
          <div
            className={`absolute bottom-10 bg-white rounded-2xl shadow-2xl border border-pink-100 px-2 py-2 flex gap-1 z-50
              ${align === "right" ? "right-0" : "left-0"}`}
          >
            {REACTIONS.map(({ icon: ReactionIcon, label, color }) => (
              <button
                key={label}
                onClick={() => handleReaction(label)}
                title={label}
                className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-150 hover:scale-110
                  ${userReaction?.reaction === label ? "bg-pink-50" : "hover:bg-gray-50"}`}
              >
                <ReactionIcon size={24} color={color} />
                <span className="text-[10px] text-gray-400 capitalize">
                  {label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reaction counts */}
      {totalReactions > 0 && (
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            {reactionCounts.map(({ ReactionIcon, label, color }) => (
              <span
                key={label}
                title={label}
                className="bg-white rounded-full border border-pink-100 w-6 h-6 flex items-center justify-center shadow-sm"
              >
                <ReactionIcon size={13} color={color} />
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-400">{totalReactions}</span>
        </div>
      )}

      {!userData && (
        <span className="text-[11px] text-gray-300">Login to react</span>
      )}
    </div>
  );
}
