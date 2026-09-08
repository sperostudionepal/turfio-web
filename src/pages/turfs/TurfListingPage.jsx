import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Users,
  Car,
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  RotateCcw,
  Check,
  Wifi,
  Utensils,
  Bath,
  Wind,
  Shirt,
  ShieldAlert,
  Dumbbell,
  Sun,
  Building2,
  CloudSun,
  Map,
  Grid,
  Maximize2,
  Minimize2,
  ExternalLink,
  Navigation,
  Plus,
  Minus,
  ChevronUp,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import TurfMap from '../../components/turfs/TurfMap';
import CustomDatePicker from '../../components/common/CustomDatePicker';
import CustomDropdown from '../../components/common/CustomDropdown';
import turfService from '../../services/turfService';

/*
// Hardcoded dummy turfs commented out in favor of real backend data fetching
export const dummyTurfs = [
  // Kathmandu Venues
  {
    id: 1,
    title: 'Futsal Arena Boudha',
    type: 'Indoor',
    size: '5v5',
    parking: 'Parking',
    rating: 4.2,
    reviews: 164,
    price: 'NPR 1,200/hr',
    priceVal: 1200,
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'Washrooms', 'Changing Rooms', 'Canteen'],
    location: 'Boudha, Kathmandu',
    lat: 27.71585,
    lng: 85.36209,
  },
  {
    id: 2,
    title: 'Dhanyentari Futsal',
    type: 'Outdoor',
    size: '7v7',
    parking: 'Parking',
    rating: 4.0,
    reviews: 98,
    price: 'NPR 1,100/hr',
    priceVal: 1100,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'WiFi', 'Washrooms', 'Changing Rooms', 'First Aid'],
    location: 'Hadigaun, Kathmandu',
    lat: 27.71986,
    lng: 85.34077,
  },
  {
    id: 3,
    title: 'United Futsal',
    type: 'Indoor',
    size: '5v5',
    parking: 'Parking',
    rating: 4.0,
    reviews: 215,
    price: 'NPR 1,000/hr',
    priceVal: 1000,
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'Washrooms', 'First Aid'],
    location: 'Kalanki, Kathmandu',
    lat: 27.70091,
    lng: 85.28280,
  },
  {
    id: 4,
    title: 'Royal Futsal',
    type: 'Rooftop',
    size: '5v5',
    parking: 'Parking',
    rating: 3.5,
    reviews: 82,
    price: 'NPR 900/hr',
    priceVal: 900,
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80',
    amenities: ['Washrooms', 'Changing Rooms'],
    location: 'Maitidevi, Kathmandu',
    lat: 27.69295,
    lng: 85.33004,
  },
  {
    id: 5,
    title: 'Shantinagar Futsal',
    type: 'Indoor',
    size: '7v7',
    parking: 'Parking',
    rating: 3.9,
    reviews: 140,
    price: 'NPR 1,300/hr',
    priceVal: 1300,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'WiFi', 'Washrooms', 'Changing Rooms', 'Canteen'],
    location: 'Shantinagar, Kathmandu',
    lat: 27.69197,
    lng: 85.34780,
  },
  {
    id: 6,
    title: 'Shankhamul Futsal',
    type: 'Outdoor',
    size: '5v5',
    parking: 'Parking',
    rating: 3.9,
    reviews: 230,
    price: 'NPR 1,200/hr',
    priceVal: 1200,
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'Washrooms', 'Changing Rooms', 'First Aid'],
    location: 'Shankhamul, Kathmandu',
    lat: 27.68260,
    lng: 85.33232,
  },
  {
    id: 7,
    title: 'Prime Futsal Gyaneshwor',
    type: 'Indoor',
    size: '7v7',
    parking: 'Parking',
    rating: 3.9,
    reviews: 310,
    price: 'NPR 1,400/hr',
    priceVal: 1400,
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'WiFi', 'Washrooms', 'Canteen', 'Sports Equipment'],
    location: 'Gyaneshwor, Kathmandu',
    lat: 27.71035,
    lng: 85.33472,
  },

  // Lalitpur Venues
  {
    id: 8,
    title: 'Kathmandu Futsal (Bagdol)',
    type: 'Outdoor',
    size: '5v5',
    parking: 'Parking',
    rating: 3.5,
    reviews: 75,
    price: 'NPR 950/hr',
    priceVal: 950,
    image: 'https://images.unsplash.com/photo-1524015368236-bbf6f72545b6?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'Washrooms', 'First Aid'],
    location: 'Bagdol, Lalitpur',
    lat: 27.67043,
    lng: 85.30391,
  },
  {
    id: 9,
    title: 'GxG Arena',
    type: 'Indoor',
    size: '7v7',
    parking: 'Parking',
    rating: 4.8,
    reviews: 420,
    price: 'NPR 1,600/hr',
    priceVal: 1600,
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'WiFi', 'Washrooms', 'AC', 'Canteen', 'Sports Equipment'],
    location: 'Gwarko, Lalitpur',
    lat: 27.65688,
    lng: 85.33443,
  },
  {
    id: 10,
    title: 'TURF PARK',
    type: 'Outdoor',
    size: '9v9',
    parking: 'Parking',
    rating: 4.9,
    reviews: 580,
    price: 'NPR 1,800/hr',
    priceVal: 1800,
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'WiFi', 'Washrooms', 'Changing Rooms', 'Canteen', 'Sports Equipment'],
    location: 'Khumaltar, Lalitpur',
    lat: 27.64234,
    lng: 85.31521,
  },
  {
    id: 11,
    title: 'Creation Futsal',
    type: 'Indoor',
    size: '5v5',
    parking: 'Parking',
    rating: 4.5,
    reviews: 190,
    price: 'NPR 1,250/hr',
    priceVal: 1250,
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'Washrooms', 'Changing Rooms'],
    location: 'Imadol, Lalitpur',
    lat: 27.65809,
    lng: 85.34068,
  },
  {
    id: 12,
    title: 'Elite Futsal',
    type: 'Outdoor',
    size: '7v7',
    parking: 'Parking',
    rating: 4.4,
    reviews: 165,
    price: 'NPR 1,300/hr',
    priceVal: 1300,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'Washrooms', 'Changing Rooms', 'First Aid'],
    location: 'Tikathali, Lalitpur',
    lat: 27.65356,
    lng: 85.35731,
  },
  {
    id: 13,
    title: 'Lalitpur 5A Side',
    type: 'Indoor',
    size: '5v5',
    parking: 'Parking',
    rating: 3.6,
    reviews: 112,
    price: 'NPR 1,000/hr',
    priceVal: 1000,
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
    amenities: ['Washrooms', 'Changing Rooms'],
    location: 'Sanepa, Lalitpur',
    lat: 27.68981,
    lng: 85.30390,
  },
  {
    id: 14,
    title: 'R Squared Gamestation',
    type: 'Indoor',
    size: '5v5',
    parking: 'Parking',
    rating: 5.0,
    reviews: 350,
    price: 'NPR 1,500/hr',
    priceVal: 1500,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'WiFi', 'Washrooms', 'AC', 'Canteen', 'Sports Equipment'],
    location: 'Lagankhel, Lalitpur',
    lat: 27.67424,
    lng: 85.33483,
  },
  {
    id: 15,
    title: 'Kick Futsal Lalitpur',
    type: 'Rooftop',
    size: '5v5',
    parking: 'Parking',
    rating: 3.7,
    reviews: 145,
    price: 'NPR 1,150/hr',
    priceVal: 1150,
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'Washrooms', 'First Aid'],
    location: 'Patan, Lalitpur',
    lat: 27.67832,
    lng: 85.32926,
  },
  {
    id: 16,
    title: 'Elite Sports Training Center',
    type: 'Outdoor',
    size: '7v7',
    parking: 'Parking',
    rating: 4.1,
    reviews: 205,
    price: 'NPR 1,450/hr',
    priceVal: 1450,
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'WiFi', 'Washrooms', 'Changing Rooms', 'Canteen', 'Sports Equipment'],
    location: 'Dhapakhel, Lalitpur',
    lat: 27.64704,
    lng: 85.30972,
  },
];
*/
export const initialTurfs = [];

