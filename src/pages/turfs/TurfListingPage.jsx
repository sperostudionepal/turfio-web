import { useState } from 'react';
import {
  Users,
  Car,
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  Star,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const initialTurfs = [
  {
    id: 1,
    title: 'Great Himalayan Futsal',
    type: 'Indoor',
    size: '7v7',
    parking: 'Parking',
    rating: 4.5,
    reviews: 321,
    price: 'NPR 800/hr',
    priceVal: 800,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'WiFi', 'Washrooms', 'Changing Rooms'],
    location: 'Hattiban, Lalitpur',
  },
  {
    id: 2,
    title: 'Prime Futsal Kathmandu',
    type: 'Indoor',
    size: '5v5',
    parking: 'Parking',
    rating: 4.2,
    reviews: 511,
    price: 'NPR 1,200/hr',
    priceVal: 1200,
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'WiFi', 'Washrooms', 'Changing Rooms', 'Canteen'],
    location: 'Kathmandu',
  },
  {
    id: 3,
    title: 'The Ultimate Kick-Off',
    type: 'Outdoor',
    size: '7v7',
    parking: 'Parking',
    rating: 4.1,
    reviews: 91,
    price: 'NPR 900/hr',
    priceVal: 900,
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'Washrooms', 'First Aid'],
    location: 'Hattiban, Lalitpur',
  },
  {
    id: 4,
    title: 'Velocity Arena Futsal',
    type: 'Rooftop',
    size: '5v5',
    parking: 'Parking',
    rating: 4.7,
    reviews: 145,
    price: 'NPR 1,500/hr',
    priceVal: 1500,
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=80',
    amenities: ['WiFi', 'Washrooms', 'AC', 'Canteen', 'Sports Equipment'],
    location: 'Lalitpur',
  },
  {
    id: 5,
    title: 'Chitwan Sports Hub',
    type: 'Outdoor',
    size: '9v9',
    parking: 'Parking',
    rating: 4.6,
    reviews: 87,
    price: 'NPR 2,000/hr',
    priceVal: 2000,
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=800&q=80',
    amenities: ['Parking', 'Washrooms', 'Changing Rooms', 'First Aid'],
    location: 'Chitwan',
  },
];

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

