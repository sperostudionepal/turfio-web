import { useState } from 'react';
import {
  Tag,
  Megaphone,
  Plus,
  Trash2,
  X,
  Send,
} from 'lucide-react';

function SuperadminPromotionsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState('');
  const [newPromoScope, setNewPromoScope] = useState('Global - All Arenas');
  const [promotions, setPromotions] = useState([
    {
      id: 'PROMO-SUMMER-20',
      code: 'TURF20',
      discount: '20% OFF (up to NRs. 500)',
      scope: 'Global - All Arenas',
      validUntil: '30 Jun 2026',
      redemptions: 482,
      maxLimit: 1000,
      status: 'Active',
    },
    {
      id: 'PROMO-POKHARA-10',
      code: 'POKHARA10',
      discount: 'NRs. 300 Flat OFF',
      scope: 'Pokhara Region Only',
      validUntil: '15 Jul 2026',
      redemptions: 118,
      maxLimit: 300,
      status: 'Active',
    },
    {
      id: 'PROMO-NIGHT-OWL',
      code: 'NIGHTOWL',
      discount: '15% OFF (10 PM - 2 AM)',
      scope: 'Kathmandu Arenas',
      validUntil: '31 Aug 2026',
      redemptions: 92,
      maxLimit: 500,
      status: 'Active',
    },
  ]);

  const [announcementText, setAnnouncementText] = useState(
    '⚽ Monsoon Futsal League 2026: Arena registration is now open with 0% platform fee for tournament fixtures!'
  );
  const [isBannerActive, setIsBannerActive] = useState(true);

  const handleDeletePromo = (id) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="text-lime-600" /> Platform Promotions & Global Campaigns
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Create system-wide discount coupons, sponsored campaigns, and broadcast ticker banners.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 text-xs font-extrabold transition-all cursor-pointer shadow-xs"
        >
          <Plus size={14} />
          <span>Create Platform Voucher</span>
        </button>
      </div>

      {/* Global Broadcast Ticker Editor */}
      <div className="bg-white rounded-xl overflow-hidden p-6 shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Megaphone size={16} />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">
                Global Header Broadcast Announcement
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Displayed at the top of player mobile apps and web booking portal
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBannerActive(!isBannerActive)}
            className={`px-3 py-1 rounded-full text-xs font-black transition-colors ${
              isBannerActive
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {isBannerActive ? '● Broadcast Active' : '○ Disabled'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
          />
          <button className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <Send size={13} /> Update Ticker
          </button>
        </div>
      </div>

      {/* Promotions List */}
      <div className="bg-white rounded-xl overflow-hidden p-6 shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100 space-y-4">
        <h3 className="font-black text-base text-slate-900">Active Voucher Campaigns</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="text-[11px] font-extrabold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                <th className="pb-3 pr-3">Voucher Code & ID</th>
                <th className="pb-3 pr-3">Discount Value</th>
                <th className="pb-3 pr-3">Target Scope</th>
                <th className="pb-3 pr-3 text-center">Redemptions</th>
                <th className="pb-3 pr-3">Valid Until</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold">
              {promotions.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-3">
                    <span className="font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {p.code}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium block mt-1">
                      {p.id}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3 font-extrabold text-slate-900">{p.discount}</td>
                  <td className="py-3.5 pr-3 font-medium text-slate-700">{p.scope}</td>
                  <td className="py-3.5 pr-3 text-center font-bold text-slate-900">
                    {p.redemptions} / {p.maxLimit}
                  </td>
                  <td className="py-3.5 pr-3 font-medium text-slate-600">{p.validUntil}</td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => handleDeletePromo(p.id)}
                      className="p-1.5 rounded-xl border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Deactivate Promo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Voucher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Create Platform Voucher</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newPromoCode) return;
                const newPromo = {
                  id: `PROMO-${newPromoCode.toUpperCase()}`,
                  code: newPromoCode.toUpperCase(),
                  discount: newPromoDiscount || '15% OFF',
                  scope: newPromoScope,
                  validUntil: '31 Dec 2026',
                  redemptions: 0,
                  maxLimit: 500,
                  status: 'Active',
                };
                setPromotions((prev) => [newPromo, ...prev]);
                setNewPromoCode('');
                setNewPromoDiscount('');
                setIsAddModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. MONSOON25"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-extrabold uppercase focus:outline-none focus:ring-2 focus:ring-lime-300"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Discount Offer</label>
                <input
                  type="text"
                  placeholder="e.g. 25% OFF (up to NRs. 600)"
                  value={newPromoDiscount}
                  onChange={(e) => setNewPromoDiscount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Scope</label>
                <select
                  value={newPromoScope}
                  onChange={(e) => setNewPromoScope(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-lime-300"
                >
                  <option value="Global - All Arenas">Global - All Arenas</option>
                  <option value="Kathmandu Valley">Kathmandu Valley</option>
                  <option value="Pokhara Region Only">Pokhara Region Only</option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 font-black transition-all cursor-pointer shadow-xs"
                >
                  Create Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperadminPromotionsPage;
