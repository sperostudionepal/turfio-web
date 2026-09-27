import { useEffect, useMemo, useState } from 'react';
import { CreditCard, FileText, ReceiptText, Download, CircleCheck, Clock3 } from 'lucide-react';
import jsPDF from 'jspdf';
import turfService from '../../services/turfService';

const money=v=>`NRs. ${Number(v||0).toLocaleString('en-NP')}`;
const label=v=>String(v||'').replaceAll('_',' ').toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
const badge=s=>s==='PAID'||s==='SUCCESS'?'bg-lime-50 text-lime-700':s==='PARTIALLY_PAID'||s==='ISSUED'?'bg-amber-50 text-amber-700':'bg-slate-100 text-slate-600';
function pdf(title, rows, filename){const d=new jsPDF();d.setFont('helvetica','bold');d.setFontSize(18);d.text('Turfio',18,20);d.setFontSize(14);d.text(title,18,31);d.setFont('helvetica','normal');d.setFontSize(10);let y=45;rows.forEach(([k,v])=>{d.setTextColor(100);d.text(String(k),18,y);d.setTextColor(20);d.text(String(v??'—'),75,y);y+=8;});d.save(filename);}
export default function FinancialHistoryPanel({bookingId, owner=false}){
 const [data,setData]=useState(null); const [loading,setLoading]=useState(true);
 useEffect(()=>{let live=true;setLoading(true);turfService.getBookingFinancials(bookingId,{owner}).then(x=>live&&setData(x?.data||x)).catch(()=>live&&setData(null)).finally(()=>live&&setLoading(false));return()=>{live=false}},[bookingId,owner]);
 const txs=useMemo(()=>data?.transactions||[],[data]);
 if(loading)return <div className="rounded-xl border border-slate-100 p-4 text-xs text-slate-400">Loading financial history…</div>;
 if(!data?.available)return <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-500">No financial record is available for this booking.</div>;
 const {payment,invoice}=data;
 const downloadInvoice=()=>pdf(`Invoice ${invoice.invoiceNumber||invoice.invoiceId}`,[['Booking',data.booking?.bookingId],['Status',label(invoice.status)],['Plan',label(invoice.paymentPlan)],['Subtotal',money(invoice.subtotal)],['Discount',money(invoice.discountAmount)],['Total',money(invoice.totalAmount)],['Paid',money(invoice.amountPaid)],['Amount due',money(invoice.amountDue)],['Issued',new Date(invoice.issuedAt).toLocaleString()]],`${invoice.invoiceNumber||invoice.invoiceId}.pdf`);
 const downloadReceipt=r=>pdf(`Receipt ${r.receiptId}`,[['Booking',data.booking?.bookingId],['Receipt',r.receiptId],['Amount',money(r.amount)],['Method',label(r.method)],['Provider',r.provider||'—'],['Reference',r.providerReference||'—'],['Paid at',new Date(r.paidAt).toLocaleString()]],`${r.receiptId}.pdf`);
 return <div className="space-y-3">
  <div className="flex items-center justify-between"><div><p className="text-sm font-bold text-slate-900">Financial record</p><p className="text-[11px] text-slate-400">Payment, invoice, transactions and receipts</p></div><button onClick={downloadInvoice} className="inline-flex items-center gap-1.5 rounded-full bg-lime-400 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-lime-500"><Download size={13}/> Invoice PDF</button></div>
  <div className="grid grid-cols-3 gap-2">
   <div className="rounded-xl border border-slate-100 p-3"><CreditCard size={15} className="mb-2 text-slate-400"/><p className="text-[10px] font-semibold text-slate-400">Total</p><p className="text-sm font-black text-slate-900">{money(payment.totalAmount)}</p></div>
   <div className="rounded-xl border border-slate-100 p-3"><CircleCheck size={15} className="mb-2 text-lime-600"/><p className="text-[10px] font-semibold text-slate-400">Paid</p><p className="text-sm font-black text-slate-900">{money(payment.paidAmount)}</p></div>
   <div className="rounded-xl border border-slate-100 p-3"><Clock3 size={15} className="mb-2 text-amber-500"/><p className="text-[10px] font-semibold text-slate-400">Remaining</p><p className="text-sm font-black text-slate-900">{money(payment.remainingAmount)}</p></div>
  </div>
  <div className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5"><div className="flex items-center gap-2"><FileText size={15} className="text-slate-400"/><div><p className="text-xs font-bold text-slate-900">{invoice.invoiceNumber||invoice.invoiceId}</p><p className="text-[10px] text-slate-400">{label(payment.plan)} · {label(invoice.status)}</p></div></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${badge(payment.status)}`}>{label(payment.status)}</span></div>
  <div className="rounded-xl border border-slate-100 overflow-hidden"><div className="border-b border-slate-100 px-3 py-2.5"><p className="text-xs font-bold text-slate-900">Transactions</p></div>{txs.map(t=><div key={t.transactionId} className="flex items-center justify-between gap-3 border-b border-slate-50 px-3 py-3 last:border-0"><div className="flex min-w-0 items-center gap-2.5"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50"><ReceiptText size={14}/></div><div className="min-w-0"><p className="truncate text-xs font-bold text-slate-900">{label(t.purpose)} · {money(t.amount)}</p><p className="text-[10px] text-slate-400">{label(t.method)} · {new Date(t.completedAt||t.createdAt).toLocaleString()}</p></div></div><div className="flex items-center gap-2"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${badge(t.status)}`}>{label(t.status)}</span>{t.receipt&&<button onClick={()=>downloadReceipt(t.receipt)} title="Download receipt" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"><Download size={14}/></button>}</div></div>)}</div>
 </div>;
}
