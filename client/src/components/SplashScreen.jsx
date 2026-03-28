import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade-out after 2.6s, then call onFinish after the fade (400ms) making it 3s total
    const fadeTimer = setTimeout(() => setFadeOut(true), 2600);
    const doneTimer = setTimeout(() => onFinish(), 3000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-400 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl" />
      </div>

      {/* Logo & Name */}
      <div className="relative flex flex-col items-center gap-6 animate-[fadeInUp_0.7s_ease_forwards]">
        {/* Icon with glow ring */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-indigo-500/30 blur-2xl scale-150" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 animate-[bounceSlow_1.5s_ease_infinite]">
            <MessageCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* App name */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 tracking-tight">
            IndiChat
          </h1>
          <p className="mt-2 text-slate-400 text-lg tracking-widest uppercase font-medium">
            Real-Time Encrypted Chat
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 animate-[fadeInUp_1.2s_ease_forwards] text-slate-500 text-sm font-medium tracking-wide flex items-center gap-2 opacity-80 backdrop-blur-sm bg-slate-900/30 px-4 py-2 rounded-full border border-slate-700/50">
         Created and Maintained by Muninder Meena ❤️
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
