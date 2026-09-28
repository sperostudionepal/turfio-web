import { getTodayNepalString, getNepalCurrentDateTime, parseSlotInterval, minutesToTime12 } from './dateTime';
import { getBookingDateStr, isActiveBooking, deriveBookingStatus } from './bookingStatus';
import { getPeriodRange, getPreviousRange, summarizeBookings, pctChange, paidAmount, addDays, startOfWeek } from './dashboardStats';

const money = (n) => `NRs. ${Math.round(Number(n) || 0).toLocaleString()}`;
const customerName = (b) => b.customerSnapshot?.name || [b.user?.firstName, b.user?.lastName].filter(Boolean).join(' ') || b.teamName || 'Customer';
const customerKey = (b) => b.user?._id || b.user?.id || b.customerSnapshot?.email || b.customerSnapshot?.phone || customerName(b);
const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0,2).map((x)=>x[0]).join('').toUpperCase() || 'CU';
const avatarClasses = ['bg-lime-100 text-lime-700','bg-purple-100 text-purple-700','bg-rose-100 text-rose-700','bg-emerald-100 text-emerald-700','bg-slate-100 text-slate-600'];
const dateShort = (s) => { if (!s) return '—'; const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString('en-US',{month:'short',day:'numeric'}); };
const percent = (v) => v == null ? '0%' : `${Math.abs(v)}%`;

