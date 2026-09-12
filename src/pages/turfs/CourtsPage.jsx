import { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  Plus,
  Search,
  CircleDot,
  CheckCircle2,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  X,
  Building2,
  ArrowUpRight,
  MoreHorizontal,
  Upload,
  Trash2,
} from 'lucide-react';
import turfService from '../../services/turfService';
import { useToast } from '../../components/common/Toast';

const DIMENSION_PRESETS = [
  { label: 'Standard 5v5 (25m x 15m)', value: '25m x 15m (Standard 5v5)', length: 25, width: 15, matchType: '5v5' },
  { label: 'Pro 5v5 (30m x 18m)', value: '30m x 18m (Pro 5v5)', length: 30, width: 18, matchType: '5v5' },
  { label: 'Official Futsal (40m x 20m)', value: '40m x 20m (Official Futsal)', length: 40, width: 20, matchType: '5v5' },
  { label: 'Standard 7v7 (40m x 25m)', value: '40m x 25m (Standard 7v7)', length: 40, width: 25, matchType: '7v7' },
  { label: 'Custom Dimensions', value: 'custom' },
];

const SURFACE_OPTIONS = [
  'FIFA Quality Synthetic Turf',
  'Monofilament AstroTurf',
  'All-Weather Rubber Turf',
  'Natural Grass Surface',
  'Indoor Wooden / Hardcourt',
];

