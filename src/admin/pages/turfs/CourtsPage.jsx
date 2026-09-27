import { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  Plus,
  Search,
  CircleDot,
  CheckCircle2,
  Wrench,
  ChevronDown,
  Eye,
  Edit2,
  X,
  Building2,
  MoreHorizontal,
  Upload,
  Trash2,
} from 'lucide-react';
import turfService from '../../../shared/services/turfService';
import { useToast } from '../../../shared/components/common/toastContext';
import StatCards from '../../components/dashboard/StatCards';

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

const STATUS_STYLES = {
  Available: 'bg-lime-50 text-lime-700',
  'In Use': 'bg-blue-50 text-blue-600',
  Maintenance: 'bg-rose-50 text-rose-600',
};

function StatusBadge({ status }) {
  const Icon = status === 'Available' ? CheckCircle2 : status === 'In Use' ? CircleDot : status === 'Maintenance' ? Wrench : null;
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'
        }`}
    >
      {Icon && <Icon size={12} className={status === 'In Use' ? 'animate-pulse' : ''} />}
      {status}
    </span>
  );
}

function FilterSelect({ value, onChange, children }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-xs font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none"
      >
        {children}
      </select>
      <ChevronDown
        size={13}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

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
      }).catch(() => { });
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
      subtext: 'Venue capacity',
      showTrendArrow: false,
    },
    {
      title: 'Available for Booking',
      value: `${availableCount} ${availableCount === 1 ? 'Pitch' : 'Pitches'}`,
      change: `${courts.length ? Math.round((availableCount / courts.length) * 100) : 0}%`,
      subtext: 'Ready for kickoff',
      showTrendArrow: false,
    },
    {
      title: 'Average Hourly Rate',
      value: `NRs. ${avgRate.toLocaleString('en-NP')}`,
      subtext: 'Per 60 min session',
      showTrendArrow: false,
    },
    {
      title: 'Pitch Maintenance Status',
      value: maintenanceCount > 0 ? `${maintenanceCount} Under Repair` : 'All Optimal',
      subtext: 'Maintenance log',
      showTrendArrow: false,
    },
  ];

  const totalPages = Math.max(1, Math.ceil(filteredCourts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourts = filteredCourts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="relative flex h-screen flex-col overflow-hidden bg-[#fdfefe] font-sans text-slate-900 antialiased select-none">
        <TopBar user={user} venue={currentVenue} setActiveTab={setActiveTab} onLogout={onLogout} />

        <div className="relative flex min-h-0 flex-1">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

          <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
            <div className="scrollbar-thin flex-1 overflow-y-auto">
              <div className="mx-auto w-full space-y-6 px-5 py-6 md:px-6 md:py-7 xl:px-7">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  <div className="min-w-0">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                      Futsal Courts &amp; Pitches
                    </h1>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Manage {currentVenue?.name || 'Venue'} courts, dimensions, pitch specifications, and photos.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-lime-400 px-5 py-3 text-xs font-bold text-slate-900 transition-colors hover:bg-lime-500"
                  >
                    <Plus size={14} />
                    Add New Pitch
                  </button>
                </div>

                {/* Stat Cards */}
                <StatCards stats={stats} />

                {/* Table */}
                <div className="min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                  {/* Toolbar */}
                  <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-sm">
                      <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder="Search court name, dimension, turf..."
                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-100"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {['All', 'Available', 'In Use', 'Maintenance'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            setStatusFilter(status);
                            setCurrentPage(1);
                          }}
                          className={`whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-bold transition-colors ${statusFilter === status
                            ? 'bg-lime-400 text-slate-900'
                            : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          <th className="px-4 py-3">Court ID</th>
                          <th className="px-4 py-3">Pitch Name &amp; Photo</th>
                          <th className="px-4 py-3">Dimensions</th>
                          <th className="px-4 py-3">Surface / Material</th>
                          <th className="px-4 py-3">Hourly Rate</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                              Loading court specifications...
                            </td>
                          </tr>
                        ) : paginatedCourts.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                              No courts found matching your search. Click &quot;Add New Pitch&quot; to add one.
                            </td>
                          </tr>
                        ) : (
                          paginatedCourts.map((court, index) => {
                            const displayId = `CRT-${String(court.courtNumber || index + 1).padStart(2, '0')}`;
                            const courtImg =
                              court.image ||
                              (court.images && court.images[0]) ||
                              'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80';
                            return (
                              <tr key={court._id || court.id || index} className="border-b border-slate-50 hover:bg-slate-50/70">
                                <td className="px-4 py-3.5 font-bold text-slate-700">{displayId}</td>
                                <td className="px-4 py-3.5">
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={courtImg}
                                      alt={court.name}
                                      className="h-9 w-12 shrink-0 rounded-lg border border-slate-100 object-cover"
                                    />
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-slate-900">{court.name}</span>
                                        {court.isConfigured ? (
                                          <span className="inline-flex items-center gap-1 rounded-full bg-lime-50 px-2 py-0.5 text-[10px] font-extrabold text-lime-700">
                                            <CheckCircle2 size={10} /> Configured
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-700">
                                            Setup Needed
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-[11px] text-slate-400">{court.matchType || '5v5'} Standard</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5">
                                  <span className="inline-block rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                                    {court.dimension || `${court.length || 25}m x ${court.width || 15}m`}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 text-slate-500">{court.surface || 'FIFA Quality Synthetic Turf'}</td>
                                <td className="px-4 py-3.5 font-bold text-slate-900">
                                  {`NRs. ${Number(court.hourlyRate || currentVenue?.pricePerHour || 1200).toLocaleString('en-NP')} / hr`}
                                </td>
                                <td className="px-4 py-3.5">
                                  <StatusBadge status={court.status} />
                                </td>
                                <td className="px-4 py-3.5">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      title="View Details"
                                      onClick={() => setSelectedCourt(court)}
                                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                                    >
                                      <Eye size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      title="Edit Pitch & Upload Photo"
                                      onClick={() => handleOpenEditModal(court)}
                                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-lime-600 hover:bg-lime-50"
                                    >
                                      <Edit2 size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      title="Delete Pitch"
                                      onClick={() => handleDeleteCourt(court._id, court.name)}
                                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-rose-500 hover:bg-rose-50"
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

                  {/* Pagination */}
                  <div className="flex flex-col gap-3 border-t border-slate-100 p-4 text-xs font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      Showing {filteredCourts.length === 0 ? 0 : startIndex + 1}–
                      {Math.min(startIndex + itemsPerPage, filteredCourts.length)} of {filteredCourts.length}{' '}
                      {filteredCourts.length === 1 ? 'court' : 'courts'}
                    </span>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          className="rounded-lg border border-slate-200 px-2.5 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          ‹
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .slice(0, 5)
                          .map((page) => (
                            <button
                              key={page}
                              type="button"
                              onClick={() => setCurrentPage(page)}
                              className={`rounded-lg px-3 py-1.5 font-bold ${currentPage === page
                                ? 'bg-lime-400 text-slate-900'
                                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                              {page}
                            </button>
                          ))}
                        <button
                          type="button"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                          className="rounded-lg border border-slate-200 px-2.5 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          ›
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span>Rows per page</span>
                        <FilterSelect
                          value={String(itemsPerPage)}
                          onChange={(value) => {
                            setItemsPerPage(Number(value));
                            setCurrentPage(1);
                          }}
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                        </FilterSelect>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {selectedCourt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <span className="text-base font-extrabold text-slate-900">{selectedCourt.name}</span>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                  Court #{selectedCourt.courtNumber || 1} • {currentVenue?.name || 'Turfio Arena'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedCourt.status} />
                <button
                  type="button"
                  onClick={() => setSelectedCourt(null)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-4 p-5 text-xs">
              <img
                src={
                  selectedCourt.image ||
                  (selectedCourt.images && selectedCourt.images[0]) ||
                  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80'
                }
                alt={selectedCourt.name}
                className="h-44 w-full rounded-xl border border-slate-100 object-cover"
              />

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Standard Rate</span>
                  <p className="mt-1 text-sm font-extrabold text-slate-900">
                    NRs. {Number(selectedCourt.hourlyRate || currentVenue?.pricePerHour || 1200).toLocaleString('en-NP')} / hr
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Peak Tariff</span>
                  <p className="mt-1 text-sm font-extrabold text-slate-900">
                    NRs. {Number(selectedCourt.peakRate || Math.round((selectedCourt.hourlyRate || 1200) * 1.25)).toLocaleString('en-NP')} / hr
                  </p>
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400">Pitch Dimensions</span>
                  <span className="font-bold text-slate-900">
                    {selectedCourt.dimension || `${selectedCourt.length || 25}m x ${selectedCourt.width || 15}m`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400">Surface Material</span>
                  <span className="font-bold text-slate-900">{selectedCourt.surface || 'FIFA Quality Synthetic Turf'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400">Match Format</span>
                  <span className="font-bold text-slate-900">{selectedCourt.matchType || '5v5'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400">Lighting Setup</span>
                  <span className="font-bold text-slate-900">{selectedCourt.lighting || 'LED Floodlights (500 Lux)'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const c = selectedCourt;
                    setSelectedCourt(null);
                    handleOpenEditModal(c);
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  <Edit2 size={13} />
                  Edit Pitch Specs
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCourt(null)}
                  className="flex-1 rounded-xl bg-lime-400 py-2.5 text-xs font-bold text-slate-900 hover:bg-lime-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD PITCH MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Add New Pitch / Court</h3>
                <p className="text-[11px] font-medium text-slate-400">Add a new court with specifications and picture</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="max-h-[75vh] space-y-4 overflow-y-auto p-5 text-xs">
              {formError && (
                <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">{formError}</div>
              )}

              <label className="block text-xs font-bold text-slate-700">
                Pitch Name
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="e.g. Court 3 or Rooftop Pro Pitch"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-lime-400"
                  required
                />
              </label>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Court Dimensions &amp; Size</label>
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
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-lime-400"
                >
                  {DIMENSION_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>

                {addForm.dimensionPreset === 'custom' && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-bold text-slate-500">Length (meters)</span>
                      <input
                        type="number"
                        min={10}
                        max={120}
                        value={addForm.customLength}
                        onChange={(e) => setAddForm({ ...addForm, customLength: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-lime-400"
                        required
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-bold text-slate-500">Width (meters)</span>
                      <input
                        type="number"
                        min={5}
                        max={90}
                        value={addForm.customWidth}
                        onChange={(e) => setAddForm({ ...addForm, customWidth: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-lime-400"
                        required
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-bold text-slate-700">
                  Turf Surface
                  <select
                    value={addForm.surface}
                    onChange={(e) => setAddForm({ ...addForm, surface: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-lime-400"
                  >
                    {SURFACE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs font-bold text-slate-700">
                  Match Format
                  <select
                    value={addForm.matchType}
                    onChange={(e) => setAddForm({ ...addForm, matchType: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-lime-400"
                  >
                    <option value="5v5">5v5 Futsal</option>
                    <option value="7v7">7v7 Mini Pitch</option>
                    <option value="11v11">11v11 Full Pitch</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <label className="block text-xs font-bold text-slate-700">
                  Rate (NRs/hr)
                  <input
                    type="number"
                    min={0}
                    value={addForm.hourlyRate}
                    onChange={(e) => setAddForm({ ...addForm, hourlyRate: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-lime-400"
                    required
                  />
                </label>

                <label className="block text-xs font-bold text-slate-700">
                  Peak Rate (NRs)
                  <input
                    type="number"
                    min={0}
                    value={addForm.peakRate}
                    onChange={(e) => setAddForm({ ...addForm, peakRate: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-lime-400"
                  />
                </label>

                <label className="block text-xs font-bold text-slate-700">
                  Status
                  <select
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-lime-400"
                  >
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </label>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Upload Court Picture</label>
                <div
                  onClick={() => addFileInputRef.current?.click()}
                  className="cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-4 text-center transition-colors hover:border-lime-400"
                >
                  {addForm.imagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={addForm.imagePreview}
                        alt="Court Preview"
                        className="mx-auto h-36 w-full rounded-xl border border-slate-200 object-cover"
                      />
                      <span className="text-[11px] font-bold text-lime-600">Click to choose a different photo</span>
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

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="rounded-xl bg-lime-400 px-5 py-2.5 text-xs font-bold text-slate-900 hover:bg-lime-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : 'Add Pitch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PITCH MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Edit Pitch: {editingCourt?.name}</h3>
                <p className="text-[11px] font-medium text-slate-400">Modify dimensions, rates, status, and court photo</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="max-h-[75vh] space-y-4 overflow-y-auto p-5 text-xs">
              {formError && (
                <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">{formError}</div>
              )}

              <label className="block text-xs font-bold text-slate-700">
                Pitch / Court Name
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="e.g. Court 1 or Main Match Pitch"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-lime-400"
                  required
                />
              </label>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Court Dimensions &amp; Size</label>
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
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-lime-400"
                >
                  {DIMENSION_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>

                {editForm.dimensionPreset === 'custom' && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-bold text-slate-500">Length (meters)</span>
                      <input
                        type="number"
                        min={10}
                        max={120}
                        value={editForm.customLength}
                        onChange={(e) => setEditForm({ ...editForm, customLength: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-lime-400"
                        required
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-bold text-slate-500">Width (meters)</span>
                      <input
                        type="number"
                        min={5}
                        max={90}
                        value={editForm.customWidth}
                        onChange={(e) => setEditForm({ ...editForm, customWidth: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-lime-400"
                        required
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-bold text-slate-700">
                  Turf Surface
                  <select
                    value={editForm.surface}
                    onChange={(e) => setEditForm({ ...editForm, surface: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-lime-400"
                  >
                    {SURFACE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs font-bold text-slate-700">
                  Match Format
                  <select
                    value={editForm.matchType}
                    onChange={(e) => setEditForm({ ...editForm, matchType: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-lime-400"
                  >
                    <option value="5v5">5v5 Futsal</option>
                    <option value="7v7">7v7 Mini Pitch</option>
                    <option value="11v11">11v11 Full Pitch</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <label className="block text-xs font-bold text-slate-700">
                  Rate (NRs/hr)
                  <input
                    type="number"
                    min={0}
                    value={editForm.hourlyRate}
                    onChange={(e) => setEditForm({ ...editForm, hourlyRate: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-lime-400"
                    required
                  />
                </label>

                <label className="block text-xs font-bold text-slate-700">
                  Peak Rate (NRs)
                  <input
                    type="number"
                    min={0}
                    value={editForm.peakRate}
                    onChange={(e) => setEditForm({ ...editForm, peakRate: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-lime-400"
                  />
                </label>

                <label className="block text-xs font-bold text-slate-700">
                  Status
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-lime-400"
                  >
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </label>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Update Court Picture</label>
                <div
                  onClick={() => editFileInputRef.current?.click()}
                  className="cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-4 text-center transition-colors hover:border-lime-400"
                >
                  {editForm.imagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={editForm.imagePreview}
                        alt="Court Preview"
                        className="mx-auto h-36 w-full rounded-xl border border-slate-200 object-cover"
                      />
                      <span className="block text-[11px] font-bold text-lime-600">Click to choose a new photo to replace</span>
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

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="rounded-xl bg-lime-400 px-5 py-2.5 text-xs font-bold text-slate-900 hover:bg-lime-500 disabled:cursor-not-allowed disabled:opacity-50"
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