export function buildDashboardViewData({ bookings = [], venues = [], customers = [], reviews = [], period = 'month' }) {
  const venue = venues[0] || null;
  const range = getPeriodRange(period);
  const previousRange = getPreviousRange(period);
  const current = summarizeBookings(bookings, range, { venues });
  const previous = summarizeBookings(bookings, previousRange, { venues });
  const today = getTodayNepalString();
  const yesterday = addDays(today, -1);
  const todaySummary = summarizeBookings(bookings, { start: today, end: today }, { venues });
  const yesterdaySummary = summarizeBookings(bookings, { start: yesterday, end: yesterday }, { venues });
  const currentCustomers = new Set(current.inPeriod.map(customerKey).filter(Boolean));
  const previousCustomers = new Set(previous.inPeriod.map(customerKey).filter(Boolean));
  const stats = [
    { title:'Total Revenue', value:money(current.revenue), change:percent(pctChange(current.revenue, previous.revenue)), subtext:`vs. previous period (${money(previous.revenue)})` },
    { title:'Total Bookings', value:String(current.bookings), change:percent(pctChange(current.bookings, previous.bookings)), subtext:`vs. previous period (${previous.bookings})` },
    { title:'Court Occupancy', value:current.occupancy == null ? '0%' : `${current.occupancy}%`, change:percent(pctChange(current.occupancy || 0, previous.occupancy || 0)), subtext:`${venue?.courts?.length || 0} courts configured` },
    { title:'Total Customers', value:String(currentCustomers.size), change:percent(pctChange(currentCustomers.size, previousCustomers.size)), subtext:`${todaySummary.customers} customers today` },
  ];

  const weekStart = startOfWeek(today);
  const revenueData = Array.from({length:7}, (_,i) => {
    const date = addDays(weekStart, i);
    const dayBookings = bookings.filter(b => isActiveBooking(b) && getBookingDateStr(b) === date);
    return { day:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i], date:date.slice(-2), online:dayBookings.filter(b=>b.paymentMethod !== 'Pay at Venue').reduce((s,b)=>s+paidAmount(b),0), venue:dayBookings.filter(b=>b.paymentMethod === 'Pay at Venue').reduce((s,b)=>s+paidAmount(b),0), isToday: date === today };
  });

  const heatTimes = [360,540,720,900,1080,1260,0];
  const heatRows = heatTimes.map(min => ({ time: minutesToTime12(min).replace(':00',''), values: Array.from({length:7},(_,i)=> {
    const date=addDays(weekStart,i); const count=bookings.filter(b=>isActiveBooking(b)&&getBookingDateStr(b)===date&&Math.floor((b.startMinutes ?? parseSlotInterval(b.timeSlot).startMinutes)/180)*180===Math.floor(min/180)*180).length;
    return count === 0 ? 0 : count <= 1 ? 1 : count <= 2 ? 2 : 3;
  }) }));

  const now = getNepalCurrentDateTime();
  const todays = bookings.filter(b=>isActiveBooking(b)&&getBookingDateStr(b)===today).sort((a,b)=>(a.startMinutes ?? parseSlotInterval(a.timeSlot).startMinutes)-(b.startMinutes ?? parseSlotInterval(b.timeSlot).startMinutes));
  const schedule = todays.slice(0,5).map((b,i)=>{ const slot=parseSlotInterval(b.timeSlot); const start=b.startMinutes ?? slot.startMinutes; const end=b.endMinutes ?? slot.endMinutes; return { id:b._id||b.id||i, time:`${minutesToTime12(start)} – ${minutesToTime12(end)}`, customer:customerName(b), court:b.court?.name||'Court', status:start<=now.minutes&&end>now.minutes?'Ongoing':start>now.minutes?'Upcoming':'Available' }; });

  const courtBookings = todays;
  const courts = (venue?.courts || []).slice(0,4).map((court,i)=>{ const match=courtBookings.find(b=>String(b.court?.id)===String(court._id||court.id) && (b.endMinutes ?? parseSlotInterval(b.timeSlot).endMinutes)>now.minutes); const slot=match ? parseSlotInterval(match.timeSlot) : null; const start=match ? (match.startMinutes ?? slot.startMinutes) : null; const end=match ? (match.endMinutes ?? slot.endMinutes) : null; return { id:court._id||court.id||i, name:court.name||`Court ${i+1}`, type:`${court.matchType || '5v5'} · ${court.surface || 'Synthetic'}`, status:court.status==='Maintenance'?'Maintenance':match?(start<=now.minutes&&end>now.minutes?'In Use':'Upcoming'):'Available', time:match?`${minutesToTime12(start)} – ${minutesToTime12(end)}`:'—', customer:match?customerName(match):'', image:court.image || court.images?.[0] || venue?.image || venue?.images?.[0] || '' }; });

  const recentBookings = [...bookings].sort((a,b)=>new Date(b.createdAt||b.date)-new Date(a.createdAt||a.date)).slice(0,5).map((b,i)=>({ id:b._id||b.id||i, initials:initials(customerName(b)), customer:customerName(b), court:b.court?.name||'Court', date:dateShort(getBookingDateStr(b)), time:b.timeSlot||'—', amount:money(b.totalAmount), status:deriveBookingStatus(b), avatarUrl:b.user?.profilePicture || b.customerSnapshot?.profilePicture || '', avatarClass:avatarClasses[i%avatarClasses.length] }));

  const grouped = new Map(); bookings.filter(isActiveBooking).forEach(b=>{ const key=customerKey(b); if(!key)return; const item=grouped.get(key)||{name:customerName(b),bookings:0,amount:0,first:getBookingDateStr(b),walkIn:!b.user}; item.bookings++; item.amount+=paidAmount(b); const ds=getBookingDateStr(b); if(ds && (!item.first||ds<item.first))item.first=ds; grouped.set(key,item); });
  const allCustomerRows=[...grouped.values()];
  const monthRange=getPeriodRange('month');
  const insightValues=[
    allCustomerRows.filter(c=>c.first>=monthRange.start&&c.first<=monthRange.end).length,
    allCustomerRows.filter(c=>c.bookings>1).length,
    allCustomerRows.filter(c=>c.walkIn).length,
  ];
  const insightTotal=insightValues.reduce((a,b)=>a+b,0);
  const labels=['New Customers','Returning Customers','Walk-ins']; const colors=['#8DE600','#08B77B','#2494E8'];
  const insights=labels.map((label,i)=>({label,value:insightValues[i],percentage:insightTotal?Math.round(insightValues[i]/insightTotal*100):0,color:colors[i]}));
  const topCustomers=allCustomerRows.sort((a,b)=>b.amount-a.amount||b.bookings-a.bookings).slice(0,3).map((c,i)=>({id:i+1,rank:i+1,name:c.name,bookings:c.bookings,amount:money(c.amount),logoBg:i===1?'bg-amber-50':'bg-slate-100',logoColor:i===1?'text-amber-700':'text-slate-700'}));
  const recentReviews=[...reviews].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,2).map((r,i)=>({id:r.id||r._id||i,name:r.name,initials:initials(r.name),rating:Number(r.rating),date:r.date||'',review:r.comment||'',avatarUrl:r.avatar||'',avatar:avatarClasses[(i+1)%avatarClasses.length]}));
  return { stats, revenue:{ data:revenueData,total:todaySummary.revenue,change:pctChange(todaySummary.revenue,yesterdaySummary.revenue) ?? 0}, heatRows, schedule, courts, recentBookings, insights, topCustomers, recentReviews, customersCount:customers.length };
}
