import { Calendar, CreditCard, UserPlus, MapPin, Star, Trash2 } from 'lucide-react';

function RecentActivity() {
  const activities = [
    {
      icon: Calendar,
      title: 'New booking created',
      description: '#BK-1266 at Green Arena',
      time: '2m ago',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Trash2,
      title: 'Booking cancelled',
      description: '#BK-1265 at Play Field 2',
      time: '15m ago',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: CreditCard,
      title: 'Payment received',
      description: '₹4,300 from Rahul Sharma',
      time: '25m ago',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: UserPlus,
      title: 'New customer registered',
      description: 'Sunset Arena',
      time: '2h ago',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: MapPin,
      title: 'New turf added',
      description: 'Sunset Arena by Manager',
      time: '3h ago',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: Star,
      title: 'Review submitted',
      description: 'Green Arena received a 5-star review',
      time: '3h ago',
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
        <button className="text-slate-600 text-xs font-bold hover:text-slate-900 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-start gap-3 pb-2.5 border-b border-slate-100 last:border-b-0">
              <div className={`${activity.color} p-2 rounded flex-shrink-0`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900">{activity.title}</p>
                <p className="text-xs text-slate-600 truncate">{activity.description}</p>
              </div>
              <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap ml-1">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentActivity;
