import { ArrowRight, Star, Compass, Users, Car } from 'lucide-react';

const turfs = [
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
    image:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'Great Himalayan Futsal is one of the premier indoor futsal arenas in Lalitpur, offering professional-grade artificial turf and world-class facilities. Perfect for both casual players and competitive leagues, our arena features floodlit courts, comfortable seating for spectators, and a fully stocked canteen. Whether you\'re organizing a friendly match or a corporate tournament, we provide the ideal environment for your game.',
    location: 'Hattiban, Lalitpur',
    address: 'Hattiban Rd, Ward 22, Lalitpur Metropolitan City, Bagmati Province, Nepal',
    surface: 'Artificial Grass',
    dimensions: '40m × 20m',
    amenities: ['Parking', 'WiFi', 'Washrooms', 'Changing Rooms', 'Canteen', 'First Aid', 'Floodlights', 'Drinking Water'],
    operatingHours: [
      { day: 'Sunday – Thursday', hours: '6:00 AM – 10:00 PM' },
      { day: 'Friday', hours: '6:00 AM – 11:00 PM' },
      { day: 'Saturday', hours: '7:00 AM – 11:00 PM' },
    ],
    courts: [
      { name: 'Court A — Main Arena', type: 'Indoor', size: '7v7', price: 'NPR 800/hr' },
      { name: 'Court B — Training Pitch', type: 'Indoor', size: '5v5', price: 'NPR 600/hr' },
    ],
    phone: '+977-9841-234567',
    email: 'info@greathimalayan.com',
    policies: [
      { title: 'Cancellation Policy', description: 'Free cancellation before 6 hours of the booked time. 25% charge for refunds after booking hours.' },
      { title: 'House Rules', description: 'Whatever Shoes are allowed No metal studs. Players can bring their own sportswear.' },
      { title: 'Refund Policy', description: 'Full refund issued within 1-3 business days for eligible cancellations. Rain-outs are fully refunded.' },
    ],
    reviewsList: [
      { name: 'Saugat Shahi', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', rating: 5, date: '2 weeks ago', comment: 'Excellent turf quality and the staff is very helpful. Booking through Turfio was super smooth!' },
      { name: 'Rohan Tamang', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', rating: 5, date: '1 month ago', comment: 'Best futsal arena in Lalitpur hands down. The floodlights are great for evening games.' },
      { name: 'Anish Karki', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', rating: 4, date: '3 weeks ago', comment: 'Great facilities, decent parking. Would love if they extended hours on weekdays.' },
    ],
  },
  {
    id: 2,
    title: 'Prime Futsal Kathmandu',
    type: 'Indoor',
    size: '7v7',
    parking: 'Parking',
    rating: 4.2,
    reviews: 511,
    price: 'NPR 1,200/hr',
    priceVal: 1200,
    image:
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'Prime Futsal Kathmandu is the city\'s most popular indoor futsal venue, trusted by thousands of regular players. Located in the heart of Kathmandu, we offer premium quality courts with FIFA-approved artificial grass, climate-controlled environment, and top-notch amenities including a canteen, locker rooms, and free WiFi. Our state-of-the-art booking system ensures you never miss a slot.',
    location: 'Baneshwor, Kathmandu',
    address: 'New Baneshwor, Ward 10, Kathmandu Metropolitan City, Bagmati Province, Nepal',
    surface: 'FIFA-Approved Artificial Turf',
    dimensions: '42m × 22m',
    amenities: ['Parking', 'WiFi', 'Washrooms', 'Changing Rooms', 'Canteen', 'First Aid', 'Floodlights', 'Drinking Water', 'Locker Rooms'],
    operatingHours: [
      { day: 'Sunday – Friday', hours: '5:30 AM – 10:30 PM' },
      { day: 'Saturday', hours: '6:00 AM – 11:00 PM' },
    ],
    courts: [
      { name: 'Court 1 — Pro Arena', type: 'Indoor', size: '7v7', price: 'NPR 1,200/hr' },
      { name: 'Court 2 — Standard Pitch', type: 'Indoor', size: '5v5', price: 'NPR 900/hr' },
      { name: 'Court 3 — Mini Court', type: 'Indoor', size: '3v3', price: 'NPR 500/hr' },
    ],
    phone: '+977-9801-987654',
    email: 'bookings@primefutsal.com',
    policies: [
      { title: 'Cancellation Policy', description: 'Free cancellation up to 3 hours before your booking. No refund for no-shows.' },
      { title: 'House Rules', description: 'Futsal shoes mandatory. No outside food or beverages. Teams must report 10 minutes before scheduled time.' },
      { title: 'Refund Policy', description: 'Refunds processed within 5-7 business days. Weather-related cancellations receive full credit for future bookings.' },
    ],
    reviewsList: [
      { name: 'Pooja Shrestha', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', rating: 5, date: '1 week ago', comment: 'Amazing pitch quality. The staff always keeps the courts in perfect condition.' },
      { name: 'Bibek Thapa', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', rating: 4, date: '2 weeks ago', comment: 'Great location and facilities. Slightly pricey but worth every rupee for the quality.' },
      { name: 'Saugat Shahi', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', rating: 4, date: '1 month ago', comment: 'Love playing here! The canteen food is a bonus after a tiring match.' },
    ],
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
    image:
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'The Ultimate Kick-Off brings outdoor futsal to life in Bhaktapur. Experience the thrill of playing under open skies on our professionally maintained natural-feel turf. Our venue is perfect for those who prefer the outdoor game experience, with excellent drainage for all-weather play, bright floodlights for night matches, and ample parking space. A favorite among local teams and weekend warriors alike.',
    location: 'Suryabinayak, Bhaktapur',
    address: 'Suryabinayak Municipality, Ward 5, Bhaktapur District, Bagmati Province, Nepal',
    surface: 'Natural-Feel Artificial Turf',
    dimensions: '38m × 18m',
    amenities: ['Parking', 'Washrooms', 'Floodlights', 'Drinking Water', 'First Aid', 'Spectator Seating'],
    operatingHours: [
      { day: 'Sunday – Friday', hours: '6:00 AM – 9:00 PM' },
      { day: 'Saturday', hours: '6:00 AM – 10:00 PM' },
    ],
    courts: [
      { name: 'Main Outdoor Pitch', type: 'Outdoor', size: '7v7', price: 'NPR 900/hr' },
    ],
    phone: '+977-9812-345678',
    email: 'play@ultimatekickoff.com',
    policies: [
      { title: 'Cancellation Policy', description: 'Free cancellation up to 4 hours before the booking. 50% charge within 4 hours.' },
      { title: 'House Rules', description: 'Appropriate sports footwear required. No smoking on premises. Players under 16 must be accompanied by an adult.' },
      { title: 'Refund Policy', description: 'Full refund for weather cancellations. Standard cancellations refunded within 3 business days.' },
    ],
    reviewsList: [
      { name: 'Rohan Tamang', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', rating: 4, date: '3 days ago', comment: 'Great outdoor experience! The turf is well-maintained and drainage is excellent even after rain.' },
      { name: 'Anish Karki', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', rating: 4, date: '1 week ago', comment: 'Love the open-air feel. Floodlights are bright enough for evening games. Good value for money.' },
    ],
  },
];

export default function TurfSection({ onBookNow, onViewDetails }) {
  return (
    <section className="bg-white pt-12 pb-14 lg:pt-14 lg:pb-16">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-8">
          {/* Left Column: Heading & Info */}
          <div className="flex flex-col justify-center lg:col-span-3 lg:pt-2">
            <span className="text-sm font-semibold text-lime-500">
              Top rated turfs
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl lg:leading-[1.15]">
              Popular Turfs Near You
            </h2>
            <p className="mt-3 text-sm font-medium text-slate-500 sm:text-base">
              Your go-to futsal companion for life.
            </p>
            <div className="mt-6">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm font-semibold text-lime-500 transition-colors hover:text-lime-600"
              >
                View case study
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Turf Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-3">
            {turfs.map((turf) => (
              <div
                key={turf.id}
                onClick={() => onViewDetails?.(turf)}
                className="group flex flex-col justify-between bg-white cursor-pointer"
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
                      <span className="flex items-center gap-1">
                        <Compass className="h-3.5 w-3.5 text-slate-400" />
                        {turf.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        {turf.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <Car className="h-3.5 w-3.5 text-slate-400" />
                        {turf.parking}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-2 text-base font-bold text-slate-900 group-hover:text-lime-600 transition-colors">
                      {turf.title}
                    </h3>

                    {/* Rating */}
                    <div className="mt-1 flex items-center gap-1">
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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails?.(turf);
                    }}
                    className="rounded-full bg-lime-400 px-5 py-2 text-xs font-bold text-slate-900 transition-all hover:bg-lime-500 active:scale-95"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
