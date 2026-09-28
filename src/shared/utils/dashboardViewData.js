import { getTodayNepalString, getNepalCurrentDateTime, parseSlotInterval, minutesToTime12 } from './dateTime';
import { getBookingDateStr, isActiveBooking, deriveBookingStatus } from './bookingStatus';
import { getPeriodRange, getPreviousRange, summarizeBookings, pctChange, paidAmount, addDays } from './dashboardStats';

const money = (n) => `NRs. ${Math.round(Number(n) || 0).toLocaleString()}`;
const customerName = (b) => b.customerSnapshot?.name || [b.user?.firstName, b.user?.lastName].filter(Boolean).join(' ') || b.teamName || 'Customer';
const customerKey = (b) => b.user?._id || b.user?.id || b.customerSnapshot?.email || b.customerSnapshot?.phone || customerName(b);
const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0,2).map((x)=>x[0]).join('').toUpperCase() || 'CU';
const avatarClasses = ['bg-lime-100 text-lime-700','bg-purple-100 text-purple-700','bg-rose-100 text-rose-700','bg-emerald-100 text-emerald-700','bg-slate-100 text-slate-600'];
const dateShort = (s) => { if (!s) return '—'; const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString('en-US',{month:'short',day:'numeric'}); };
const percent = (v) => v == null ? null : `${Math.abs(v)}%`;
const plural = (count, singular, pluralForm = `${singular}s`) => `${count} ${count === 1 ? singular : pluralForm}`;
const inRange = (date, range) => !range || (date && date >= range.start && date <= range.end);
const formatRange = (range) => range ? `${dateShort(range.start)} – ${dateShort(range.end)}` : 'All time';

const effectiveRange = (bookings, range) => {
  if (range) return range;
  const dates = bookings.map(getBookingDateStr).filter(Boolean).sort();
  return dates.length ? { start: dates[0], end: dates[dates.length - 1], days: 1 } : null;
};

const chartBuckets = (bookings, range) => {
  const resolved = effectiveRange(bookings, range);
  if (!resolved) return [];
  const start = new Date(`${resolved.start}T00:00:00Z`);
  const end = new Date(`${resolved.end}T00:00:00Z`);
  const days = Math.round((end - start) / 86400000) + 1;
  // Keep normal dashboard date ranges truly daily. RevenueOverview handles
  // visual density with horizontal scrolling instead of merging calendar days.
  // Very large all-time ranges remain bounded to avoid rendering hundreds of columns.
  const bucketCount = days <= 62 ? days : Math.min(12, days);
  return Array.from({ length: bucketCount }, (_, index) => {
    const fromOffset = Math.floor((index * days) / bucketCount);
    const toOffset = Math.floor(((index + 1) * days) / bucketCount) - 1;
    const from = addDays(resolved.start, fromOffset);
    const to = addDays(resolved.start, Math.max(fromOffset, toOffset));
    const items = bookings.filter((b) => isActiveBooking(b) && inRange(getBookingDateStr(b), { start: from, end: to }));
    const dailyParts = from === to ? dateShort(from).split(' ') : null;
    return {
      day: dailyParts ? dailyParts[0] : `${dateShort(from)}–${dateShort(to)}`,
      date: dailyParts ? dailyParts[1] : '',
      online: items.filter((b) => b.paymentMethod !== 'Pay at Venue').reduce((sum,b)=>sum+paidAmount(b),0),
      venue: items.filter((b) => b.paymentMethod === 'Pay at Venue').reduce((sum,b)=>sum+paidAmount(b),0),
      isToday: from === getTodayNepalString() && to === from,
    };
  });
};

const heatmapRows = (bookings, range) => {
  const heatTimes = [360,540,720,900,1080,1260,0];
  const filtered = bookings.filter((b) => isActiveBooking(b) && inRange(getBookingDateStr(b), range));
  return heatTimes.map((min) => ({
    time: minutesToTime12(min).replace(':00',''),
    values: Array.from({ length: 7 }, (_, weekday) => {
      const count = filtered.filter((b) => {
        const date = getBookingDateStr(b);
        if (!date) return false;
        const jsDay = new Date(`${date}T00:00:00Z`).getUTCDay();
        const mondayIndex = (jsDay + 6) % 7;
        const start = b.startMinutes ?? parseSlotInterval(b.timeSlot).startMinutes;
        return mondayIndex === weekday && Math.floor(start / 180) * 180 === Math.floor(min / 180) * 180;
      }).length;
      return count === 0 ? 0 : count <= 1 ? 1 : count <= 2 ? 2 : 3;
    }),
  }));
};