function CourtsPage({ user, venue, activeTab, setActiveTab, onLogout }) {
  const { showToast } = useToast();
  const [currentVenue, setCurrentVenue] = useState(venue || null);
  const [courts, setCourts] = useState(() => (Array.isArray(venue?.courts) ? venue.courts : []));
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [selectedCourt, setSelectedCourt] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [addForm, setAddForm] = useState({
    name: '',
    dimensionPreset: '25m x 15m (Standard 5v5)',
    customLength: 25,
    customWidth: 15,
    surface: 'FIFA Quality Synthetic Turf',
    matchType: '5v5',
    hourlyRate: 1200,
    peakRate: 1500,
    status: 'Available',
    imageFile: null,
    imagePreview: '',
  });

  const [editForm, setEditForm] = useState({
    name: '',
    dimensionPreset: '25m x 15m (Standard 5v5)',
    customLength: 25,
    customWidth: 15,
    surface: 'FIFA Quality Synthetic Turf',
    matchType: '5v5',
    hourlyRate: 1200,
    peakRate: 1500,
    status: 'Available',
    imageFile: null,
    imagePreview: '',
  });

  const addFileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  useEffect(() => {
    if (venue) {
      setCurrentVenue(venue);
      if (Array.isArray(venue.courts) && venue.courts.length > 0) {
        setCourts(venue.courts);
      }
      return;
    }
    const userId = user?._id || user?.id;
    if (userId) {
      turfService.getTurfs({ owner: userId, limit: 1 }).then((turfs) => {
        if (turfs && turfs[0]) {
          setCurrentVenue(turfs[0]);
          if (Array.isArray(turfs[0].courts) && turfs[0].courts.length > 0) {
            setCourts(turfs[0].courts);
          }
        }
      }).catch(() => {});
    }
  }, [venue, user?._id, user?.id]);

  const loadCourts = async () => {
    const turfId = currentVenue?.id || currentVenue?._id || venue?.id || venue?._id;
    if (!turfId) return;
    try {
      setLoading(true);
      const data = await turfService.getCourts(turfId);
      if (Array.isArray(data) && data.length > 0) {
        setCourts(data);
      } else if (currentVenue?.courts?.length > 0) {
        setCourts(currentVenue.courts);
      } else {
        setCourts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load courts:', err);
      if (currentVenue?.courts?.length > 0) {
        setCourts(currentVenue.courts);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const turfId = currentVenue?.id || currentVenue?._id || venue?.id || venue?._id;
    if (turfId) {
      loadCourts();
    }
  }, [currentVenue?.id, currentVenue?._id, venue?.id, venue?._id]);

  const handleOpenAddModal = () => {
    const nextNum = courts.length + 1;
    setAddForm({
      name: `Court ${nextNum}`,
      dimensionPreset: '25m x 15m (Standard 5v5)',
      customLength: 25,
      customWidth: 15,
      surface: 'FIFA Quality Synthetic Turf',
      matchType: '5v5',
      hourlyRate: currentVenue?.pricePerHour || 1200,
      peakRate: Math.round((currentVenue?.pricePerHour || 1200) * 1.25),
      status: 'Available',
      imageFile: null,
      imagePreview: '',
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (court) => {
    setEditingCourt(court);
    const matchedPreset = DIMENSION_PRESETS.find((p) => p.value === court.dimension);
    setEditForm({
      name: court.name,
      dimensionPreset: matchedPreset ? court.dimension : 'custom',
      customLength: court.length || 25,
      customWidth: court.width || 15,
      surface: court.surface || 'FIFA Quality Synthetic Turf',
      matchType: court.matchType || '5v5',
      hourlyRate: court.hourlyRate || currentVenue?.pricePerHour || 1200,
      peakRate: court.peakRate || Math.round((court.hourlyRate || 1200) * 1.25),
      status: court.status || 'Available',
      imageFile: null,
      imagePreview: court.image || '',
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleAddImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAddForm((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditForm((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const turfId = currentVenue?.id || currentVenue?._id;
    if (!turfId) {
      setFormError('Venue not found. Please refresh the page.');
      return;
    }

    setFormLoading(true);
    setFormError('');

    try {
      let dimensionString = addForm.dimensionPreset;
      let len = 25;
      let wid = 15;

      if (addForm.dimensionPreset === 'custom') {
        len = Number(addForm.customLength) || 25;
        wid = Number(addForm.customWidth) || 15;
        dimensionString = `${len}m x ${wid}m (Custom)`;
      } else {
        const preset = DIMENSION_PRESETS.find((p) => p.value === addForm.dimensionPreset);
        if (preset) {
          len = preset.length;
          wid = preset.width;
        }
      }

      const courtData = {
        name: addForm.name.trim() || `Court ${courts.length + 1}`,
        dimension: dimensionString,
        length: len,
        width: wid,
        surface: addForm.surface,
        matchType: addForm.matchType,
        hourlyRate: Number(addForm.hourlyRate),
        peakRate: Number(addForm.peakRate),
        status: addForm.status,
      };

      const newCourt = await turfService.addCourt(turfId, courtData);

      if (addForm.imageFile && newCourt?._id) {
        await turfService.uploadCourtImage(turfId, newCourt._id, addForm.imageFile);
      }

      await loadCourts();
      setIsAddModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.error || err.message || 'Failed to add court');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const turfId = currentVenue?.id || currentVenue?._id;
    if (!turfId || !editingCourt?._id) return;

    setFormLoading(true);
    setFormError('');

    try {
      let dimensionString = editForm.dimensionPreset;
      let len = 25;
      let wid = 15;

      if (editForm.dimensionPreset === 'custom') {
        len = Number(editForm.customLength) || 25;
        wid = Number(editForm.customWidth) || 15;
        dimensionString = `${len}m x ${wid}m (Custom)`;
      } else {
        const preset = DIMENSION_PRESETS.find((p) => p.value === editForm.dimensionPreset);
        if (preset) {
          len = preset.length;
          wid = preset.width;
        }
      }

      const updateData = {
        name: editForm.name.trim(),
        dimension: dimensionString,
        length: len,
        width: wid,
        surface: editForm.surface,
        matchType: editForm.matchType,
        hourlyRate: Number(editForm.hourlyRate),
        peakRate: Number(editForm.peakRate),
        status: editForm.status,
        isConfigured: true,
      };

      await turfService.updateCourt(turfId, editingCourt._id, updateData);

      if (editForm.imageFile) {
        await turfService.uploadCourtImage(turfId, editingCourt._id, editForm.imageFile);
      }

      await loadCourts();
      setIsEditModalOpen(false);
      setEditingCourt(null);
    } catch (err) {
      setFormError(err.response?.data?.error || err.message || 'Failed to update court');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCourt = async (courtId, courtName) => {
    const turfId = currentVenue?.id || currentVenue?._id;
    if (!turfId) return;
    if (!window.confirm(`Are you sure you want to remove ${courtName}?`)) return;

    try {
      await turfService.deleteCourt(turfId, courtId);
      await loadCourts();
      if (selectedCourt?._id === courtId) setSelectedCourt(null);
    } catch (err) {
      showToast(err.response?.data?.error || err.message || 'Failed to delete court', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 w-fit">
            <CheckCircle2 size={13} /> Available
          </span>
        );
      case 'In Use':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 w-fit">
            <CircleDot size={13} className="animate-pulse" /> In Use
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 w-fit">
            <Wrench size={13} /> Maintenance
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 w-fit">
            {status}
          </span>
        );
    }
  };

  const filteredCourts = courts.filter((c) => {
    const matchesSearch =
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.surface || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.dimension || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableCount = courts.filter((c) => c.status === 'Available').length;
  const maintenanceCount = courts.filter((c) => c.status === 'Maintenance').length;
  const avgRate = courts.length
    ? Math.round(courts.reduce((sum, c) => sum + Number(c.hourlyRate || 0), 0) / courts.length)
    : Number(currentVenue?.pricePerHour || 1200);

  const stats = [
    {
      title: 'Total Registered Courts',
      value: `${courts.length} ${courts.length === 1 ? 'Court' : 'Courts'}`,
      change: 'Active',
      period: 'venue capacity',
      icon: Building2,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Available for Booking',
      value: `${availableCount} ${availableCount === 1 ? 'Pitch' : 'Pitches'}`,
      change: `${courts.length ? Math.round((availableCount / courts.length) * 100) : 0}%`,
      period: 'ready for kickoff',
      icon: CircleDot,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Average Hourly Rate',
      value: `NRs. ${avgRate.toLocaleString('en-NP')}`,
      change: 'Standard',
      period: 'per 60 min session',
      icon: ArrowUpRight,
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Pitch Maintenance Status',
      value: maintenanceCount > 0 ? `${maintenanceCount} Under Repair` : 'All Optimal',
      change: `${maintenanceCount} Pitches`,
      period: 'maintenance log',
      icon: Wrench,
      iconBg: maintenanceCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600',
    },
  ];

  const totalPages = Math.max(1, Math.ceil(filteredCourts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourts = filteredCourts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="flex flex-col h-screen bg-[#f3f5fc] text-slate-900 font-sans antialiased overflow-hidden select-none relative">
        <TopBar user={user} venue={currentVenue} setActiveTab={setActiveTab} onLogout={onLogout} onSwitchToPlayer={onSwitchToPlayer} />

        <div className="flex flex-1 min-h-0 relative">
          <div className="absolute top-[45%] right-[35%] w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-[160px] pointer-events-none" />

          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

          <div className="flex-1 flex flex-col min-w-0 backdrop-blur-md overflow-hidden relative z-10">
            <main className="flex-1 overflow-y-auto space-y-4 scrollbar-thin p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Futsal Courts & Pitches
                  </h1>
                  <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                    Manage {currentVenue?.name || 'Venue'} numbered courts, dimensions, pitch specifications, and photos.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Plus size={15} />
                  <span>Add New Pitch</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.title}
                      className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-5 relative flex flex-col justify-between shadow-xs hover:shadow-md hover:bg-white/80 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3.5 rounded-2xl shrink-0 ${stat.iconBg}`}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <span className="text-[12px] font-semibold text-slate-400 block leading-tight">
                              {stat.title}
                            </span>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-1">
                              {stat.value}
                            </h3>
                          </div>
                        </div>
                        <button className="text-slate-400 hover:text-slate-700 p-1 -mr-1 -mt-1 transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-emerald-600 bg-emerald-50/80 px-1.5 py-1 rounded-md flex items-center gap-0.5 font-bold">
                          <ArrowUpRight size={12} /> {stat.change}
                        </span>
                        <span className="text-slate-400 font-medium">{stat.period}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-5 space-y-4 shadow-xs hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="relative w-full md:w-80">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search court name, dimension, turf..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-full bg-white/80 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-0.5">
                    {['All', 'Available', 'In Use', 'Maintenance'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                          statusFilter === status
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/80'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full min-w-[900px] text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="text-xs font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider whitespace-nowrap">
                        <th className="pb-3 pr-4">Court ID</th>
                        <th className="pb-3 pr-4">Pitch Name & Photo</th>
                        <th className="pb-3 pr-4">Dimensions</th>
                        <th className="pb-3 pr-4">Surface / Material</th>
                        <th className="pb-3 pr-4">Hourly Rate</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/60 text-sm whitespace-nowrap">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-slate-400 text-xs font-medium">
                            Loading court specifications...
                          </td>
                        </tr>
                      ) : paginatedCourts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-slate-400 text-xs font-medium">
                            No courts found matching your search. Click "Add New Pitch" to add one.
                          </td>
                        </tr>
                      ) : (
                        paginatedCourts.map((court, index) => {
                          const displayId = `CRT-${String(court.courtNumber || index + 1).padStart(2, '0')}`;
                          const courtImg = court.image || (court.images && court.images[0]) || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80';
                          return (
                            <tr key={court._id || court.id || index} className="hover:bg-white/40 transition-colors whitespace-nowrap">
                              <td className="py-3.5 pr-4 font-bold text-emerald-600 text-sm whitespace-nowrap">
                                {displayId}
                              </td>
                              <td className="py-3.5 pr-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={courtImg}
                                    alt={court.name}
                                    className="w-12 h-10 rounded-xl object-cover border border-white shadow-2xs shrink-0"
                                  />
                                  <div className="whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-bold text-slate-900 text-sm leading-tight whitespace-nowrap">{court.name}</h4>
                                      {court.isConfigured ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                                          <CheckCircle2 size={10} /> Configured
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                                          Setup Needed
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                                      {court.matchType || '5v5'} Standard
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 pr-4 whitespace-nowrap">
                                <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
                                  {court.dimension || `${court.length || 25}m x ${court.width || 15}m`}
                                </span>
                              </td>
                              <td className="py-3.5 pr-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                                {court.surface || 'FIFA Quality Synthetic Turf'}
                              </td>
                              <td className="py-3.5 pr-4 font-black text-slate-900 text-sm whitespace-nowrap">
                                NRs. {Number(court.hourlyRate || currentVenue?.pricePerHour || 1200).toLocaleString('en-NP')} / hr
                              </td>
                              <td className="py-3.5 pr-4 whitespace-nowrap">
                                {getStatusBadge(court.status)}
                              </td>
                              <td className="py-3.5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    title="View Details"
                                    onClick={() => setSelectedCourt(court)}
                                    className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-2xs"
                                  >
                                    <Eye size={14} />
                                  </button>
                                  <button
                                    title="Edit Pitch & Upload Photo"
                                    onClick={() => handleOpenEditModal(court)}
                                    className="p-1.5 rounded-xl border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all shadow-2xs"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    title="Delete Pitch"
                                    onClick={() => handleDeleteCourt(court._id, court.name)}
                                    className="p-1.5 rounded-xl border border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-2xs"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3.5 border-t border-slate-100/60 text-xs text-slate-500 font-medium select-none">
                  <div className="flex items-center gap-3">
                    <span>
                      Showing <strong className="text-slate-900 font-bold">{filteredCourts.length === 0 ? 0 : startIndex + 1}</strong> to{' '}
                      <strong className="text-slate-900 font-bold">{Math.min(startIndex + itemsPerPage, filteredCourts.length)}</strong> of{' '}
                      <strong className="text-slate-900 font-bold">{filteredCourts.length}</strong> entries
                    </span>

                    <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                      <span>Rows:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="px-2 py-1 rounded-lg bg-white/80 border border-slate-200 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={15} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          currentPage === page
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {selectedCourt && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/80 w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-5 pb-4 border-b border-slate-100 flex items-center justify-between bg-white/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg text-slate-900 tracking-tight">{selectedCourt.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  Court #{selectedCourt.courtNumber || 1} • {currentVenue?.name || 'Turfio Arena'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedCourt.status)}
                <button
                  onClick={() => setSelectedCourt(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors ml-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <img
                src={selectedCourt.image || (selectedCourt.images && selectedCourt.images[0]) || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80'}
                alt={selectedCourt.name}
                className="w-full h-44 rounded-2xl object-cover border border-white shadow-2xs"
              />

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100/60 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Standard Rate</span>
                  <p className="font-black text-sm text-slate-900">NRs. {Number(selectedCourt.hourlyRate || currentVenue?.pricePerHour || 1200).toLocaleString('en-NP')} / hr</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100/60 space-y-1">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Peak Tariff</span>
                  <p className="font-black text-sm text-slate-900">NRs. {Number(selectedCourt.peakRate || Math.round((selectedCourt.hourlyRate || 1200) * 1.25)).toLocaleString('en-NP')} / hr</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-2 shadow-2xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Pitch Dimensions</span>
                  <span className="font-bold text-slate-900">{selectedCourt.dimension || `${selectedCourt.length || 25}m x ${selectedCourt.width || 15}m`}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Surface Material</span>
                  <span className="font-bold text-slate-900">{selectedCourt.surface || 'FIFA Quality Synthetic Turf'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Match Format</span>
                  <span className="font-bold text-slate-900">{selectedCourt.matchType || '5v5'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Lighting Setup</span>
                  <span className="font-bold text-slate-900">{selectedCourt.lighting || 'LED Floodlights (500 Lux)'}</span>
                </div>
              </div>

              <div className="pt-1 flex items-center gap-2">
                <button
                  onClick={() => {
                    const c = selectedCourt;
                    setSelectedCourt(null);
                    handleOpenEditModal(c);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all text-xs flex items-center justify-center gap-1.5"
                >
                  <Edit2 size={13} />
                  <span>Edit Pitch Specs</span>
                </button>
                <button
                  onClick={() => setSelectedCourt(null)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-black text-base text-slate-900">Add New Pitch / Court</h3>
                <p className="text-[11px] text-slate-400 font-medium">Add a new court with specifications and picture</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold">
                  {formError}
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pitch Name</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="e.g. Court 3 or Rooftop Pro Pitch"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700 block mb-1">Court Dimensions & Size</label>
                <select
                  value={addForm.dimensionPreset}
                  onChange={(e) => {
                    const presetVal = e.target.value;
                    const preset = DIMENSION_PRESETS.find((p) => p.value === presetVal);
                    setAddForm((prev) => ({
                      ...prev,
                      dimensionPreset: presetVal,
                      customLength: preset ? preset.length : prev.customLength,
                      customWidth: preset ? preset.width : prev.customWidth,
                      matchType: preset ? preset.matchType : prev.matchType,
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {DIMENSION_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>

                {addForm.dimensionPreset === 'custom' && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Length (meters)</span>
                      <input
                        type="number"
                        min={10}
                        max={120}
                        value={addForm.customLength}
                        onChange={(e) => setAddForm({ ...addForm, customLength: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                        required
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Width (meters)</span>
                      <input
                        type="number"
                        min={5}
                        max={90}
                        value={addForm.customWidth}
                        onChange={(e) => setAddForm({ ...addForm, customWidth: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Turf Surface</label>
                  <select
                    value={addForm.surface}
                    onChange={(e) => setAddForm({ ...addForm, surface: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs"
                  >
                    {SURFACE_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Match Format</label>
                  <select
                    value={addForm.matchType}
                    onChange={(e) => setAddForm({ ...addForm, matchType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs"
                  >
                    <option value="5v5">5v5 Futsal</option>
                    <option value="7v7">7v7 Mini Pitch</option>
                    <option value="11v11">11v11 Full Pitch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rate (NRs/hr)</label>
                  <input
                    type="number"
                    min={0}
                    value={addForm.hourlyRate}
                    onChange={(e) => setAddForm({ ...addForm, hourlyRate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Peak Rate (NRs)</label>
                  <input
                    type="number"
                    min={0}
                    value={addForm.peakRate}
                    onChange={(e) => setAddForm({ ...addForm, peakRate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-200 border border-slate-200 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                  >
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Upload Court Picture</label>
                <div
                  onClick={() => addFileInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-4 text-center bg-slate-50/60 transition-all"
                >
                  {addForm.imagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={addForm.imagePreview}
                        alt="Court Preview"
                        className="w-full h-36 rounded-xl object-cover border border-slate-200 mx-auto"
                      />
                      <span className="text-[11px] text-emerald-600 font-bold">Click to choose a different photo</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 py-2">
                      <Upload size={22} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-700">Click to upload pitch photo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={addFileInputRef}
                    accept="image/*"
                    onChange={handleAddImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-xs disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : 'Add Pitch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-black text-base text-slate-900">Edit Pitch: {editingCourt?.name}</h3>
                <p className="text-[11px] text-slate-400 font-medium">Modify dimensions, rates, status, and court photo</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold">
                  {formError}
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pitch / Court Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="e.g. Court 1 or Main Match Pitch"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700 block mb-1">Court Dimensions & Size</label>
                <select
                  value={editForm.dimensionPreset}
                  onChange={(e) => {
                    const presetVal = e.target.value;
                    const preset = DIMENSION_PRESETS.find((p) => p.value === presetVal);
                    setEditForm((prev) => ({
                      ...prev,
                      dimensionPreset: presetVal,
                      customLength: preset ? preset.length : prev.customLength,
                      customWidth: preset ? preset.width : prev.customWidth,
                      matchType: preset ? preset.matchType : prev.matchType,
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {DIMENSION_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>

                {editForm.dimensionPreset === 'custom' && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Length (meters)</span>
                      <input
                        type="number"
                        min={10}
                        max={120}
                        value={editForm.customLength}
                        onChange={(e) => setEditForm({ ...editForm, customLength: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                        required
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Width (meters)</span>
                      <input
                        type="number"
                        min={5}
                        max={90}
                        value={editForm.customWidth}
                        onChange={(e) => setEditForm({ ...editForm, customWidth: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Turf Surface</label>
                  <select
                    value={editForm.surface}
                    onChange={(e) => setEditForm({ ...editForm, surface: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs"
                  >
                    {SURFACE_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Match Format</label>
                  <select
                    value={editForm.matchType}
                    onChange={(e) => setEditForm({ ...editForm, matchType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs"
                  >
                    <option value="5v5">5v5 Futsal</option>
                    <option value="7v7">7v7 Mini Pitch</option>
                    <option value="11v11">11v11 Full Pitch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rate (NRs/hr)</label>
                  <input
                    type="number"
                    min={0}
                    value={editForm.hourlyRate}
                    onChange={(e) => setEditForm({ ...editForm, hourlyRate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Peak Rate (NRs)</label>
                  <input
                    type="number"
                    min={0}
                    value={editForm.peakRate}
                    onChange={(e) => setEditForm({ ...editForm, peakRate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                  >
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Update Court Picture</label>
                <div
                  onClick={() => editFileInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-4 text-center bg-slate-50/60 transition-all"
                >
                  {editForm.imagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={editForm.imagePreview}
                        alt="Court Preview"
                        className="w-full h-36 rounded-xl object-cover border border-slate-200 mx-auto"
                      />
                      <span className="text-[11px] text-emerald-600 font-bold block">Click to choose a new photo to replace</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 py-2">
                      <Upload size={22} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-700">Click to upload pitch photo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={editFileInputRef}
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-xs disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CourtsPage;
