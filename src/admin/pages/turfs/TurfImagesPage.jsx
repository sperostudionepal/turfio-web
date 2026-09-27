import { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  Upload,
  ImagePlus,
  Trash2,
  Star,
  MoreVertical,
  Loader2,
  Images,
  CheckCircle2,
} from 'lucide-react';
import turfService from '../../../shared/services/turfService';
import { compressImageFile } from '../../../shared/utils/imageCompressor';
import { useToast } from '../../../shared/components/common/toastContext';

const MIN_REQUIRED_IMAGES = 6;

export default function TurfImagesPage({ user, venue, activeTab, setActiveTab, onLogout }) {
  const { showToast } = useToast();
  const [currentVenue, setCurrentVenue] = useState(venue || null);
  const [images, setImages] = useState([]);
  const [, setLoading] = useState(false);
  const [uploadPhase, setUploadPhase] = useState('idle'); // 'idle' | 'uploading' | 'success'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  const turfId = currentVenue?.id || currentVenue?._id;
  const uploading = uploadPhase === 'uploading';

  const loadVenue = async () => {
    if (!turfId && user) {
      const userId = user._id || user.id;
      try {
        setLoading(true);
        const turfs = await turfService.getTurfs({ owner: userId, limit: 1 });
        if (turfs && turfs[0]) {
          setCurrentVenue(turfs[0]);
          setImages(Array.isArray(turfs[0].images) ? turfs[0].images : []);
        }
      } catch {
        showToast('Failed to load venue details.', 'error');
      } finally {
        setLoading(false);
      }
    } else if (currentVenue) {
      setImages(Array.isArray(currentVenue.images) ? currentVenue.images : []);
    }
  };

  useEffect(() => {
    loadVenue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turfId, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const uploadFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    if (!turfId) {
      showToast('Venue not found. Please refresh the page.', 'error');
      return;
    }

    try {
      setUploadPhase('uploading');

      const compressedFiles = await Promise.all(
        files.map((file) => compressImageFile(file, 1800, 0.82))
      );

      const updatedVenue = await turfService.uploadTurfImages(turfId, compressedFiles);
      setCurrentVenue(updatedVenue);
      setImages(Array.isArray(updatedVenue.images) ? updatedVenue.images : []);

      setUploadPhase('success');
      showToast('Images uploaded successfully!', 'success');
      setTimeout(() => setUploadPhase('idle'), 1600);
    } catch (err) {
      setUploadPhase('idle');
      showToast(err.response?.data?.error || err.message || 'Failed to upload images.', 'error');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e) => uploadFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    uploadFiles(e.dataTransfer.files);
  };

  const handleDeleteImage = async (imgUrl) => {
    setOpenMenuIndex(null);
    if (!window.confirm('Are you sure you want to remove this photo?')) return;
    try {
      setLoading(true);
      const updatedVenue = await turfService.deleteTurfImage(turfId, imgUrl);
      setCurrentVenue(updatedVenue);
      setImages(Array.isArray(updatedVenue.images) ? updatedVenue.images : []);
      showToast('Image deleted successfully.', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || err.message || 'Failed to delete image.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSetCover = async (index) => {
    setOpenMenuIndex(null);
    if (index === 0) return;

    const newImages = [...images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);

    setImages(newImages);
    try {
      const updatedVenue = await turfService.reorderTurfImages(turfId, newImages);
      setCurrentVenue(updatedVenue);
      showToast('Cover photo updated.', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || err.message || 'Failed to set cover photo.', 'error');
      // revert
      loadVenue();
    }
  };

  const isSetupComplete = images.length >= MIN_REQUIRED_IMAGES;

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#fdfefe] font-sans text-slate-900 antialiased select-none">
      <style>{`
        @keyframes upload-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .upload-sweep {
          animation: upload-sweep 1.1s ease-in-out infinite;
        }
        @keyframes pop-in {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pop-in {
          animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
      `}</style>

      <TopBar
        user={user}
        venue={currentVenue}
        onLogout={onLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="relative flex min-h-0 flex-1">
        <Sidebar
          user={user}
          venue={currentVenue}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={onLogout}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="scrollbar-thin flex-1 overflow-y-auto">
            <div className="mx-auto w-full space-y-6 px-5 py-6 md:px-6 md:py-7 xl:px-7">
              {/* Header */}
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div className="min-w-0">
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    Turf Gallery &amp; Venue Photos
                  </h1>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Upload high-quality images of your venue. These photos will be displayed across search listings,
                    court details, and booking checkout.
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-lime-400 px-5 py-3 text-xs font-bold text-slate-900 transition-colors hover:bg-lime-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    Upload Photos
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!uploading) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative overflow-hidden rounded-xl border border-dashed p-10 text-center transition-colors ${uploading ? 'cursor-default' : 'group cursor-pointer'
                  } ${isDragging
                    ? 'border-lime-400 bg-lime-50/60'
                    : uploadPhase === 'success'
                      ? 'border-lime-300 bg-lime-50/40'
                      : 'border-slate-200 bg-white hover:border-lime-300 hover:bg-lime-50/30'
                  }`}
              >
                {/* Progress sweep while uploading */}
                {uploading && (
                  <div className="absolute inset-x-0 top-0 h-1 overflow-hidden bg-lime-100">
                    <div className="upload-sweep h-full w-1/3 bg-lime-400" />
                  </div>
                )}

                <div className="relative flex flex-col items-center gap-4">
                  <div
                    className={`relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-[0_3px_18px_rgba(15,23,42,0.04)] transition-all duration-300 ${uploadPhase === 'success'
                      ? 'bg-lime-400 text-slate-900'
                      : 'bg-lime-50 text-lime-600'
                      } ${!uploading && uploadPhase !== 'success' ? 'group-hover:scale-105' : ''}`}
                  >
                    {uploading && (
                      <span className="absolute inset-0 animate-ping rounded-2xl bg-lime-300/60" />
                    )}
                    <span className="relative">
                      {uploadPhase === 'success' ? (
                        <CheckCircle2 size={26} className="pop-in" />
                      ) : uploading ? (
                        <Loader2 size={26} className="animate-spin" />
                      ) : (
                        <ImagePlus
                          size={26}
                          className={`transition-transform duration-300 ${isDragging ? '-translate-y-1 scale-110' : ''}`}
                        />
                      )}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-slate-800">
                      {uploadPhase === 'success'
                        ? 'Photos uploaded!'
                        : uploading
                          ? 'Uploading your photos…'
                          : 'Drag and drop photos here'}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {uploadPhase === 'success' ? (
                        'Your gallery has been updated.'
                      ) : uploading ? (
                        'Compressing and saving to your gallery.'
                      ) : (
                        <>
                          or <span className="font-bold text-lime-600">click to browse</span> — PNG, JPG, WEBP up to
                          10MB each
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div className="min-w-0">
                <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
                    Venue Photos
                    <span className="ml-1.5 font-semibold text-slate-400">
                      ({images.length}{!isSetupComplete && ` / ${MIN_REQUIRED_IMAGES} min`})
                    </span>
                  </h3>
                  <span className="text-[11px] font-medium text-slate-400">
                    The cover photo appears first on search listings and booking cards.
                  </span>
                </div>

                {images.length === 0 ? (
                  <div className="space-y-2 rounded-xl border border-slate-100 bg-white px-4 py-16 text-center">
                    <Images size={30} className="mx-auto text-slate-300" />
                    <p className="text-sm font-bold text-slate-700">No turf images uploaded yet.</p>
                    <p className="text-xs text-slate-400">Drag photos into the dropzone above or click to upload.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {images.map((imgUrl, idx) => {
                      const isPrimary = idx === 0;
                      const isMenuOpen = openMenuIndex === idx;
                      return (
                        <div
                          key={imgUrl + idx}
                          className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 shadow-[0_3px_18px_rgba(15,23,42,0.04)] ring-1 ring-slate-100 transition-shadow hover:shadow-[0_8px_28px_rgba(15,23,42,0.08)]"
                        >
                          <img
                            src={imgUrl}
                            alt={`Venue Photo ${idx + 1}`}
                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                          />

                          {/* Subtle top gradient for badge/menu legibility */}
                          <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-slate-950/50 to-transparent" />

                          {isPrimary && (
                            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-lime-400 px-2 py-1 text-[10px] font-extrabold text-slate-900 shadow-sm">
                              <Star size={11} fill="currentColor" />
                              Cover
                            </div>
                          )}

                          {/* Actions menu trigger */}
                          <div className="absolute right-2 top-2" ref={isMenuOpen ? menuRef : null}>
                            <button
                              type="button"
                              onClick={() => setOpenMenuIndex(isMenuOpen ? null : idx)}
                              title="Photo options"
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-600 opacity-0 shadow-sm backdrop-blur transition-opacity hover:bg-white group-hover:opacity-100 focus:opacity-100"
                            >
                              <MoreVertical size={14} />
                            </button>

                            {isMenuOpen && (
                              <div className="absolute right-0 top-9 z-10 w-44 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.15)]">
                                <button
                                  type="button"
                                  disabled={isPrimary}
                                  onClick={() => handleSetCover(idx)}
                                  className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                                >
                                  <Star size={13} />
                                  {isPrimary ? 'Already Cover' : 'Set as Cover Photo'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteImage(imgUrl)}
                                  className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                >
                                  <Trash2 size={13} />
                                  Delete Photo
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}