export function buildDashboardViewData({ bookings = [], venues = [], customers = [], reviews = [], period = 'month', customRange = null }) {
  const venue = venues[0] || null;
  const range = getPeriodRange(period, undefined, customRange);
  const previousRange = getPreviousRange(period, undefined, customRange);
  const current = summarizeBookings(bookings, range, { venues });
  const previous = summarizeBookings(bookings, previousRange, { venues });
  const currentCustomers = new Set(current.inPeriod.map(customerKey).filter(Boolean));
  const previousCustomers = new Set(previous.inPeriod.map(customerKey).filter(Boolean));
  const comparison = previousRange ? `vs. previous period (${formatRange(previousRange)})` : 'All-time total';
  const periodText = range ? 'in this period' : 'across all time';
  const stats = [
    { title:'Total Revenue', value:money(current.revenue), change:percent(pctChange(current.revenue, previous.revenue)), subtext:comparison },
    { title:'Total Bookings', value:String(current.bookings), change:percent(pctChange(current.bookings, previous.bookings)), subtext:`${plural(current.bookings, 'booking')} ${periodText}` },
    { title:'Court Occupancy', value:current.occupancy == null ? '0%' : `${current.occupancy}%`, change:percent(pctChange(current.occupancy || 0, previous.occupancy || 0)), subtext:range ? `Occupancy ${periodText}` : `${venue?.courts?.length || 0} courts configured` },
    { title:'Total Customers', value:String(currentCustomers.size), change:percent(pctChange(currentCustomers.size, previousCustomers.size)), subtext:`${plural(currentCustomers.size, 'customer')} ${periodText}` },
  ];

  const revenueData = chartBuckets(bookings, range);
  const revenueChange = previousRange ? pctChange(current.revenue, previous.revenue) : null;
  const heatRows = heatmapRows(bookings, range);

  const today = getTodayNepalString();
  const now = getNepalCurrentDateTime();
  const todayIncluded = !range || inRange(today, range);
  const todays = todayIncluded ? bookings.filter((b)=>getBookingDateStr(b)===today).sort((a,b)=>(a.startMinutes ?? parseSlotInterval(a.timeSlot).startMinutes)-(b.startMinutes ?? parseSlotInterval(b.timeSlot).startMinutes)) : [];
  const schedule = todays.slice(0,5).map((b,i)=>{
    const slot=parseSlotInterval(b.timeSlot); const start=b.startMinutes ?? slot.startMinutes; const end=b.endMinutes ?? slot.endMinutes;
    const lifecycle = deriveBookingStatus(b);
    let status = lifecycle;
    if (lifecycle === 'Confirmed') status = start <= now.minutes && end > now.minutes ? 'In Progress' : end <= now.minutes ? 'Completed' : 'Confirmed';
    return { id:b._id||b.id||i, time:`${minutesToTime12(start)} – ${minutesToTime12(end)}`, customer:customerName(b), court:b.court?.name||'Court', status };
  });

  const recentBookings = bookings.filter(b => inRange(getBookingDateStr(b), range)).sort((a,b)=>new Date(b.createdAt||b.date)-new Date(a.createdAt||a.date)).slice(0,5).map((b,i)=>({ id:b._id||b.id||i, initials:initials(customerName(b)), customer:customerName(b), court:b.court?.name||'Court', date:dateShort(getBookingDateStr(b)), time:b.timeSlot||'—', amount:money(b.totalAmount), status:deriveBookingStatus(b), avatarUrl:b.user?.profilePicture || b.customerSnapshot?.profilePicture || '', avatarClass:avatarClasses[i%avatarClasses.length] }));

  const grouped = new Map(); current.inPeriod.filter(isActiveBooking).forEach(b=>{ const key=customerKey(b); if(!key)return; const item=grouped.get(key)||{name:customerName(b),bookings:0,amount:0,first:getBookingDateStr(b),walkIn:!b.user}; item.bookings++; item.amount+=paidAmount(b); const ds=getBookingDateStr(b); if(ds && (!item.first||ds<item.first))item.first=ds; grouped.set(key,item); });
  const allCustomerRows=[...grouped.values()];
  const insightValues=[allCustomerRows.filter(c=>c.bookings===1).length,allCustomerRows.filter(c=>c.bookings>1).length,allCustomerRows.filter(c=>c.walkIn).length];
  const insightTotal=insightValues.reduce((a,b)=>a+b,0);
  const labels=['New Customers','Returning Customers','Walk-ins']; const colors=['#8DE600','#08B77B','#2494E8'];
  const insights=labels.map((label,i)=>({label,value:insightValues[i],percentage:insightTotal?Math.round(insightValues[i]/insightTotal*100):0,color:colors[i]}));
  const topCustomers=allCustomerRows.sort((a,b)=>b.amount-a.amount||b.bookings-a.bookings).slice(0,3).map((c,i)=>({id:i+1,rank:i+1,name:c.name,bookings:c.bookings,amount:money(c.amount),logoBg:i===1?'bg-amber-50':'bg-slate-100',logoColor:i===1?'text-amber-700':'text-slate-700'}));
  const recentReviews=[...reviews].filter((r)=>!range || inRange(String(r.createdAt || r.date || '').slice(0,10), range)).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,2).map((r,i)=>({id:r.id||r._id||i,name:r.name,initials:initials(r.name),rating:Number(r.rating),date:r.date||'',review:r.comment||'',avatarUrl:r.avatar||'',avatar:avatarClasses[(i+1)%avatarClasses.length]}));
  return { stats, revenue:{ data:revenueData,total:current.revenue,change:revenueChange,subtext:comparison }, heatRows, schedule, recentBookings, insights, topCustomers, recentReviews, customersCount:customers.length };
}