export default function TurfListingPage({
  user,
  onLogin,
  onLogout,
  onListTurf,
  onHome,
  onSelectTurf,
}) {
  // Search parameters
  const [searchLocation, setSearchLocation] = useState('Lalitpur');
  const [searchDate, setSearchDate] = useState('2086-04-13');
  const [searchTime, setSearchTime] = useState('09:00');
  const [searchPlayers, setSearchPlayers] = useState('Random');

  // Sidebar filters
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Sorting
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'price-low', 'price-high'

  // Mobile filters visibility toggle
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Toggle filter lists
  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedSizes([]);
    setMaxPrice(2500);
    setSelectedAmenities([]);
  };

  // Filter & Sort Logic
  const filteredTurfs = initialTurfs
    .filter((turf) => {
      // Location match
      const locMatch =
        !searchLocation ||
        turf.title.toLowerCase().includes(searchLocation.toLowerCase()) ||
        turf.location.toLowerCase().includes(searchLocation.toLowerCase());

      // Type match
      const typeMatch =
        selectedTypes.length === 0 || selectedTypes.includes(turf.type);

      // Size match
      const sizeMatch =
        selectedSizes.length === 0 || selectedSizes.includes(turf.size);

      // Price match
      const priceMatch = turf.priceVal <= maxPrice;

      // Amenities match
      const amenitiesMatch =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) => turf.amenities.includes(amenity));

      return locMatch && typeMatch && sizeMatch && priceMatch && amenitiesMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.priceVal - b.priceVal;
      if (sortBy === 'price-high') return b.priceVal - a.priceVal;
      return 0;
    });

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      <Navbar
        onLogin={onLogin}
        user={user}
        onLogout={onLogout}
        onListTurf={onListTurf}
        onHome={onHome}
      />

      {/* Top Search Bar Header Panel */}
      <section className="bg-slate-50 border-b border-slate-100 py-6">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="rounded-[24px] bg-white p-2.5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] ring-1 ring-slate-100/80">
            <div className="flex flex-col items-stretch divide-y divide-slate-100 lg:divide-y-0 lg:flex-row lg:items-center">
              {/* Location Input */}
              <label className="group flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50 focus-within:bg-slate-50">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-focus-within:bg-lime-100 group-focus-within:text-lime-600 transition-colors">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-medium text-slate-400">Location</span>
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Search city/area"
                    className="mt-0.5 w-full border-0 bg-transparent p-0 text-[14px] font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </span>
              </label>

              <div className="hidden h-8 w-px bg-slate-200 lg:block" />

              {/* Date Input */}
              <label className="group relative flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50 focus-within:bg-slate-50">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-focus-within:bg-lime-100 group-focus-within:text-lime-600 transition-colors">
                  <Calendar className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-medium text-slate-400">Date</span>
                  <span className="mt-0.5 block text-[14px] font-semibold text-slate-900">{searchDate}</span>
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </label>

              <div className="hidden h-8 w-px bg-slate-200 lg:block" />

              {/* Time Input */}
              <label className="group relative flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50 focus-within:bg-slate-50">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-focus-within:bg-lime-100 group-focus-within:text-lime-600 transition-colors">
                  <Clock className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-medium text-slate-400">Time</span>
                  <span className="mt-0.5 block text-[14px] font-semibold text-slate-900">{searchTime}</span>
                  <input
                    type="time"
                    value={searchTime}
                    onChange={(e) => setSearchTime(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </label>

              <div className="hidden h-8 w-px bg-slate-200 lg:block" />

              {/* Players selection */}
              <label className="group flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50 focus-within:bg-slate-50">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-focus-within:bg-lime-100 group-focus-within:text-lime-600 transition-colors">
                  <Users className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-medium text-slate-400">Players</span>
                  <select
                    value={searchPlayers}
                    onChange={(e) => setSearchPlayers(e.target.value)}
                    className="mt-0.5 w-full appearance-none border-0 bg-transparent p-0 text-[14px] font-semibold text-slate-900 outline-none"
                  >
                    <option value="Random">Random</option>
                    <option value="5v5">5v5</option>
                    <option value="7v7">7v7</option>
                    <option value="9v9">9v9</option>
                  </select>
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listing Grid & Sidebar Layout */}
      <section className="mx-auto max-w-[1280px] px-6 py-8 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:items-start">
          
          {/* 1. Left Sidebar Filters (Desktop Viewport) */}
          <aside className="hidden lg:block space-y-6 sticky top-28 bg-white border border-slate-100 p-6 rounded-[24px]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-lime-500" /> Filters
              </h2>
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-slate-400 hover:text-lime-600 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            </div>

            <hr className="border-slate-100" />

            {/* Type Filter */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Court Type</h3>
              <div className="space-y-2">
                {['Indoor', 'Outdoor', 'Rooftop'].map((type) => (
                  <label key={type} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                      className="rounded border-slate-300 text-lime-500 focus:ring-lime-400 h-4 w-4 cursor-pointer"
                    />
                    <span>{type} Futsal</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Size Filter */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Match Size</h3>
              <div className="space-y-2">
                {['5v5', '7v7', '9v9'].map((size) => (
                  <label key={size} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => handleSizeToggle(size)}
                      className="rounded border-slate-300 text-lime-500 focus:ring-lime-400 h-4 w-4 cursor-pointer"
                    />
                    <span>{size} matches</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Price Range Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span>Max Price</span>
                <span className="text-lime-600 font-extrabold font-mono">NPR {maxPrice} / hr</span>
              </div>
              <input
                type="range"
                min="500"
                max="2500"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-lime-400"
              />
            </div>

            <hr className="border-slate-100" />

            {/* Amenities Filter */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Amenities</h3>
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {amenitiesList.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded border-slate-300 text-lime-500 focus:ring-lime-400 h-4 w-4 cursor-pointer"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* 2. Main Turf Listing Panel */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header controls & Mobile Filter button */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-sm font-semibold text-slate-500">
                Showing <span className="text-slate-900 font-bold">{filteredTurfs.length}</span> turfs match your search
              </p>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle Button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="inline-flex lg:hidden items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Filter className="h-3.5 w-3.5" /> Filters
                </button>

                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <span>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-slate-200 rounded-full px-3 py-1.5 text-slate-900 font-bold bg-white focus:outline-none focus:ring-1 focus:ring-lime-400 cursor-pointer"
                  >
                    <option value="rating">Best Rating</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredTurfs.length === 0 && (
              <div className="text-center py-16 bg-slate-50 rounded-[24px] border border-dashed border-slate-200">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">No Turfs Found</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">Try resetting your filters or adjusting search parameters.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-lime-400 px-5 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-lime-500 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Turf Grid Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTurfs.map((turf) => (
                <div
                  key={turf.id}
                  onClick={() => onSelectTurf?.(turf)}
                  className="group flex flex-col justify-between bg-white cursor-pointer"
                >
                  <div className="w-full">
                    {/* Card Image */}
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
                      <span className="absolute top-3 left-3 text-[10px] font-bold text-lime-600 bg-lime-50 px-2 py-0.5 rounded-full">
                        {turf.type}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="pt-3">
                      <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          {turf.size}
                        </span>
                        <span className="flex items-center gap-1">
                          <Car className="h-3.5 w-3.5 text-slate-400" />
                          {turf.parking}
                        </span>
                      </div>

                      <h3 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-lime-600 transition-colors truncate">
                        {turf.title}
                      </h3>

                      <div className="mt-1 flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 fill-lime-400 text-lime-400" />
                        <span className="text-xs font-semibold text-slate-800">
                          {turf.rating} ({turf.reviews})
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-400 font-semibold">{turf.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      {turf.price}
                    </span>
                    <button
                      type="button"
                      className="rounded-full bg-lime-400 hover:bg-lime-500 px-4 py-1.5 text-[11px] font-bold text-slate-900 transition-all active:scale-95 cursor-pointer"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mobile Filter Drawer Dialog */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-sm h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-lime-500" /> Filters
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <hr className="border-slate-100 my-4" />

              {/* Type Filter */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Court Type</h4>
                <div className="grid grid-cols-3 gap-2">
                  {['Indoor', 'Outdoor', 'Rooftop'].map((type) => {
                    const isSelected = selectedTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleTypeToggle(type)}
                        className={`py-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-lime-400 text-slate-900'
                            : 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <hr className="border-slate-100 my-5" />

              {/* Size Filter */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Match Size</h4>
                <div className="grid grid-cols-3 gap-2">
                  {['5v5', '7v7', '9v9'].map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`py-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-lime-400 text-slate-900'
                            : 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <hr className="border-slate-100 my-5" />

              {/* Price slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                  <span>Max Price</span>
                  <span className="text-lime-600 font-extrabold font-mono">NPR {maxPrice} / hr</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="2500"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-lime-400"
                />
              </div>

              <hr className="border-slate-100 my-5" />

              {/* Amenities */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Amenities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesList.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-semibold truncate transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-lime-400 text-slate-900 font-bold'
                            : 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-6 flex gap-3 border-t border-slate-100 mt-6">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 border border-slate-200 rounded-full text-xs font-bold text-slate-700 text-center cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold text-center cursor-pointer"
              >
                Apply Filters ({filteredTurfs.length})
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
