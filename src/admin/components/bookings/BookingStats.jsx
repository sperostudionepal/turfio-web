import StatCards from '../dashboard/StatCards';

function BookingStats({
  bookingsCount,
  cancelledCount,
  completedCount,
  confirmedCount,
  percentage,
}) {
  const stats = [
    { title: 'Total Bookings', value: bookingsCount, change: percentage(bookingsCount), subtext: 'All bookings', showTrendArrow: false },
    { title: 'Confirmed', value: confirmedCount, change: percentage(confirmedCount), subtext: 'of total bookings', showTrendArrow: false },
    { title: 'Completed', value: completedCount, change: percentage(completedCount), subtext: 'of total bookings', showTrendArrow: false },
    { title: 'Cancelled', value: cancelledCount, change: percentage(cancelledCount), subtext: 'of total bookings', showTrendArrow: false },
  ];
  return <StatCards stats={stats} />;
}

export default BookingStats;
