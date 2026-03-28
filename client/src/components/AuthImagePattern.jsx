import { MessageSquare, User, Image, Video, Hash, Bell, Shield, Music, Globe } from "lucide-react";

const AuthImagePattern = ({ title, subtitle }) => {
  const icons = [
    { icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: User, color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: Image, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: Video, color: "text-rose-500", bg: "bg-rose-500/10" },
    { icon: Hash, color: "text-amber-500", bg: "bg-amber-500/10" },
    { icon: Bell, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { icon: Shield, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { icon: Music, color: "text-pink-500", bg: "bg-pink-500/10" },
    { icon: Globe, color: "text-sky-500", bg: "bg-sky-500/10" },
  ];

  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-slate-900/40 p-12 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
      <div className="max-w-md text-center relative z-10">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {icons.map((item, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl transition-all duration-500 hover:scale-105 hover:border-white/10 ${item.bg} ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            >
              <item.icon className={`size-8 ${item.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
            </div>
          ))}
        </div>
        <h2 className="text-4xl font-bold text-slate-100 mb-4 tracking-tight">
          {title}
        </h2>
        <p className="text-slate-400 text-lg">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
