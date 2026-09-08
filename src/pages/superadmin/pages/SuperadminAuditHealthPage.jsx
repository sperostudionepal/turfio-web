import { useState } from 'react';
import {
  Activity,
  Search,
  Sliders,
} from 'lucide-react';
import useAccessibilityStore from '../../../store/useAccessibilityStore';

function SuperadminAuditHealthPage() {
  const { toggleOpen: toggleAccessibility, fontTheme, fontSize } = useAccessibilityStore();
  const [searchLogQuery, setSearchLogQuery] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [instantPayoutsEnabled, setInstantPayoutsEnabled] = useState(true);
  const [smsGatewayActive, setSmsGatewayActive] = useState(true);

  // System Services Telemetry
  const services = [
    {
      name: 'API Gateway (Node/Express Cluster)',
      status: 'Operational',
      latency: '24ms',
      uptime: '99.98%',
      load: '14%',
    },
    {
      name: 'Primary Database (PostgreSQL / Read Replicas)',
      status: 'Operational',
      latency: '8ms',
      uptime: '100%',
      load: '28%',
    },
    {
      name: 'Redis Cache & Lock Manager',
      status: 'Operational',
      latency: '2ms',
      uptime: '100%',
      load: '9%',
    },
    {
      name: 'Khalti & eSewa Webhook Handlers',
      status: 'Operational',
      latency: '65ms',
      uptime: '99.91%',
      load: '18%',
    },
  ];

  // Immutable Audit Trail Logs
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'AUD-9021',
      actor: 'superadmin@turfio.app',
      action: 'APPROVE_ARENA_KYC',
      target: 'Lalitpur Champions Arena (TRF-LAL-003)',
      ip: '103.104.28.12 (Kathmandu, NP)',
      timestamp: '2026-09-04 14:15:22',
      status: 'SUCCESS',
    },
    {
      id: 'AUD-9020',
      actor: 'superadmin@turfio.app',
      action: 'UPDATE_COMMISSION_RATE',
      target: 'Pokhara Sky Pitch (7.5% -> 7.0%)',
      ip: '103.104.28.12 (Kathmandu, NP)',
      timestamp: '2026-09-04 13:40:05',
      status: 'SUCCESS',
    },
    {
      id: 'AUD-9019',
      actor: 'system_daemon_batch',
      action: 'ESCROW_PAYOUT_RELEASE',
      target: 'Batch #PAY-BATCH-2026-080 (NRs. 3,86,400)',
      ip: '10.0.4.12 (Internal VPC)',
      timestamp: '2026-09-04 12:00:01',
      status: 'SUCCESS',
    },
    {
      id: 'AUD-9018',
      actor: 'superadmin@turfio.app',
      action: 'ACCOUNT_SUSPEND_TRIGGER',
      target: 'User USR-7731 (Kiran Thapa)',
      ip: '103.104.28.12 (Kathmandu, NP)',
      timestamp: '2026-09-04 10:24:19',
      status: 'SUCCESS',
    },
    {
      id: 'AUD-9017',
      actor: 'auth_security_guard',
      action: 'FAILED_LOGIN_SPIKE_BLOCKED',
      target: 'IP 185.220.101.5 (Rate limit enforced)',
      ip: '185.220.101.5 (Proxy)',
      timestamp: '2026-09-04 09:11:45',
      status: 'SECURITY_ALERT',
    },
  ]);

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
      l.actor.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
      l.target.toLowerCase().includes(searchLogQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="text-lime-600" /> System Telemetry & Security Audit Trail
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Real-time infrastructure performance, feature flag toggles, and cryptographic audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> All Nodes Healthy
          </span>
        </div>
      </div>

      {/* Live Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((svc) => (
          <div
            key={svc.name}
            className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {svc.status}
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900 leading-snug">{svc.name}</h4>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">
                Uptime: {svc.uptime} • Load: {svc.load}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400 text-[11px]">Latency:</span>
              <span className="text-slate-900 font-extrabold">{svc.latency}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Platform Control & Feature Flags */}
      <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80 space-y-4">
        <h3 className="font-black text-base text-slate-900">Platform Feature Flags & Security Toggles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-xs text-slate-900 block">Instant Payout Engine</span>
              <span className="text-[11px] text-slate-400 font-medium">Automatic settlement on match end</span>
            </div>
            <button
              onClick={() => setInstantPayoutsEnabled(!instantPayoutsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                instantPayoutsEnabled ? 'bg-lime-400' : 'bg-slate-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                  instantPayoutsEnabled ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-xs text-slate-900 block">SMS Gateway OTP</span>
              <span className="text-[11px] text-slate-400 font-medium">SparrowSMS Nepal bridge</span>
            </div>
            <button
              onClick={() => setSmsGatewayActive(!smsGatewayActive)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                smsGatewayActive ? 'bg-lime-400' : 'bg-slate-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                  smsGatewayActive ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-xs text-slate-900 block">Global Maintenance Mode</span>
              <span className="text-[11px] text-slate-400 font-medium">Freeze public bookings for upgrades</span>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                maintenanceMode ? 'bg-rose-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                  maintenanceMode ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-xs text-slate-900 block">Typography & Font Size</span>
              <span className="text-[11px] text-slate-400 font-medium capitalize">
                Font: {fontTheme} • Size: {fontSize}
              </span>
            </div>
            <button
              onClick={toggleAccessibility}
              className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-extrabold hover:bg-lime-400 hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Sliders size={12} />
              <span>Customize</span>
            </button>
          </div>
        </div>
      </div>

      {/* Immutable Audit Log Trail */}
      <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-base text-slate-900 tracking-tight">
              Cryptographic Audit Trail
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Timestamped records of all administrative and financial actions
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit actions, actors, or IPs..."
              value={searchLogQuery}
              onChange={(e) => setSearchLogQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-300 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="text-[11px] font-extrabold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                <th className="pb-3 pr-3">Event ID & Action</th>
                <th className="pb-3 pr-3">Authorized Actor</th>
                <th className="pb-3 pr-3">Target Resource</th>
                <th className="pb-3 pr-3">Origin IP / Location</th>
                <th className="pb-3 pr-3">Timestamp (UTC+5:45)</th>
                <th className="pb-3 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-3">
                    <span className="font-black text-slate-900 block">{log.action}</span>
                    <span className="text-[11px] text-lime-700 font-bold">{log.id}</span>
                  </td>
                  <td className="py-3.5 pr-3 font-bold text-slate-800">{log.actor}</td>
                  <td className="py-3.5 pr-3 text-slate-600">{log.target}</td>
                  <td className="py-3.5 pr-3 text-slate-500 font-medium">{log.ip}</td>
                  <td className="py-3.5 pr-3 text-slate-500 font-medium">{log.timestamp}</td>
                  <td className="py-3.5 text-right">
                    {log.status === 'SUCCESS' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                        SUCCESS
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">
                        FLAGGED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SuperadminAuditHealthPage;
