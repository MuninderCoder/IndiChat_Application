import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile } from "lucide-react";
import toast from "react-hot-toast";

// Categorized emoji picker
const EMOJI_CATEGORIES = {
  "😊 Smileys": ["😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚","😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🥸","🤩","🥳"],
  "👍 Gestures": ["👍","👎","👋","🤚","🖐","✋","🤙","💪","🦾","🖖","🤞","✌️","🤟","🤘","👌","🤌","🤏","🫰","🫵","🫶","❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","💕","💞"],
  "🐶 Animals": ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐔","🐧","🐦","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🦋","🐛"],
  "🍕 Food": ["🍕","🍔","🌮","🌯","🥗","🍜","🍣","🍱","🍛","🍲","🥘","🍗","🍖","🌭","🍟","🧆","🥙","🥪","🍠","🥚","🍳","🥞","🧇","🍞","🥨","🥐","🧀","🥓","🥩","🍷","🍸","🍺"],
  "⚽ Sports": ["⚽","🏀","🏈","⚾","🎾","🏐","🏉","🥏","🎱","🏓","🏸","🥅","🏒","🏑","🏏","🪃","⛳","🎣","🤿","🎯","🎽","🎿","🛷","🥌","🎮","🕹️","🎲","🃏","🎰","🎭","🎬","🎤"],
};

const EmojiPicker = ({ onSelect }) => {
  const [activeTab, setActiveTab] = useState(Object.keys(EMOJI_CATEGORIES)[0]);
  return (
    <div className="absolute bottom-16 left-0 z-50 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-72 overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-slate-700 overflow-x-auto">
        {Object.keys(EMOJI_CATEGORIES).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-3 py-2 text-sm whitespace-nowrap transition-colors ${
              activeTab === cat ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {cat.split(" ")[0]}
          </button>
        ))}
      </div>
      {/* Emoji grid */}
      <div className="p-2 grid grid-cols-8 gap-1 max-h-48 overflow-y-auto custom-scrollbar">
        {EMOJI_CATEGORIES[activeTab].map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="text-xl hover:bg-slate-700 rounded-lg p-1 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage, sendTypingStatus } = useChatStore();

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest("#emoji-picker-container")) setShowEmojiPicker(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleInputChange = (e) => {
    setText(e.target.value);
    sendTypingStatus(true);
    if (window.typingTimeout) clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      sendTypingStatus(false);
    }, 2000);
  };

  const handleEmojiSelect = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (window.typingTimeout) clearTimeout(window.typingTimeout);
    sendTypingStatus(false);
    try {
      await sendMessage({ text: text.trim(), image: imagePreview });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full bg-slate-900/20">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-slate-800/50 border border-indigo-500/10 rounded-2xl px-4 py-2 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all relative">
          {/* Emoji Picker */}
          <div id="emoji-picker-container" className="relative">
            <button
              type="button"
              className={`text-slate-400 hover:text-indigo-400 p-1 transition-colors ${showEmojiPicker ? "text-indigo-400" : ""}`}
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              <Smile className="size-5" />
            </button>
            {showEmojiPicker && <EmojiPicker onSelect={handleEmojiSelect} />}
          </div>

          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-500 py-1"
            placeholder="Type a message..."
            value={text}
            onChange={handleInputChange}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`flex items-center justify-center p-1 rounded-full transition-colors ${
              imagePreview ? "text-emerald-400" : "text-slate-400 hover:text-indigo-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="size-5" />
          </button>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
          disabled={!text.trim() && !imagePreview}
        >
          <Send className="size-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
