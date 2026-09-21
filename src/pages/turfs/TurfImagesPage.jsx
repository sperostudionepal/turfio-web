import { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Star,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import turfService from '../../services/turfService';
import { compressImageFile } from '../../utils/imageCompressor';
import { useToast } from '../../components/common/toastContext';

export default function TurfImagesPage({ user, venue, activeTab, setActiveTab, onLogout, onSwitchToPlayer }) {
  const { showToast } = useToast();
  const [currentVenue, setCurrentVenue] = useState(venue || null);
  const [images, setImages] = useState([]);
  const [, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  const turfId = currentVenue?.id || currentVenue?._id;

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
  }, [turfId, user]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (!turfId) {
      showToast('Venue not found. Please refresh the page.', 'error');
      return;
    }

    try {
      setUploading(true);
      showToast('Compressing and uploading images...', 'info');

      const compressedFiles = await Promise.all(
        files.map((file) => compressImageFile(file, 1800, 0.82))
      );

      const updatedVenue = await turfService.uploadTurfImages(turfId, compressedFiles);
      setCurrentVenue(updatedVenue);
      setImages(Array.isArray(updatedVenue.images) ? updatedVenue.images : []);
      showToast('Images uploaded successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || err.message || 'Failed to upload images.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = async (imgUrl) => {
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

  const handleMoveImage = async (index, direction) => {
    const newImages = [...images];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    setImages(newImages);
    try {
      const updatedVenue = await turfService.reorderTurfImages(turfId, newImages);
      setCurrentVenue(updatedVenue);
      showToast('Image display order updated.', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || err.message || 'Failed to reorder images.', 'error');
      // revert
      loadVenue();
    }
  };

  const isSetupComplete = images.length >= 6;

  return (
    <div className="flex flex-col h-screen bg-[#fdfefe] text-slate-900 font-sans antialiased overflow-hidden select-none relative">
      <TopBar
        user={user}
        venue={currentVenue}
        onLogout={onLogout}
        onSwitchToPlayer={onSwitchToPlayer}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex flex-1 min-h-0 relative">
        <Sidebar
          user={user}
          venue={currentVenue}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={onLogout}
          onSwitchToPlayer={onSwitchToPlayer}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
          <div className="flex-1 overflow-y-auto space-y-6 scrollbar-thin px-6 py-6 md:px-8 md:py-8">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <ImageIcon className="text-lime-500" size={26} />
                  Turf Gallery & Venue Photos
                </h1>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  Upload high-quality images of your venue. These photos will be displayed across search listings, court details, and booking checkout.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  <span>Upload Photos</span>
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

            {/* Setup Progress Notification Banner */}
            <div className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-colors ${
              isSetupComplete
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/80 border-amber-200 text-amber-900'
            }`}>
              {isSetupComplete ? (
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-xs leading-relaxed">
                <p className="font-extrabold text-sm">
                  {isSetupComplete
                    ? 'Photo Setup Complete!'
                    : `Setup Step: Upload Venue Photos (${images.length}/6 uploaded)`}
                </p>
                <p className="mt-0.5 opacity-90">
                  {isSetupComplete
                    ? 'Your turf has sufficient high-resolution photos for player discovery and booking cards.'
                    : 'A minimum of 6 photos is compulsory (entrance, turf surface, amenities, parking, changing rooms, etc.) to satisfy the Setup Guide requirements.'}
                </p>
              </div>
            </div>

            {/* Upload Drag & Drop Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer border-2 border-dashed border-slate-200 hover:border-lime-500 rounded-3xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-all duration-200"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-lime-600 group-hover:scale-105 transition-transform">
                  <Upload size={24} />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-800">
                    Click to select or drag and drop images
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PNG, JPG, WEBP formats up to 10MB each. Automatic compression enabled.
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
                  Uploaded Venue Images ({images.length})
                </h3>
                <span className="text-xs font-medium text-slate-400">
                  The first photo serves as the primary card cover image
                </span>
              </div>

              {images.length === 0 ? (
                <div className="p-12 text-center border border-slate-100 rounded-2xl bg-white space-y-2">
                  <ImageIcon size={32} className="mx-auto text-slate-300" />
                  <p className="text-sm font-bold text-slate-600">No turf images uploaded yet.</p>
                  <p className="text-xs text-slate-400">Click the button above to upload photos of your venue.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {images.map((imgUrl, idx) => {
                    const isPrimary = idx === 0;
                    return (
                      <div
                        key={imgUrl + idx}
                        className={`group relative rounded-2xl overflow-hidden bg-white border shadow-2xs transition-all ${
                          isPrimary ? 'ring-2 ring-lime-400 border-lime-400' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="relative aspect-[4/3] bg-slate-100">
                          <img
                            src={imgUrl}
                            alt={`Venue Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {isPrimary && (
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-lime-400 text-[11px] font-extrabold">
                              <Star size={12} fill="currentColor" />
                              <span>Primary Cover</span>
                            </div>
                          )}
                        </div>

                        {/* Image Actions Bar */}
                        <div className="p-3 bg-white flex items-center justify-between gap-2 border-t border-slate-100">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveImage(idx, -1)}
                              title="Move Left / Make Cover"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                            >
                              <ArrowLeft size={15} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === images.length - 1}
                              onClick={() => handleMoveImage(idx, 1)}
                              title="Move Right"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                            >
                              <ArrowRight size={15} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteImage(imgUrl)}
                            title="Delete Image"
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
