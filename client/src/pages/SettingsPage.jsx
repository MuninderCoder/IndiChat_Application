import { useEffect } from "react";
import { Moon, Sun, Shield, Bell, Palette } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const SettingsPage = () => {
  const { theme, setTheme, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, []);

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="h-screen pt-20 bg-slate-950 flex items-start justify-center p-4 overflow-auto">
      <div className="max-w-2xl w-full space-y-6">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-100">Settings</h1>
          <p className="text-slate-400 mt-2">Customize your experience</p>
        </div>

        {/* Appearance Section */}
        <div className="glassmorphism rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800/50">
            <div className="flex items-center gap-2 text-indigo-400">
              <Palette className="size-4" />
              <span className="text-sm font-semibold uppercase tracking-widest">Appearance</span>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-xl ${isDark ? "bg-slate-800" : "bg-indigo-100"} transition-colors`}>
                {isDark
                  ? <Moon className="size-5 text-indigo-400" />
                  : <Sun className="size-5 text-amber-500" />
                }
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  {isDark ? "Dark Mode" : "Light Mode"}
                </h3>
                <p className="text-sm text-slate-400 mt-0.5">
                  {isDark ? "Easier on the eyes in low light" : "Bright and clean interface"}
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={toggleTheme}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                isDark ? "bg-indigo-600" : "bg-slate-300"
              }`}
            >
              <div className={`absolute top-0.5 left-0.5 size-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                isDark
                  ? "translate-x-7 bg-white"
                  : "translate-x-0 bg-white"
              }`}>
                {isDark
                  ? <Moon className="size-3 text-indigo-600" />
                  : <Sun className="size-3 text-amber-500" />
                }
              </div>
            </button>
          </div>

          {/* Theme Preview */}
          <div className="px-6 pb-6">
            <div className={`rounded-xl border overflow-hidden transition-all duration-300 ${
              isDark
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className={`px-4 py-2 border-b text-xs font-medium ${
                isDark ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
              }`}>
                Preview
              </div>
              <div className="p-4 flex gap-3 items-end">
                <div className={`px-3 py-2 rounded-xl rounded-bl-none text-sm max-w-[60%] ${
                  isDark ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-700"
                }`}>
                  Hey! How are you? 👋
                </div>
                <div className="px-3 py-2 rounded-xl rounded-br-none text-sm text-white bg-indigo-600 max-w-[60%] ml-auto">
                  I'm great, thanks! 😊
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="glassmorphism rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800/50">
            <div className="flex items-center gap-2 text-green-400">
              <Shield className="size-4" />
              <span className="text-sm font-semibold uppercase tracking-widest">Security</span>
            </div>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-green-400/10">
                <Shield className="size-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">End-to-End Encryption</h3>
                <p className="text-sm text-slate-400 mt-0.5">All messages encrypted with AES-256</p>
              </div>
            </div>
            <span className="text-green-400 text-xs font-bold uppercase tracking-widest bg-green-400/10 px-3 py-1.5 rounded-full">Active</span>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="glassmorphism rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800/50">
            <div className="flex items-center gap-2 text-amber-400">
              <Bell className="size-4" />
              <span className="text-sm font-semibold uppercase tracking-widest">Notifications</span>
            </div>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-amber-400/10">
                <Bell className="size-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Message Notifications</h3>
                <p className="text-sm text-slate-400 mt-0.5">Get notified when you receive messages</p>
              </div>
            </div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest bg-amber-400/10 px-3 py-1.5 rounded-full">Browser</span>
          </div>
        </div>

        <div className="text-center text-xs text-slate-600 uppercase tracking-[0.2em] font-bold pb-8">
          IndiChat v1.0.0 — Real-Time Encrypted Chat
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
