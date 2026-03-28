import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { Check, CheckCheck, MoreVertical, Pencil, Trash2, X } from "lucide-react";
import { decryptMessage } from "../lib/encryption";

const MessageActions = ({ message, onEdit, onDelete, onClose }) => (
  <div className="absolute z-20 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 w-36 text-sm"
       style={{ top: "-4px", right: "100%", marginRight: "6px" }}>
    <button
      onClick={() => { onEdit(message); onClose(); }}
      className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-slate-700 transition-colors"
    >
      <Pencil className="size-3.5 text-indigo-400" /> Edit
    </button>
    <button
      onClick={() => { onDelete(message._id); onClose(); }}
      className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-slate-700 transition-colors"
    >
      <Trash2 className="size-3.5" /> Delete
    </button>
  </div>
);

const EditModal = ({ message, onSave, onCancel }) => {
  const [value, setValue] = useState(decryptMessage(message.text));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-100 font-semibold text-lg">Edit Message</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-200">
            <X className="size-5" />
          </button>
        </div>
        <textarea
          className="w-full bg-slate-900 text-slate-100 border border-slate-600 rounded-xl p-3 resize-none outline-none focus:ring-1 focus:ring-indigo-500"
          rows={3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">Cancel</button>
          <button
            onClick={() => onSave(value)}
            disabled={!value.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatContainer = () => {
  const { 
    messages, 
    getMessages, 
    isMessagesLoading, 
    selectedUser, 
    subscribeToMessages, 
    unsubscribeFromMessages,
    isTyping,
    editMessage,
    deleteMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [activeMenu, setActiveMenu] = useState(null); // message._id
  const [editingMessage, setEditingMessage] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Close menu on outside click
  useEffect(() => {
    const handle = () => setActiveMenu(null);
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, []);

  const handleEdit = (message) => setEditingMessage(message);
  const handleDelete = (messageId) => deleteMessage(messageId);
  const handleSaveEdit = (newText) => {
    editMessage(editingMessage._id, newText);
    setEditingMessage(null);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-slate-950/50">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => {
          const isMine = message.senderId === authUser._id;
          return (
            <div
              key={message._id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[70%] group ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                {!isMine && (
                  <div className="size-8 rounded-full border border-slate-800 overflow-hidden mb-1 flex-shrink-0">
                    <img src={selectedUser.profilePic || "/avatar.svg"} alt="profile pic" />
                  </div>
                )}

                <div className="relative">
                  {/* ⋮ More options button — only for own messages */}
                  {isMine && !message.isDeleted && (
                    <button
                      className="absolute -left-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-slate-300 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === message._id ? null : message._id);
                      }}
                      title="Message options"
                    >
                      <MoreVertical className="size-4" />
                    </button>
                  )}

                  {/* Dropdown menu */}
                  {activeMenu === message._id && (
                    <MessageActions
                      message={message}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onClose={() => setActiveMenu(null)}
                    />
                  )}

                  <div
                    className={`rounded-2xl p-3 px-4 shadow-md relative ${
                      message.senderId === authUser._id
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-slate-800 text-slate-200 rounded-bl-none"
                    }`}
                  >
                    {message.isDeleted ? (
                      <p className="text-[14px] italic opacity-50">🚫 This message was deleted</p>
                    ) : (
                      <>
                        {message.image && (
                          <img
                            src={message.image}
                            alt="Attachment"
                            className="sm:max-w-[200px] rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                          />
                        )}
                        {message.text && (
                          <p className="text-[15px] leading-relaxed break-words">
                            {decryptMessage(message.text)}
                          </p>
                        )}
                        {message.isEdited && (
                          <span className="text-[10px] opacity-50 italic"> (edited)</span>
                        )}
                      </>
                    )}

                    <div className={`flex items-center gap-1 mt-1 justify-end ${
                        message.senderId === authUser._id ? "text-indigo-200" : "text-slate-500"
                    }`}>
                      <span className="text-[10px] opacity-70">{formatMessageTime(message.createdAt)}</span>
                      {isMine && !message.isDeleted && (
                        <span className="ml-1">
                          {message.status === 'seen' ? (
                            <CheckCheck className="size-3 text-cyan-300" />
                          ) : message.status === 'delivered' ? (
                            <CheckCheck className="size-3" />
                          ) : (
                            <Check className="size-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2">
              <div className="size-8 rounded-full border border-slate-800 overflow-hidden mb-1 flex-shrink-0">
                <img src={selectedUser.profilePic || "/avatar.svg"} alt="profile pic" />
              </div>
              <div className="bg-slate-800 text-slate-400 p-3 px-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                <span className="size-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="size-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="size-1.5 bg-slate-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* Edit Modal */}
      {editingMessage && (
        <EditModal
          message={editingMessage}
          onSave={handleSaveEdit}
          onCancel={() => setEditingMessage(null)}
        />
      )}

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
