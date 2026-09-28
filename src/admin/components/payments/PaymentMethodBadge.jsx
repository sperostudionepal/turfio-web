import { Banknote, CreditCard, WalletCards } from 'lucide-react';
import esewaLogo from '../../../assets/payment-methods/esewa.svg';
const METHODS = {
  esewa: { label: 'eSewa', className: 'bg-emerald-50 text-emerald-700 border-emerald-100', image: esewaLogo },
  khalti: { label: 'Khalti', className: 'bg-purple-50 text-purple-700 border-purple-100', Icon: WalletCards },
  cash: { label: 'Cash', className: 'bg-slate-100 text-slate-700 border-slate-200', Icon: Banknote },
  'pay at venue': { label: 'Pay at Venue', className: 'bg-orange-50 text-orange-700 border-orange-200 ring-1 ring-inset ring-orange-100', Icon: Banknote },
  fonepay: { label: 'Fonepay', className: 'bg-sky-50 text-sky-700 border-sky-100', Icon: WalletCards },
  'card/other wallets': { label: 'Card/Other Wallets', className: 'bg-blue-50 text-blue-700 border-blue-100', Icon: CreditCard },
};
export default function PaymentMethodBadge({ method, compact = false }) {
  const item = METHODS[String(method || '').toLowerCase()] || { label: method || 'Other', className: 'bg-slate-100 text-slate-600 border-slate-200', Icon: CreditCard };
  const Icon = item.Icon;
  return <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${compact ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-[11px]'} ${item.className}`}>{item.image ? <img src={item.image} alt="" className="h-4 w-4 rounded object-contain" /> : <Icon size={13} />}{item.label}</span>;
}
