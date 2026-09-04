import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function BookingStatus() {
  const data = [
    { name: 'Confirmed', value: 652, color: '#10b981' },
    { name: 'Pending', value: 182, color: '#f59e0b' },
    { name: 'Completed', value: 276, color: '#8b5cf6' },
    { name: 'Cancelled', value: 98, color: '#6b7280' },
    { name: 'No-show', value: 40, color: '#ef4444' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const percentages = data.map((item) => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1),
  }));

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <h3 className="text-base font-bold text-slate-900 mb-5">Booking Status</h3>

      {/* Donut Chart */}
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={percentages}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={2}
            dataKey="value"
          >
            {percentages.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center Text */}
      <div className="text-center -mt-16 mb-4">
        <p className="text-2xl font-bold text-slate-900">{total.toLocaleString()}</p>
        <p className="text-xs text-slate-600">Total</p>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {percentages.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-slate-600">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">{item.value.toLocaleString()}</span>
              <span className="text-slate-500">({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingStatus;
