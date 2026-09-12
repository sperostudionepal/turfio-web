import { useState, useRef, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Camera,
  Check,
  Edit2,
  ShieldCheck,
  Loader2,
  Calendar,
  MapPin,
  AtSign,
  Footprints,
  Users,
  Trophy,
  Heart,
  Star,
} from 'lucide-react';
import { useToast } from '../../components/common/Toast';

export default function ProfileInfoCard({ user, onUpdateProfile, onUploadAvatar, isLoading }) {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imgError, setImgError] = useState(false);

  const formatDob = (dobStr) => {
    if (!dobStr) return '2000-01-01';
    return dobStr.split('T')[0];
  };

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    phone: user?.phone || '',
    dob: formatDob(user?.dateOfBirth),
    gender: user?.gender || 'Male',
    city: user?.city || 'Kathmandu',
    preferredFoot: user?.preferredFoot || 'Right',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        phone: user.phone || '',
        dob: formatDob(user.dateOfBirth),
        gender: user.gender || 'Male',
        city: user.city || 'Kathmandu',
        preferredFoot: user.preferredFoot || 'Right',
      });
    }
  }, [user]);

  // Validation
  const isValidPhone = (phone) => !phone || /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/.test(phone);
  const isValidUsername = (username) => !username || /^[a-zA-Z0-9_]{3,20}$/.test(username);

  const isFormValid =
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    isValidPhone(formData.phone) &&
    isValidUsername(formData.username);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedExtensions = /\.(jpg|jpeg|png|webp)$/i;

    if (!allowedTypes.includes(file.type) || !allowedExtensions.test(file.name)) {
      showToast('Only JPG, PNG, and WebP image files are allowed.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      showToast('File size must be smaller than 5MB.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setIsUploading(true);
      showToast('Uploading profile photo...', 'info');
      const res = await onUploadAvatar(file);
      if (res.success) {
        showToast('Profile photo updated successfully!', 'success');
      } else {
        showToast(res.error || 'Failed to upload photo.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error uploading photo.', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSaving) return;

    try {
      setIsSaving(true);
      const res = await onUpdateProfile(formData);
      if (res.success) {
        showToast('Personal information updated successfully!', 'success');
        setIsEditing(false);
      } else {
        showToast(res.error || 'Failed to update profile details.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error updating profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Saugat Shahi Personal';
  const feet = ['Left', 'Right', 'Both'];
  const genders = ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'];
  const cities = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Butwal'];

  return (
    <div className="space-y-6">
      {/* 1. Header Profile Banner Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.08)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Avatar Circle with Camera Overlay */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-slate-900 ring-4 ring-slate-100 text-white font-black text-2xl flex items-center justify-center overflow-hidden">
                {user?.profilePicture && !imgError ? (
                  <img
                    src={user.profilePicture}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lime-400 font-extrabold text-2xl">{displayName[0]?.toUpperCase() || 'S'}</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                aria-label="Upload photo"
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs border-2 border-white"
              >
                {isUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-lime-400" />
                ) : (
                  <Camera className="h-3.5 w-3.5" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* Profile Info Text */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{displayName}</h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-lime-800 bg-lime-100 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="h-3 w-3 text-lime-700" />
                  Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-lime-600 mt-0.5">@{user?.username || 'saugatshahi2083'}</p>
              <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">{user?.email || 'shahi.codespace@gmail.com'}</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 leading-snug">
                Futsal enthusiast. Always up for a good game!
              </p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
          >
            <Edit2 className="h-3.5 w-3.5" />
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Metadata Pills Row */}
        <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-100">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-50 text-xs font-medium text-slate-600">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>{formData.city || 'Kathmandu'}, Nepal</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-50 text-xs font-medium text-slate-600">
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            <span>{formData.phone || '+977 9800000000'}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-50 text-xs font-medium text-slate-600">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>01 Jan, 2000</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-50 text-xs font-medium text-slate-600">
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span>{formData.gender || 'Male'}</span>
          </div>
        </div>
      </div>

      {/* 2. Stats Summary Row Card */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.08)] grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        <div className="flex items-center gap-3.5 p-2">
          <div className="w-10 h-10 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 leading-none">12</p>
            <p className="text-[11px] font-medium text-slate-500 mt-1">Total Bookings</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-2 pt-4 sm:pt-2 sm:pl-6">
          <div className="w-10 h-10 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center shrink-0">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 leading-none">8</p>
            <p className="text-[11px] font-medium text-slate-500 mt-1">Matches Played</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-2 pt-4 sm:pt-2 sm:pl-6">
          <div className="w-10 h-10 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center shrink-0">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 leading-none">5</p>
            <p className="text-[11px] font-medium text-slate-500 mt-1">Saved Turfs</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-2 pt-4 sm:pt-2 sm:pl-6">
          <div className="w-10 h-10 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center shrink-0">
            <Star className="h-5 w-5 fill-lime-600 text-lime-600" />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 leading-none">4.8</p>
            <p className="text-[11px] font-medium text-slate-500 mt-1">Average Rating</p>
          </div>
        </div>
      </div>

      {/* 3. Personal Information Form Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.08)] space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">Personal Information</h3>
            <p className="text-xs font-medium text-slate-500">Manage your basic details and how others see you on Turfio.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Edit2 className="h-3.5 w-3.5" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* First Name */}
            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
                First Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Saugat Shahi"
                  className={`w-full rounded-2xl bg-slate-50 pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-slate-900 transition-all ${
                    !isEditing ? 'opacity-80 cursor-not-allowed' : 'focus:outline-none focus:bg-slate-100/80'
                  }`}
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Personal"
                  className={`w-full rounded-2xl bg-slate-50 pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-slate-900 transition-all ${
                    !isEditing ? 'opacity-80 cursor-not-allowed' : 'focus:outline-none focus:bg-slate-100/80'
                  }`}
                />
              </div>
            </div>

            {/* Username / Handle */}
            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">Player Handle / Username</label>
              <div className="relative">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="saugatshahi2083"
                  className={`w-full rounded-2xl bg-slate-50 pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-slate-900 transition-all ${
                    !isEditing ? 'opacity-80 cursor-not-allowed' : 'focus:outline-none focus:bg-slate-100/80'
                  }`}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={user?.email || 'shahi.codespace@gmail.com'}
                  className="w-full rounded-2xl bg-slate-50 pl-11 pr-10 py-3 text-xs sm:text-sm font-medium text-slate-500 cursor-not-allowed"
                />
                <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-lime-600" />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">Gender</label>
              <select
                disabled={!isEditing}
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className={`w-full rounded-2xl bg-slate-50 px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 transition-all ${
                  !isEditing ? 'opacity-80 cursor-not-allowed' : 'focus:outline-none focus:bg-slate-100/80 cursor-pointer'
                }`}
              >
                {genders.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  disabled={!isEditing}
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className={`w-full rounded-2xl bg-slate-50 pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-slate-900 transition-all ${
                    !isEditing ? 'opacity-80 cursor-not-allowed' : 'focus:outline-none focus:bg-slate-100/80'
                  }`}
                />
              </div>
            </div>

            {/* Preferred Foot */}
            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">Preferred Foot</label>
              <div className="relative">
                <Footprints className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  disabled={!isEditing}
                  value={formData.preferredFoot}
                  onChange={(e) => setFormData({ ...formData, preferredFoot: e.target.value })}
                  className={`w-full rounded-2xl bg-slate-50 pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-slate-900 transition-all ${
                    !isEditing ? 'opacity-80 cursor-not-allowed' : 'focus:outline-none focus:bg-slate-100/80 cursor-pointer'
                  }`}
                >
                  {feet.map((f) => (
                    <option key={f} value={f}>{f} Footed</option>
                  ))}
                </select>
              </div>
            </div>

            {/* City / Location */}
            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">City / Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  disabled={!isEditing}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full rounded-2xl bg-slate-50 pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-slate-900 transition-all ${
                    !isEditing ? 'opacity-80 cursor-not-allowed' : 'focus:outline-none focus:bg-slate-100/80 cursor-pointer'
                  }`}
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action button when editing */}
          {isEditing && (
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-full bg-slate-100 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-lime-400 text-xs sm:text-sm font-bold text-slate-900 hover:bg-lime-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-slate-900" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 text-slate-900" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