const amenitiesList = [
  'Parking',
  'WiFi',
  'Canteen',
  'Washrooms',
  'AC',
  'Changing Rooms',
  'First Aid',
  'Sports Equipment',
];

const TIME_SLOT_OPTIONS = [
  { value: '06:00 AM', label: '06:00 AM' },
  { value: '07:00 AM', label: '07:00 AM' },
  { value: '08:00 AM', label: '08:00 AM' },
  { value: '09:00 AM', label: '09:00 AM' },
  { value: '10:00 AM', label: '10:00 AM' },
  { value: '04:00 PM', label: '04:00 PM' },
  { value: '05:00 PM', label: '05:00 PM' },
  { value: '06:00 PM', label: '06:00 PM' },
  { value: '07:00 PM', label: '07:00 PM' },
  { value: '08:00 PM', label: '08:00 PM' },
  { value: '09:00 PM', label: '09:00 PM' },
];

const PLAYERS_OPTIONS = [
  { value: 'Any Size', label: 'Any Size' },
  { value: '5v5', label: '5v5 Match' },
  { value: '7v7', label: '7v7 Match' },
  { value: '9v9', label: '9v9 Match' },
];

export default function TurfListingPage({
  user,
  onLogin,
  onLogout,
  onListTurf,
  onHome,
  onSelectTurf,
  onNavigateRoute,
}) {
  // Search draft input parameters (user typing / selecting before clicking Search)
  const [locationInput, setLocationInput] = useState('');
  const [dateInput, setDateInput] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeInput, setTimeInput] = useState('07:00 PM');
  const [playersInput, setPlayersInput] = useState('Any Size');

  // Applied search parameters (only updated when Search button clicked or form submitted)
  const [appliedLocation, setAppliedLocation] = useState('');
  const [appliedDate, setAppliedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [appliedTime, setAppliedTime] = useState('07:00 PM');
  const [appliedPlayers, setAppliedPlayers] = useState('Any Size');

  // Sidebar filters
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Search bar visibility toggle (defaults to false or expandable)
  const [showSearchBar, setShowSearchBar] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState('rating');

  // Loading state (Airbnb style skeleton loading) - defaults to true for initial mount
  const [isLoading, setIsLoading] = useState(true);

  // View mode: 'split' (side-by-side on desktop), 'grid' (cards only), 'map' (map full on mobile)
  const [showMap, setShowMap] = useState(true);
  const [hoveredFromListId, setHoveredFromListId] = useState(null);
  const [hoveredFromMapId, setHoveredFromMapId] = useState(null);
  const [selectedMapTurf, setSelectedMapTurf] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [resetMapKey, setResetMapKey] = useState(0);
  const listScrollContainerRef = useRef(null);
  const [offscreenDirection, setOffscreenDirection] = useState(null); // 'up' | 'down' | null

  // Apply search execution when Search button is clicked or form submitted
  const handleApplySearch = (e) => {
    if (e) e.preventDefault();
    setAppliedLocation(locationInput.trim());
    setAppliedDate(dateInput);
    setAppliedTime(timeInput);
    setAppliedPlayers(playersInput);
    setCurrentPage(1);
  };

  // Helper to reset map to original state and clear location filters
  const handleResetMap = () => {
    setLocationInput('');
    setAppliedLocation('');
    setResetMapKey((prev) => prev + 1);
  };

  // Real turfs state fetched from backend API
  const [turfs, setTurfs] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  // Fetch real turfs from backend on mount
  useEffect(() => {
    let isMounted = true;
    async function loadRealTurfs() {
      setIsLoading(true);
      try {
        const data = await turfService.getTurfs();
        if (isMounted) {
          setTurfs(data || []);
          setFetchError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching turfs:', err);
          setFetchError(err.message || 'Failed to load turfs');
          setTurfs([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRealTurfs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate if the hovered turf card is currently above or below the scroll viewport
  useEffect(() => {
    if (!hoveredFromMapId || !listScrollContainerRef.current) {
      setOffscreenDirection(null);
      return;
    }

    const checkVisibility = () => {
      const container = listScrollContainerRef.current;
      const targetCard = container?.querySelector(`[data-turf-id="${hoveredFromMapId}"]`);
      if (!container || !targetCard) {
        setOffscreenDirection(null);
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const cardRect = targetCard.getBoundingClientRect();

      const isAbove = cardRect.bottom < containerRect.top + 30;
      const isBelow = cardRect.top > containerRect.bottom - 30;

      if (isAbove) {
        setOffscreenDirection('up');
      } else if (isBelow) {
        setOffscreenDirection('down');
      } else {
        setOffscreenDirection(null);
      }
    };

    checkVisibility();
    const container = listScrollContainerRef.current;
    container?.addEventListener('scroll', checkVisibility, { passive: true });
    return () => container?.removeEventListener('scroll', checkVisibility);
  }, [hoveredFromMapId]);


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = showMap ? 8 : 15;

  // Filter modal visibility toggle
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Toggle filter lists
  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedSizes([]);
    setMaxPrice(2500);
    setSelectedAmenities([]);
    setLocationInput('');
    setAppliedLocation('');
    setCurrentPage(1);
  };

  const activeFilterCount =
    selectedTypes.length +
    selectedSizes.length +
    selectedAmenities.length +
    (maxPrice < 2500 ? 1 : 0);

  // 1. Search & Filter criteria across all turfs (passed to Map for pins)
  const searchFilteredTurfs = useMemo(() => {
    return turfs
      .filter((turf) => {
        const locMatch =
          !appliedLocation ||
          (turf.title && turf.title.toLowerCase().includes(appliedLocation.toLowerCase())) ||
          (turf.location && turf.location.toLowerCase().includes(appliedLocation.toLowerCase()));

        const typeMatch =
          selectedTypes.length === 0 || (turf.type && selectedTypes.includes(turf.type));

        const sizeMatch =
          (selectedSizes.length === 0 || (turf.size && selectedSizes.includes(turf.size))) &&
          (appliedPlayers === 'Any Size' || turf.size === appliedPlayers);

        const priceMatch = turf.priceVal ? turf.priceVal <= maxPrice : true;

        const amenitiesMatch =
          selectedAmenities.length === 0 ||
          (Array.isArray(turf.amenities) && selectedAmenities.every((amenity) => turf.amenities.includes(amenity)));

        return locMatch && typeMatch && sizeMatch && priceMatch && amenitiesMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'reviews') return (b.reviews || 0) - (a.reviews || 0);
        if (sortBy === 'price-low') return (a.priceVal || 0) - (b.priceVal || 0);
        if (sortBy === 'price-high') return (b.priceVal || 0) - (a.priceVal || 0);
        return 0;
      });
  }, [turfs, appliedLocation, selectedTypes, selectedSizes, appliedPlayers, maxPrice, selectedAmenities, sortBy]);

  // 2. Viewport-filtered turfs: The map bounding box is the source of truth for the list
  const filteredTurfs = useMemo(() => {
    if (!showMap || !mapBounds) {
      return searchFilteredTurfs;
    }

    return searchFilteredTurfs.filter((turf) => {
      if (!turf.lat || !turf.lng) return true;
      return (
        turf.lat >= mapBounds.south &&
        turf.lat <= mapBounds.north &&
        turf.lng >= mapBounds.west &&
        turf.lng <= mapBounds.east
      );
    });
  }, [searchFilteredTurfs, showMap, mapBounds]);

  const totalPages = Math.max(1, Math.ceil(filteredTurfs.length / itemsPerPage));
  const paginatedTurfs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTurfs.slice(start, start + itemsPerPage);
  }, [filteredTurfs, currentPage, itemsPerPage]);

  const activeLocationQuery = appliedLocation
    ? `${appliedLocation}, Nepal`
    : 'Kathmandu, Nepal';

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans flex flex-col justify-between">
      <div>
        <Navbar
          onLogin={onLogin}
          user={user}
          onLogout={onLogout}
          onListTurf={onListTurf}
          onHome={onHome}
          onToggleSearch={() => setShowSearchBar((prev) => !prev)}
          searchActive={showSearchBar}
        />

        {/* ─── FLOATING ALWAYS-VISIBLE SEARCH BAR WIDGET + CONTROLS ─── */}
        <section className="relative z-40 bg-white/95 backdrop-blur-md pt-10 pb-8">
          <div className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Pill */}
            <div className="w-full max-w-[860px] rounded-full bg-white ring-1 ring-slate-100/60 shadow-[0_0_25px_rgba(0,0,0,0.04)] overflow-visible relative z-50">
              <form
                onSubmit={handleApplySearch}
                className="flex flex-col items-stretch divide-y divide-slate-100/90 lg:divide-y-0 lg:flex-row lg:items-center lg:gap-0"
              >
                {/* Location - Expanded Width */}
                <label className="group flex flex-[1.35] items-center gap-2.5 rounded-full px-5 py-2.5 text-left transition-colors hover:bg-slate-50 focus-within:bg-slate-50 cursor-pointer">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-950 transition-colors group-focus-within:bg-lime-100 group-focus-within:text-lime-700">
                    <MapPin className="h-4 w-4 stroke-[2.2]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold text-slate-900 leading-tight">Location</span>
                    <input
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="Search location"
                      className="mt-0.5 w-full border-0 bg-transparent p-0 text-[14px] font-medium text-slate-400 outline-none placeholder:text-slate-400"
                    />
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                </label>

                <div className="hidden h-7 w-px shrink-0 self-center bg-slate-200 lg:block" />

                {/* Date */}
                <div className="flex-[1.2] min-w-[155px]">
                  <CustomDatePicker
                    variant="searchPill"
                    label="Date"
                    value={dateInput}
                    onChange={setDateInput}
                    minDate={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="hidden h-7 w-px shrink-0 self-center bg-slate-200 lg:block" />

                {/* Time */}
                <div className="flex-1 min-w-0">
                  <CustomDropdown
                    variant="searchPill"
                    label="Time"
                    icon={Clock}
                    value={timeInput}
                    onChange={setTimeInput}
                    options={TIME_SLOT_OPTIONS}
                  />
                </div>

                <div className="hidden h-7 w-px shrink-0 self-center bg-slate-200 lg:block" />

                {/* Players */}
                <label className="group relative flex flex-1 items-center gap-2.5 rounded-full px-3.5 py-2.5 text-left transition-colors hover:bg-slate-50 focus-within:bg-slate-50">
                  <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-950 transition-colors group-focus-within:bg-lime-100 group-focus-within:text-lime-700">
                    <Users className="h-4 w-4 stroke-[2.2]" />
                  </span>
                  <span className="relative z-10 min-w-0 flex-1 pointer-events-none">
                    <span className="block text-[13px] font-bold text-slate-900 leading-tight">Players</span>
                    <span className="block mt-0.5 w-full text-[14px] font-medium text-slate-400 truncate">
                      {playersInput === 'Any Size' ? 'Random' : playersInput}
                    </span>
                  </span>
                  <ChevronDown className="relative z-10 h-3.5 w-3.5 shrink-0 text-slate-600 pointer-events-none" />
                  <select
                    value={playersInput}
                    onChange={(e) => setPlayersInput(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  >
                    <option value="Any Size">Random</option>
                    <option value="5v5">5v5</option>
                    <option value="7v7">7v7</option>
                    <option value="9v9">9v9</option>
                  </select>
                </label>

                {/* Action Buttons: Search Icon Only */}
                <div className="flex items-center p-2 lg:p-2 lg:pl-1">
                  <button
                    type="submit"
                    title="Search Turfs"
                    aria-label="Search Turfs"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-lime-400 text-slate-900 transition-all hover:bg-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-300 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Search className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right-most Controls (Permanently on the right side of floating search) */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Filters Trigger Icon Button */}
              <button
                type="button"
                onClick={() => setFilterModalOpen(true)}
                title="Filter Arenas"
                aria-label="Filter Arenas"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-lime-400 text-slate-950 text-[10px] font-black">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Map View Toggle Icon Button (Airbnb Style) */}
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                title={showMap ? 'Hide Map' : 'Show Map'}
                aria-label={showMap ? 'Hide Map' : 'Show Map'}
                className="hidden sm:inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
              >
                {showMap ? (
                  <Grid className="h-4 w-4 text-slate-700" />
                ) : (
                  <Map className="h-4 w-4 text-slate-700" />
                )}
              </button>

              {/* Sort Selector */}
              <div className="relative flex items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-11 appearance-none border-0 bg-slate-100 rounded-full pl-5 pr-9 py-2.5 text-xs font-bold text-slate-900 hover:bg-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 h-3.5 w-3.5 text-slate-600" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── MAIN LISTING LAYOUT WITH OPTIONAL SPLIT MAP VIEW ─── */}
        <main className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-20 pt-2 pb-6">
          {/* ─── MAIN CONTENT: LEFT MAP VIEW + RIGHT TURF LIST ─── */}
          <div
            className={`flex flex-col xl:flex-row items-start transition-all duration-300 ${
              showMap ? 'gap-6 xl:gap-8 2xl:gap-10' : 'gap-0'
            }`}
          >
            {/* ══════════════════════════════════════
                LEFT STICKY MAP CONTAINER (ANIMATED COLLAPSE / EXPAND)
               ══════════════════════════════════════ */}
            <div
              className={`hidden xl:block sticky top-[90px] self-start z-10 transition-all duration-300 ease-in-out overflow-hidden ${
                showMap
                  ? 'w-[48%] xl:w-[58%] 2xl:w-[60%] opacity-100 max-h-[700px]'
                  : 'w-0 opacity-0 max-h-0 pointer-events-none'
              }`}
            >
                <div className="h-[540px] 2xl:h-[580px] w-full rounded-3xl overflow-hidden bg-slate-100 relative group">
                  <TurfMap
                    turfs={searchFilteredTurfs}
                    selectedTurf={selectedMapTurf}
                    hoveredTurfId={hoveredFromListId || hoveredFromMapId}
                    hoveredFromListId={hoveredFromListId}
                    resetViewKey={resetMapKey}
                    onSelectTurf={(turf) => {
                      setSelectedMapTurf(turf);
                      // Selecting a marker on the map highlights it without redirecting away from the listing page
                    }}
                    onHoverTurf={setHoveredFromMapId}
                    onBoundsChange={setMapBounds}
                    onNavigateRoute={onNavigateRoute}
                    searchLocation={appliedLocation}
                    activeLocationQuery={activeLocationQuery}
                  />
                </div>
              </div>

              {/* ══════════════════════════════════════
                  RIGHT COLUMN: HEADER ON TOP OF TURF LIST + SCROLLABLE CARDS GRID
                 ══════════════════════════════════════ */}
              <div
                className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${
                  showMap ? 'h-[540px] 2xl:h-[580px]' : ''
                }`}
              >
                {/* Header Bar on Top of Turf List */}
                <div className="pb-3 mb-2 shrink-0">
                  {isLoading ? (
                    <div className="space-y-1.5 animate-pulse select-none">
                      <div className="h-6 w-64 max-w-[80%] rounded-lg bg-slate-200" />
                      <div className="h-4 w-44 max-w-[60%] rounded-md bg-slate-200/80" />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                        Futsal Arenas in {appliedLocation || 'Kathmandu Valley'}
                      </h1>
                      <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                        Over <span className="font-semibold text-slate-800">{filteredTurfs.length} arenas</span> available for instant booking
                      </p>
                    </>
                  )}
                </div>

                {/* Independently Scrollable Cards Grid (when map open) or Full Grid (when map hidden) */}
                <div className="relative flex-1 min-h-0 flex flex-col">
                  {/* Floating Scroll Indicator Signal: Card is ABOVE (Centered) */}
                  {showMap && offscreenDirection === 'up' && (
                    <button
                      type="button"
                      onClick={() => {
                        const targetCard = listScrollContainerRef.current?.querySelector(`[data-turf-id="${hoveredFromMapId}"]`);
                        targetCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      title="Scroll to hovered arena"
                      className="absolute top-5 left-1/2 -translate-x-1/2 z-40 flex h-8 w-8 items-center justify-center rounded-full bg-white/98 backdrop-blur-md text-[#0f172a] border border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.16)] cursor-pointer animate-signal-up hover:bg-slate-50 hover:scale-110 transition-all select-none"
                    >
                      <ChevronUp className="h-4 w-4 stroke-[3] text-slate-800" />
                    </button>
                  )}

                  {/* Floating Scroll Indicator Signal: Card is BELOW (Centered) */}
                  {showMap && offscreenDirection === 'down' && (
                    <button
                      type="button"
                      onClick={() => {
                        const targetCard = listScrollContainerRef.current?.querySelector(`[data-turf-id="${hoveredFromMapId}"]`);
                        targetCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      title="Scroll to hovered arena"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 z-40 flex h-8 w-8 items-center justify-center rounded-full bg-white/98 backdrop-blur-md text-[#0f172a] border border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.16)] cursor-pointer animate-signal-down hover:bg-slate-50 hover:scale-110 transition-all select-none"
                    >
                      <ChevronDown className="h-4 w-4 stroke-[3] text-slate-800" />
                    </button>
                  )}

                  <div
                    ref={listScrollContainerRef}
                    className={`${showMap ? 'overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-slate-200 flex-1' : ''}`}
                  >
                  <div
                    className={`grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 ${
                      showMap
                        ? 'xl:grid-cols-2 2xl:grid-cols-2'
                        : 'md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                    }`}
                  >
                    {isLoading ? (
                      /* Airbnb-Style Card Skeletons matching exact layout */
                      Array.from({ length: showMap ? 6 : 10 }).map((_, index) => (
                        <div key={`skeleton-${index}`} className="flex flex-col justify-between animate-pulse select-none">
                          <div className="w-full">
                            {/* Card Image Skeleton */}
                            <div className="relative aspect-[16/9] w-full rounded-[20px] bg-slate-200" />

                            {/* Badges / Details Skeleton */}
                            <div className="pt-3 px-0 pb-0 space-y-2.5">
                              {/* Pill Badges placeholder */}
                              <div className="flex items-center gap-3">
                                <div className="h-3 w-14 bg-slate-200 rounded-full" />
                                <div className="h-3 w-10 bg-slate-200 rounded-full" />
                                <div className="h-3 w-14 bg-slate-200 rounded-full" />
                              </div>

                              {/* Title line placeholder */}
                              <div className="h-4 w-3/4 bg-slate-200 rounded-full" />

                              {/* Rating placeholder */}
                              <div className="flex items-center gap-1.5">
                                <div className="h-3 w-20 bg-slate-200 rounded-full" />
                                <div className="h-3 w-12 bg-slate-200/80 rounded-full" />
                              </div>
                            </div>
                          </div>

                          {/* Footer Price & CTA placeholder */}
                          <div className="pt-3 px-0 pb-1 flex items-center justify-between">
                            <div className="h-4 w-20 bg-slate-200 rounded-full" />
                            <div className="h-7 w-20 bg-slate-200 rounded-full" />
                          </div>
                        </div>
                      ))
                    ) : filteredTurfs.length === 0 ? (
                      <div className="col-span-full py-8 px-6 text-center space-y-4">
                        <div className="mx-auto flex items-center justify-center">
                          <img
                            src="/empty-search.png"
                            alt="No futsal arenas found"
                            className="h-48 w-auto object-contain mx-auto select-none"
                            loading="eager"
                          />
                        </div>
                        <div className="space-y-2.5">
                          <h3 className="text-base font-bold text-slate-900">No Futsal Arenas in This Area</h3>
                          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                            Pan the map or adjust filters to explore available arenas in Kathmandu & Lalitpur.
                          </p>
                          <div>
                            <button
                              type="button"
                              onClick={handleResetMap}
                              className="text-xs font-bold text-lime-600 hover:text-lime-700 underline underline-offset-2 hover:underline-offset-4 transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              Reset to original map view
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      paginatedTurfs.map((turf) => {
                        const isHoveredFromMap = hoveredFromMapId === turf.id;
                        return (
                          <div
                            key={turf.id}
                            data-turf-id={turf.id}
                            onClick={() => {
                              setSelectedMapTurf(turf);
                              onSelectTurf?.(turf);
                            }}
                            onMouseEnter={() => setHoveredFromListId(turf.id)}
                            onMouseLeave={() => setHoveredFromListId(null)}
                            className={`group flex flex-col justify-between bg-white cursor-pointer select-none rounded-[22px] transition-all duration-200 ${
                              isHoveredFromMap ? 'animate-turf-blink' : ''
                            }`}
                          >
                          <div className="w-full">
                            {/* Card Image with rounded corners */}
                            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-slate-100">
                              <img
                                src={turf.image}
                                alt={turf.title}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/image.png';
                                }}
                              />
                            </div>

                            {/* Text details flush with left edge */}
                            <div className="pt-3 px-0 pb-0">
                              {/* Badges / Features line */}
                              <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                                {turf.type && (
                                  <span className="flex items-center gap-1">
                                    <Compass className="h-3.5 w-3.5 text-slate-400" />
                                    {turf.type}
                                  </span>
                                )}
                                {turf.size && (
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5 text-slate-400" />
                                    {turf.size}
                                  </span>
                                )}
                                {turf.parking && (
                                  <span className="flex items-center gap-1">
                                    <Car className="h-3.5 w-3.5 text-slate-400" />
                                    {turf.parking}
                                  </span>
                                )}
                              </div>

                              {/* Title */}
                              <h3 className="mt-2 text-base font-bold text-slate-900 group-hover:text-lime-600 transition-colors truncate">
                                {turf.title}
                              </h3>

                              {/* Rating */}
                              <div className="mt-1 flex items-center gap-1 text-xs">
                                <div className="flex text-lime-400">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="h-4 w-4 fill-lime-400 text-lime-400"
                                    />
                                  ))}
                                </div>
                                <span className="ml-1 text-xs font-semibold text-slate-600">
                                  {turf.rating} ({turf.reviews})
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Footer: Price & CTA flush with left edge */}
                          <div className="pt-3 px-0 pb-1 flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-600">
                              {turf.price}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {onNavigateRoute && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigateRoute(turf);
                                  }}
                                  title="Get Directions"
                                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-lime-100 hover:text-lime-800 text-slate-700 transition-all active:scale-95 cursor-pointer"
                                >
                                  <Navigation className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectTurf?.(turf);
                                }}
                                className="rounded-full bg-lime-400 px-4 py-2 text-xs font-bold text-slate-900 transition-all hover:bg-lime-500 active:scale-95 cursor-pointer"
                              >
                                Book Now
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  </div>

                  {/* ─── PAGINATION CONTROLS (NEON THEME) ─── */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-6 pb-2 border-t border-slate-100 mt-6">
                      <p className="text-xs font-medium text-slate-500">
                        Showing{' '}
                        <span className="font-bold text-slate-900">
                          {(currentPage - 1) * itemsPerPage + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-bold text-slate-900">
                          {Math.min(currentPage * itemsPerPage, filteredTurfs.length)}
                        </span>{' '}
                        of{' '}
                        <span className="font-bold text-slate-900">
                          {filteredTurfs.length}
                        </span>{' '}
                        arenas
                      </p>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="h-8 w-8 rounded-full bg-slate-100 hover:bg-lime-100 flex items-center justify-center text-slate-700 hover:text-slate-950 disabled:opacity-30 disabled:hover:bg-slate-100 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>

                        {[...Array(totalPages)].map((_, idx) => {
                          const pageNum = idx + 1;
                          const isActive = currentPage === pageNum;
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => setCurrentPage(pageNum)}
                              className={`h-8 w-8 rounded-full text-xs font-black transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-lime-400 text-slate-950'
                                  : 'text-slate-600 bg-slate-100 hover:bg-lime-50 hover:text-slate-900'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="h-8 w-8 rounded-full bg-slate-100 hover:bg-lime-100 flex items-center justify-center text-slate-700 hover:text-slate-950 disabled:opacity-30 disabled:hover:bg-slate-100 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            </div>
        </main>

        {/* Floating Mobile Map Switcher Button */}
        <div className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2 rounded-full bg-slate-950 text-white px-5 py-3 text-xs font-bold shadow-xl border border-slate-800 active:scale-95 transition-all"
          >
            <Map className="h-4 w-4 text-lime-400" />
            <span>{showMap ? 'Show List' : 'Show Map'}</span>
          </button>
        </div>

        {/* ─── FILTERS SIDEBAR DRAWER (SLIDE-OVER FROM RIGHT) ─── */}
        {/* Backdrop */}
        <div
          onClick={() => setFilterModalOpen(false)}
          className={`fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 ${
            filterModalOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Sidebar Drawer Container */}
        <aside
          className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out border-l border-slate-100 ${
            filterModalOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-label="Filter sidebar"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight">Filters</h2>
                <p className="text-[11px] text-slate-400 font-medium">Refine futsal arena results</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFilterModalOpen(false)}
              className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body: Scrollable filters */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin scrollbar-thumb-slate-200">
            {/* Court Type */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Court Type
              </h3>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { name: 'Indoor', icon: Building2 },
                  { name: 'Outdoor', icon: Sun },
                  { name: 'Rooftop', icon: CloudSun },
                ].map(({ name, icon: Icon }) => {
                  const active = selectedTypes.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleTypeToggle(name)}
                      className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? 'border-lime-400 bg-lime-50/60 text-slate-900 shadow-2xs'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${active ? 'text-lime-600' : 'text-slate-400'}`} />
                      <span>{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Match Size */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Match Format
              </h3>
              <div className="grid grid-cols-3 gap-2.5">
                {['5v5', '7v7', '9v9'].map((size) => {
                  const active = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? 'border-lime-400 bg-lime-50/60 text-slate-900 shadow-2xs'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Max Price Range */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Max Price / Hour
                </h3>
                <span className="text-sm font-black text-slate-900 font-mono">
                  NPR {maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="3000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-lime-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
                <span>NPR 500</span>
                <span>NPR 3,000</span>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Amenities & Facilities
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {amenitiesList.map((amenity) => {
                  const active = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        active
                          ? 'border-lime-400 bg-lime-50/50 text-slate-900'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>{amenity}</span>
                      <span
                        className={`h-4 w-4 rounded flex items-center justify-center ${
                          active ? 'bg-lime-400 text-slate-950' : 'border border-slate-300'
                        }`}
                      >
                        {active && <Check className="h-3 w-3 stroke-[3]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions (Sticky at bottom of sidebar) */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/70 shrink-0">
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 underline underline-offset-4 cursor-pointer"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => setFilterModalOpen(false)}
              className="rounded-full bg-lime-400 hover:bg-lime-500 px-6 py-2.5 text-xs font-black text-slate-950 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              Show {filteredTurfs.length} {filteredTurfs.length === 1 ? 'Arena' : 'Arenas'}
            </button>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}

