import { useEffect, useState } from "react";
import appwriteService from "../../appwrite/config";
import { FaFeather, FaUsers, FaHeart } from "react-icons/fa6";

export default function StatsBanner() {
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    appwriteService.getPosts().then((res) => {
      if (res) setPostCount(res.total);
    });
  }, []);

  const stats = [
    { icon: FaFeather, value: postCount, label: "Posts Published" },
    { icon: FaUsers, value: "100%", label: "Free to Read" },
    { icon: FaHeart, value: "∞", label: "Stories to Tell" },
  ];

  return (
    <section className="bg-[#EE6983] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* eslint-disable-next-line */}
          {stats.map(({ icon: StatIcon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <StatIcon size={20} className="text-white" />
              </div>
              <p className="text-5xl font-black text-white">{value}</p>
              <p className="text-pink-100 text-sm font-medium uppercase tracking-widest">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
