import React from 'react';
import { KpiData } from '../../types';
import { Screen } from '../../App';

interface KpiBarProps {
  data: KpiData | null;
  loading: boolean;
  onCardClick: (screen: Screen) => void;
}

const KpiCard: React.FC<{ title: string; value: string; loading: boolean, onClick: () => void }> = ({ title, value, loading, onClick }) => (
  <button onClick={onClick} className="text-left w-full h-full group p-4 hover:bg-gray-50 rounded-md transition-colors duration-200">
      <h3 className="text-sm font-medium text-light-grey truncate">{title}</h3>
      {loading ? (
        <div className="h-9 w-3/4 bg-gray-200 rounded-md animate-pulse mt-2"></div>
      ) : (
        <p className="text-3xl font-bold text-charcoal mt-1">{value}</p>
      )}
  </button>
);

const KpiBar: React.FC<KpiBarProps> = ({ data, loading, onCardClick }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
      <KpiCard title="Revenue (This Month)" value={formatCurrency(data?.revenue || 0)} loading={loading} onClick={() => onCardClick('Analytics')} />
      <KpiCard title="RTO Rate (%)" value={`${(data?.rtoRate || 0).toFixed(1)}%`} loading={loading} onClick={() => onCardClick('Analytics')} />
      <KpiCard title="Pending GST Adjustments" value={formatCurrency(data?.pendingGst || 0)} loading={loading} onClick={() => onCardClick('GST Automation')} />
    </div>
  );
};

export default KpiBar;