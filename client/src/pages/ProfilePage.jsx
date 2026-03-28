import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Trash2 } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, deleteAccount, isDeletingProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(authUser?.bio || "");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedImg(reader.result);
    };
  };

  const handleSave = async () => {
    if (!selectedImg) return;
    await updateProfile({ profilePic: selectedImg });
    setSelectedImg(null);
  };

  const handleSaveBio = async () => {
    if (bioInput === authUser.bio) {
        setIsEditingBio(false);
        return;
    }
    await updateProfile({ bio: bioInput.trim() });
    setIsEditingBio(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to remove your profile picture?")) {
      await updateProfile({ profilePic: "" });
      setSelectedImg(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("DANGER: Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      await deleteAccount();
    }
  };

  return (
    <div className="h-screen pt-20 bg-slate-950 overflow-auto">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="glassmorphism rounded-3xl p-8 space-y-8 border-indigo-500/10 shadow-2xl relative">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-100">Profile</h1>
            <p className="mt-2 text-slate-400">Your personal information</p>
          </div>

          {/* Avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.svg"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 border-slate-800 shadow-xl group-hover:border-indigo-500/50 transition-all duration-300"
              />
              <div className="absolute bottom-0 right-0 flex gap-2 translate-x-1/4 translate-y-1/4">
                <label
                  htmlFor="avatar-upload"
                  className={`
                    bg-indigo-500 hover:bg-indigo-400
                    p-2.5 rounded-full cursor-pointer 
                    transition-all duration-200
                    shadow-lg inline-flex items-center justify-center
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                  `}
                >
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
                
                {(selectedImg || authUser.profilePic) && (
                  <button
                    onClick={handleDelete}
                    disabled={isUpdatingProfile}
                    className={`
                      bg-red-500 hover:bg-red-400
                      p-2.5 rounded-full cursor-pointer 
                      transition-all duration-200
                      shadow-lg flex items-center justify-center
                      ${isUpdatingProfile ? "opacity-50 pointer-events-none" : ""}
                    `}
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-sm text-slate-500">
              {isUpdatingProfile ? "Updating..." : "Click the icons to update or remove your photo"}
            </p>

            {selectedImg && !isUpdatingProfile && (
                <button
                    onClick={handleSave}
                    className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-8 rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                >
                    Save Changes
                </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-slate-900/50 rounded-xl border border-slate-700/50 text-slate-200">
                {authUser?.username}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-slate-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-slate-900/50 rounded-xl border border-slate-700/50 text-slate-200">
                {authUser?.email}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400 flex items-center gap-2">
                    <User className="w-4 h-4" /> {/* Or another icon like Quote */}
                    Bio
                </div>
                {!isEditingBio && (
                    <button 
                        onClick={() => setIsEditingBio(true)}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                    >
                        Edit
                    </button>
                )}
              </div>
              {isEditingBio ? (
                  <div className="flex gap-2">
                      <input 
                          type="text"
                          value={bioInput}
                          onChange={(e) => setBioInput(e.target.value)}
                          className="flex-1 px-4 py-2.5 bg-slate-900 focus:bg-slate-800 rounded-xl border border-indigo-500/50 text-slate-200 outline-none transition-colors w-full"
                          maxLength={100}
                          autoFocus
                          onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveBio();
                              if (e.key === 'Escape') {
                                  setIsEditingBio(false);
                                  setBioInput(authUser.bio || "");
                              }
                          }}
                      />
                      <button 
                          onClick={handleSaveBio}
                          disabled={isUpdatingProfile}
                          className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors font-medium disabled:opacity-50"
                      >
                          Save
                      </button>
                  </div>
              ) : (
                  <p className="px-4 py-2.5 bg-slate-900/50 rounded-xl border border-slate-700/50 text-slate-200 break-words">
                      {authUser?.bio}
                  </p>
              )}
            </div>
          </div>

          <div className="mt-6 bg-slate-900/40 rounded-2xl p-6 border border-indigo-500/5">
            <h2 className="text-lg font-medium text-slate-200 mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Member Since</span>
                <span className="text-slate-200">{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400">Account Status</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800/50">
            <h2 className="text-lg font-medium text-red-400 mb-4">Danger Zone</h2>
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-slate-200 font-medium">Delete Account</h3>
                    <p className="text-sm text-slate-400 mt-1">Permanently delete your profile and all data. You can recreate an account with the same email later.</p>
                </div>
                <button
                    onClick={handleDeleteAccount}
                    disabled={isDeletingProfile}
                    className="whitespace-nowrap bg-red-500 hover:bg-red-400 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                    <Trash2 className="size-4" />
                    {isDeletingProfile ? "Deleting..." : "Delete Profile"}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
