import { Star, MoreVertical } from 'lucide-react';

function TopPerformingTurfs() {
  const turfs = [
    {
      id: 1,
      name: 'Green Arena',
      location: 'Andheri, Mumbai',
      sport: 'Football',
      bookings: 248,
      occupancy: '82%',
      revenue: '₹1,24,850',
      rating: 4.8,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Play Field 2',
      location: 'Bandra, Mumbai',
      sport: 'Cricket',
      bookings: 186,
      occupancy: '76%',
      revenue: '₹98,450',
      rating: 4.6,
      status: 'Active',
    },
    {
      id: 3,
      name: 'Victory Turf',
      location: 'Goregaon, Mumbai',
      sport: 'Football',
      bookings: 162,
      occupancy: '71%',
      revenue: '₹85,230',
      rating: 4.5,
      status: 'Active',
    },
    {
      id: 4,
      name: 'Elite Arena',
      location: 'Mazad, Mumbai',
      sport: 'Football',
      bookings: 142,
      occupancy: '65%',
      revenue: '₹72,500',
      rating: 4.4,
      status: 'Active',
    },
    {
      id: 5,
      name: 'City Ground',
      location: 'Borivali, Mumbai',
      sport: 'Cricket',
      bookings: 116,
      occupancy: '59%',
      revenue: '₹56,780',
      rating: 4.3,
      status: 'Active',
    },
  ];

  const getOccupancyColor = (occupancy) => {
    const value = parseInt(occupancy);
    if (value >= 80) return 'bg-green-100 text-green-700';
    if (value >= 60) return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900">Top Performing Turfs</h3>
        <button className="text-green-600 text-xs font-bold hover:text-green-700 transition-colors">
          View All Turfs
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-3 py-2.5 text-left text-xs font-bold text-slate-600 uppercase">Turf</th>
              <th className="px-3 py-2.5 text-left text-xs font-bold text-slate-600 uppercase">Location</th>
              <th className="px-3 py-2.5 text-left text-xs font-bold text-slate-600 uppercase">Sport</th>
              <th className="px-3 py-2.5 text-center text-xs font-bold text-slate-600 uppercase">Bookings</th>
              <th className="px-3 py-2.5 text-center text-xs font-bold text-slate-600 uppercase">Occupancy</th>
              <th className="px-3 py-2.5 text-left text-xs font-bold text-slate-600 uppercase">Revenue</th>
              <th className="px-3 py-2.5 text-center text-xs font-bold text-slate-600 uppercase">Rating</th>
              <th className="px-3 py-2.5 text-center text-xs font-bold text-slate-600 uppercase">Status</th>
              <th className="px-3 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {turfs.map((turf) => (
              <tr key={turf.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://images.unsplash.com/photo-${turf.id === 1 ? '1461896836934-ffe607ba8211' : turf.id === 2 ? '1461672713828-5fb3b1bfc890' : '1494790108377-be9c29b29330'}?w=40&h=40&fit=crop`}
                      alt={turf.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <span className="font-semibold text-slate-900 text-xs">{turf.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-xs text-slate-600">{turf.location}</td>
                <td className="px-3 py-3 text-xs text-slate-600">{turf.sport}</td>
                <td className="px-3 py-3 text-center text-xs font-semibold text-slate-900">{turf.bookings}</td>
                <td className="px-3 py-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: turf.occupancy }}
                      ></div>
                    </div>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getOccupancyColor(turf.occupancy)}`}>
                      {turf.occupancy}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3 text-xs font-semibold text-slate-900">{turf.revenue}</td>
                <td className="px-3 py-3 text-center">
                  <div className="flex items-center justify-center gap-0.5">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold text-slate-900">{turf.rating}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="inline-block px-2.5 py-0.5 text-xs font-bold text-green-700 bg-green-100 rounded-full">
                    {turf.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                    <MoreVertical size={14} className="text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopPerformingTurfs;
