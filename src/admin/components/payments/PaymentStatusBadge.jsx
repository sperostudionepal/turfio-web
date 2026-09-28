import StatusBadge from '../common/StatusBadge';
const LABELS={RefundPending:'Refund Pending',Refunded:'Refunded',RefundFailed:'Refund Failed'};
export function PaymentStatusBadge({status}){return <StatusBadge status={status} label={LABELS[status]||status}/>;}
export default PaymentStatusBadge;
