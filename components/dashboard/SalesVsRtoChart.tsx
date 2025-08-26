import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import { SalesDataPoint } from '../../types';

interface SalesVsRtoChartProps {
  data: SalesDataPoint[];
  loading: boolean;
}

const SalesVsRtoChart: React.FC<SalesVsRtoChartProps> = ({ data, loading }) => {
  const formatCurrency = (value: number) => `₹${(value / 1000).toFixed(0)}k`;

  if (loading) {
    return (
      <Card>
        <div className="h-80 w-full bg-gray-200 rounded-lg animate-pulse"></div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-bold text-charcoal mb-4">Sales vs. RTOs</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value)}
              contentStyle={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.25rem',
              }}
              labelStyle={{ color: '#121212', fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            <Line type="monotone" dataKey="Sales" stroke="#2563eb" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="RTOs" stroke="#B0B0B0" strokeWidth={2} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SalesVsRtoChart;