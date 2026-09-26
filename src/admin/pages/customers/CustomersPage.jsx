import { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import { Users, Search, Plus, Download, X, UserCheck, DollarSign, CalendarDays, AlertCircle, Loader2 } from 'lucide-react';
import turfService from '../../../shared/services/turfService';

const money = (n) => `NRs. ${Math.round(Number(n || 0)).toLocaleString('en-IN')}`;
const csvCell = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;

function CustomersPage({ activeTab, setActiveTab, initialSearch = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [data, setData] = useState({ customers: [], stats: {}, pagination: { page: 1, pages: 1, total: 0, limit: 20 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });

  const load = useCallback(async (page = 1, search = searchQuery) => {
    setLoading(true); setError('');
    try {
      const result = await turfService.getOwnerCustomers({ page, limit: 20, search: search.trim() || undefined });
      setData(result || { customers: [], stats: {}, pagination: { page: 1, pages: 1, total: 0, limit: 20 } });
    } catch (e) { setError(e.message || 'Unable to load customers.'); }
    finally { setLoading(false); }
  }, [searchQuery]);

  useEffect(() => { const t = setTimeout(() => load(1, searchQuery), 250); return () => clearTimeout(t); }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const stats = useMemo(() => [
    ['Total Customers', data.stats?.totalCustomers || 0, Users, 'All booking contacts'],
    ['Returning Customers', data.stats?.returningCustomers || 0, UserCheck, '2+ completed bookings'],
    ['Booked This Month', data.stats?.bookedThisMonth || 0, CalendarDays, 'Latest booking this month'],
    ['Total Collected', money(data.stats?.totalCollected), DollarSign, 'Net recorded payments'],
  ], [data.stats]);

  const exportCsv = () => {
    const rows = [['Customer','Phone','Email','Bookings','Completed','Cancelled','Collected','Last booked'], ...data.customers.map(c => [c.name,c.phone,c.email,c.totalBookings,c.completedBookings,c.cancelledBookings,c.totalSpend,c.lastBookedAt || ''])];
    const blob = new Blob([rows.map(r => r.map(csvCell).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'turfio-customers.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const submitCustomer = async (e) => {
    e.preventDefault(); setSaving(true); setFormError('');
    try { await turfService.createOwnerCustomer(form); setIsAddModalOpen(false); setForm({ name:'', phone:'', email:'', notes:'' }); await load(1, searchQuery); }
    catch (e2) { setFormError(e2.message || 'Unable to create customer.'); }
    finally { setSaving(false); }
  };

  return <div className="flex flex-col h-screen bg-[#fdfefe] text-slate-900 font-sans antialiased overflow-hidden">
    <TopBar />
    <div className="flex flex-1 min-h-0"><Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h1 className="text-2xl font-black tracking-tight">Customers</h1><p className="text-sm text-slate-500 mt-1">Booking contacts, player relationships and customer value.</p></div>
          <div className="flex gap-2"><button onClick={exportCsv} disabled={!data.customers.length} className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold disabled:opacity-40 flex items-center gap-2"><Download size={16}/>Export</button><button onClick={()=>setIsAddModalOpen(true)} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold flex items-center gap-2"><Plus size={16}/>Add Customer</button></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">{stats.map(([title,value,Icon,caption])=><div key={title} className="bg-white rounded-2xl border border-slate-200 p-5"><div className="flex items-center gap-3"><div className="p-3 rounded-xl bg-slate-50 text-emerald-600"><Icon size={20}/></div><div><p className="text-xs font-semibold text-slate-500">{title}</p><p className="text-xl font-black mt-1">{value}</p></div></div><p className="text-xs text-slate-400 mt-4">{caption}</p></div>)}</div>
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100"><div className="relative max-w-md"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/><input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search name, email or phone..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-emerald-500"/></div></div>
          {loading ? <div className="py-20 flex justify-center text-slate-500"><Loader2 className="animate-spin mr-2"/>Loading customers…</div> : error ? <div className="m-5 p-4 rounded-xl bg-red-50 text-red-700 flex items-center gap-2"><AlertCircle size={18}/><span className="text-sm">{error}</span><button onClick={()=>load()} className="ml-auto font-bold">Retry</button></div> : !data.customers.length ? <div className="py-20 text-center"><Users size={30} className="mx-auto text-slate-300"/><h3 className="font-bold mt-3">No customers found</h3><p className="text-sm text-slate-500 mt-1">Customers appear from bookings, or you can add a contact manually.</p></div> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['Customer','Contact','Bookings','Completed','Collected','Last booked',''].map(x=><th key={x} className="text-left px-5 py-3 font-bold">{x}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{data.customers.map(c=><tr key={c.key} className="hover:bg-slate-50/70"><td className="px-5 py-4"><div className="font-bold">{c.name}</div><div className="text-xs text-slate-400">{c.registered ? 'Registered player' : 'Guest / venue contact'}</div></td><td className="px-5 py-4"><div>{c.phone || '—'}</div><div className="text-xs text-slate-400">{c.email || '—'}</div></td><td className="px-5 py-4 font-semibold">{c.totalBookings}</td><td className="px-5 py-4">{c.completedBookings}</td><td className="px-5 py-4 font-bold text-emerald-700">{money(c.totalSpend)}</td><td className="px-5 py-4 text-slate-500">{c.lastBookedAt || '—'}</td><td className="px-5 py-4"><button onClick={()=>setSelectedCustomer(c)} className="font-bold text-emerald-700">View</button></td></tr>)}</tbody></table></div>}
          <div className="px-5 py-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500"><span>{data.pagination?.total || 0} customers</span><div className="flex items-center gap-2"><button disabled={(data.pagination?.page||1)<=1} onClick={()=>load(data.pagination.page-1)} className="px-3 py-1.5 border rounded-lg disabled:opacity-40">Previous</button><span>Page {data.pagination?.page||1} of {data.pagination?.pages||1}</span><button disabled={(data.pagination?.page||1)>=(data.pagination?.pages||1)} onClick={()=>load(data.pagination.page+1)} className="px-3 py-1.5 border rounded-lg disabled:opacity-40">Next</button></div></div>
        </section>
      </main>
    </div>
    {selectedCustomer && <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4"><div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl"><div className="p-5 border-b flex justify-between"><div><h3 className="font-black text-lg">{selectedCustomer.name}</h3><p className="text-sm text-slate-500">{selectedCustomer.registered?'Registered player':'Guest / venue contact'}</p></div><button onClick={()=>setSelectedCustomer(null)}><X/></button></div><div className="p-5 grid grid-cols-2 gap-4 text-sm"><div><p className="text-slate-400">Phone</p><b>{selectedCustomer.phone||'—'}</b></div><div><p className="text-slate-400">Email</p><b>{selectedCustomer.email||'—'}</b></div><div><p className="text-slate-400">Bookings</p><b>{selectedCustomer.totalBookings}</b></div><div><p className="text-slate-400">Completed</p><b>{selectedCustomer.completedBookings}</b></div><div><p className="text-slate-400">Cancelled</p><b>{selectedCustomer.cancelledBookings}</b></div><div><p className="text-slate-400">Collected</p><b>{money(selectedCustomer.totalSpend)}</b></div></div></div></div>}
    {isAddModalOpen && <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4"><div className="bg-white rounded-2xl w-full max-w-md shadow-2xl"><div className="p-5 border-b flex justify-between"><h3 className="font-black">Add Customer</h3><button onClick={()=>setIsAddModalOpen(false)}><X/></button></div><form onSubmit={submitCustomer} className="p-5 space-y-4">{formError&&<div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{formError}</div>}{[['name','Full name *'],['phone','Phone'],['email','Email']].map(([k,l])=><label key={k} className="block text-sm font-bold">{l}<input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} required={k==='name'} className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"/></label>)}<label className="block text-sm font-bold">Notes<textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500" rows="3"/></label><p className="text-xs text-slate-500">Provide at least an email or phone number. Adding a customer does not create a player login.</p><div className="pt-2 flex justify-end gap-2"><button type="button" onClick={()=>setIsAddModalOpen(false)} className="px-4 py-2 border rounded-xl font-bold">Cancel</button><button disabled={saving||(!form.phone.trim()&&!form.email.trim())} className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold disabled:opacity-50">{saving?'Saving…':'Save Customer'}</button></div></form></div></div>}
  </div>;
}
export default CustomersPage;
