import { useState, useRef, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Camera,
  Check,
  Loader2,
  Calendar,
  MapPin,
  AtSign,
  Footprints,
  Users,
  Heart,
} from 'lucide-react';

import { useToast } from '../../../shared/components/common/toastContext';
import useWishlistStore from '../../../shared/store/useWishlistStore';

export default function ProfileInfoCard({
  user,
  onUpdateProfile,
  onUploadAvatar,
}) {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const savedTurfsCount = useWishlistStore(
    (state) => state.items.length
  );

  const [activeField, setActiveField] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imgError, setImgError] = useState(false);

  const formatDob = (dobStr) => {
    if (!dobStr) return '';
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
    if (!user) return;

    const next = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      phone: user.phone || '',
      dob: formatDob(user.dateOfBirth),
      gender: user.gender || 'Male',
      city: user.city || 'Kathmandu',
      preferredFoot: user.preferredFoot || 'Right',
    };

    setFormData(next);
    setInitialFormData(next);
    setActiveField(null);
  }, [user]);

  const isValidPhone = (phone) =>
    !phone || /^[+]?\d[\d\s()./-]{6,18}$/.test(phone);

  const isValidUsername = (username) =>
    !username || /^[a-zA-Z0-9_]{3,20}$/.test(username);

  const isFormValid =
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    isValidPhone(formData.phone) &&
    isValidUsername(formData.username);

  const hasChanges =
    initialFormData &&
    JSON.stringify(formData) !==
    JSON.stringify(initialFormData);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    const allowedExtensions = /\.(jpg|jpeg|png|webp)$/i;

    if (
      !allowedTypes.includes(file.type) ||
      !allowedExtensions.test(file.name)
    ) {
      showToast(
        'Only JPG, PNG, and WebP image files are allowed.',
        'error'
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      showToast(
        'File size must be smaller than 5MB.',
        'error'
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      return;
    }

    try {
      setIsUploading(true);

      showToast(
        'Uploading profile photo...',
        'info'
      );

      const res = await onUploadAvatar(file);

      if (res.success) {
        setImgError(false);

        showToast(
          'Profile photo updated successfully!',
          'success'
        );
      } else {
        showToast(
          res.error || 'Failed to upload photo.',
          'error'
        );
      }
    } catch (err) {
      showToast(
        err.message || 'Error uploading photo.',
        'error'
      );
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid || isSaving || !hasChanges) {
      return;
    }

    try {
      setIsSaving(true);

      const res = await onUpdateProfile(formData);

      if (res.success) {
        showToast(
          'Personal information updated successfully!',
          'success'
        );

        setInitialFormData({ ...formData });
        setActiveField(null);
      } else {
        showToast(
          res.error ||
          'Failed to update profile details.',
          'error'
        );
      }
    } catch (err) {
      showToast(
        err.message || 'Error updating profile.',
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const displayName =
    [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(' ') ||
    user?.username ||
    'Turfio Player';

  const feet = [
    'Left',
    'Right',
    'Both',
  ];

  const genders = [
    'Male',
    'Female',
    'Non-binary',
    'Other',
    'Prefer not to say',
  ];

  const cities = [
    'Kathmandu',
    'Lalitpur',
    'Bhaktapur',
    'Pokhara',
    'Chitwan',
    'Butwal',
  ];

  const inputClassName = `
    w-full
    rounded-lg
    bg-slate-50
    px-4
    py-3
    text-xs
    font-medium
    text-slate-900
    transition-all
    focus:outline-none
    focus:bg-lime-50/40
    focus:ring-2
    focus:ring-lime-200
    sm:text-sm
  `;

  const iconInputClassName = `
    w-full
    rounded-lg
    bg-slate-50
    py-3
    pl-11
    pr-4
    text-xs
    font-medium
    text-slate-900
    transition-all
    focus:outline-none
    focus:bg-lime-50/40
    focus:ring-2
    focus:ring-lime-200
    sm:text-sm
  `;

  return (
    <div className="space-y-5">

      {/* =====================================================
          PROFILE OVERVIEW
      ===================================================== */}
      <div
        className="
          bg-white
          rounded-xl
          px-5
          py-5
          sm:px-6
          shadow-[0_4px_25px_rgba(0,0,0,0.08)]
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            xl:flex-row
            xl:items-center
            xl:justify-between
          "
        >

          {/* LEFT — PROFILE IDENTITY */}
          <div
            className="
              flex
              min-w-0
              items-center
              gap-4
              xl:flex-1
            "
          >

            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  bg-slate-900
                  text-2xl
                  font-black
                  text-white
                  ring-4
                  ring-slate-100
                "
              >
                {user?.profilePicture && !imgError ? (
                  <img
                    src={user.profilePicture}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-extrabold text-lime-400">
                    {displayName[0]?.toUpperCase() || 'T'}
                  </span>
                )}
              </div>

              {/* Avatar Upload */}
              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={isUploading}
                aria-label="Upload profile photo"
                className="
                  absolute
                  bottom-0
                  right-0
                  flex
                  h-7
                  w-7
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-white
                  bg-slate-900
                  text-white
                  shadow-xs
                  transition
                  hover:bg-slate-800
                  active:scale-95
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isUploading ? (
                  <Loader2
                    className="
                      h-3.5
                      w-3.5
                      animate-spin
                      text-lime-400
                    "
                  />
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

            {/* Identity Text */}
            <div className="min-w-0">
              <h2
                className="
                  truncate
                  text-xl
                  font-black
                  tracking-tight
                  text-slate-900
                  sm:text-xl
                "
              >
                {displayName}
              </h2>

              <p
                className="
                  mt-0.5
                  truncate
                  text-xs
                  font-bold
                  text-lime-600
                  sm:text-sm
                "
              >
                @{user?.username || 'player'}
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-xs
                  font-medium
                  text-slate-500
                  sm:text-sm
                "
              >
                {user?.email || ''}
              </p>
            </div>
          </div>

          {/* RIGHT — PROFILE STATS */}
          <div
            className="
              grid
              w-full
              grid-cols-2
              divide-x
              divide-slate-100
              border-t
              border-slate-100
              pt-5

              xl:w-auto
              xl:min-w-[340px]
              xl:border-l
              xl:border-t-0
              xl:pl-6
              xl:pt-0
            "
          >

            {/* Total Bookings */}
            <div
              className="
                flex
                items-center
                gap-3
                pr-5
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-lime-100
                  text-lime-700
                "
              >
                <Users className="h-5 w-5" />
              </div>

              <div>
                <p
                  className="
                    text-lg
                    font-black
                    leading-none
                    text-slate-900
                  "
                >
                  12
                </p>

                <p
                  className="
                    mt-1.5
                    whitespace-nowrap
                    text-[11px]
                    font-medium
                    text-slate-500
                  "
                >
                  Total Bookings
                </p>
              </div>
            </div>

            {/* Saved Turfs */}
            <div
              className="
                flex
                items-center
                gap-3
                pl-5
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-lime-100
                  text-lime-700
                "
              >
                <Heart className="h-5 w-5" />
              </div>

              <div>
                <p
                  className="
                    text-lg
                    font-black
                    leading-none
                    text-slate-900
                  "
                >
                  {savedTurfsCount}
                </p>

                <p
                  className="
                    mt-1.5
                    whitespace-nowrap
                    text-[11px]
                    font-medium
                    text-slate-500
                  "
                >
                  Saved Turfs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          PERSONAL INFORMATION
      ===================================================== */}
      <form
        onSubmit={handleSubmit}
        className="
          rounded-xl
          bg-white
          p-5
          shadow-[0_4px_25px_rgba(0,0,0,0.08)]
          sm:p-6
        "
      >

        {/* Header */}
        <div
          className="
            mb-5
            flex
            items-start
            justify-between
            gap-4
            border-b
            border-slate-100
            pb-4
          "
        >
          <div className="min-w-0">
            <h3
              className="
                text-base
                font-extrabold
                tracking-tight
                text-slate-900
                sm:text-lg
              "
            >
              Personal Information
            </h3>

            <p
              className="
                mt-0.5
                text-xs
                font-medium
                leading-5
                text-slate-500
              "
            >
              Manage your basic details and how others
              see you on Turfio.
            </p>
          </div>

          {/* Save only appears when changed */}
          {hasChanges && (
            <button
              type="submit"
              disabled={!isFormValid || isSaving}
              className="
                inline-flex
                shrink-0
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-lime-400
                px-4
                py-2.5
                text-xs
                font-bold
                text-slate-900
                transition-colors
                hover:bg-lime-500
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:text-sm
              "
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  <span className="hidden sm:inline">
                    Saving...
                  </span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />

                  <span className="hidden sm:inline">
                    Save Changes
                  </span>

                  <span className="sm:hidden">
                    Save
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Form Fields */}
        <div
          className="
            grid
            grid-cols-1
            gap-x-5
            gap-y-5
            sm:grid-cols-2
          "
        >

          {/* First Name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 sm:text-[13px]">
              First Name{' '}
              <span className="text-rose-500">*</span>
            </label>

            <div className="relative">
              <User
                className="
                  absolute
                  left-4
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                onFocus={() =>
                  setActiveField('firstName')
                }
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    firstName: e.target.value,
                  })
                }
                placeholder="First name"
                className={iconInputClassName}
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 sm:text-[13px]">
              Last Name{' '}
              <span className="text-rose-500">*</span>
            </label>

            <div className="relative">
              <User
                className="
                  absolute
                  left-4
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                onFocus={() =>
                  setActiveField('lastName')
                }
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lastName: e.target.value,
                  })
                }
                placeholder="Last name"
                className={iconInputClassName}
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 sm:text-[13px]">
              Player Handle / Username
            </label>

            <div className="relative">
              <AtSign
                className="
                  absolute
                  left-4
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                onFocus={() =>
                  setActiveField('username')
                }
                value={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value,
                  })
                }
                placeholder="username"
                className={iconInputClassName}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 sm:text-[13px]">
              Email Address
            </label>

            <div className="relative">
              <Mail
                className="
                  absolute
                  left-4
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="
                  w-full
                  cursor-not-allowed
                  rounded-lg
                  bg-slate-50
                  py-3
                  pl-11
                  pr-4
                  text-xs
                  font-medium
                  text-slate-500
                  sm:text-sm
                "
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 sm:text-[13px]">
              Phone Number
            </label>

            <div className="relative">
              <Phone
                className="
                  absolute
                  left-4
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="tel"
                value={formData.phone}
                onFocus={() =>
                  setActiveField('phone')
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
                placeholder="Add phone number"
                className={iconInputClassName}
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 sm:text-[13px]">
              Gender
            </label>

            <select
              onFocus={() =>
                setActiveField('gender')
              }
              value={formData.gender}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gender: e.target.value,
                })
              }
              className={`${inputClassName} cursor-pointer`}
            >
              {genders.map((gender) => (
                <option
                  key={gender}
                  value={gender}
                >
                  {gender}
                </option>
              ))}
            </select>
          </div>

          {/* DOB */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 sm:text-[13px]">
              Date of Birth
            </label>

            <div className="relative">
              <Calendar
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="date"
                onFocus={() =>
                  setActiveField('dob')
                }
                value={formData.dob}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dob: e.target.value,
                  })
                }
                className={iconInputClassName}
              />
            </div>
          </div>

          {/* Preferred Foot */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 sm:text-[13px]">
              Preferred Foot
            </label>

            <div className="relative">
              <Footprints
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <select
                onFocus={() =>
                  setActiveField('preferredFoot')
                }
                value={formData.preferredFoot}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferredFoot: e.target.value,
                  })
                }
                className={`${iconInputClassName} cursor-pointer`}
              >
                {feet.map((foot) => (
                  <option
                    key={foot}
                    value={foot}
                  >
                    {foot} Footed
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* City */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 sm:text-[13px]">
              City / Location
            </label>

            <div className="relative">
              <MapPin
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <select
                onFocus={() =>
                  setActiveField('city')
                }
                value={formData.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    city: e.target.value,
                  })
                }
                className={`${iconInputClassName} cursor-pointer`}
              >
                {cities.map((city) => (
                  <option
                    key={city}
                    value={city}
                  >
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}