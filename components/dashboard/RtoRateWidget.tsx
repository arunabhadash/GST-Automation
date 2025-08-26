import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import { DashboardSummary } from '../../types';
import { ExclamationTriangleIcon } from '../icons/Icons';

interface RtoRateWidgetProps {
  data: DashboardSummary | null;
  loading: boolean;
}

const RtoRateWidget: React.FC<RtoRateWidgetProps> = ({ data, loading }) => {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">RTO Rate</h3>
          {loading ? (
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mt-2"></div>
          ) : (
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {(data?.rtoRate || 0).toFixed(2)}%
            </p>
          )}
        </div>
         <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-full">
            <ExclamationTriangleIcon className="text-orange-500" />
        </div>
      </div>
      <div className="h-20 mt-4 -mb-4 -mx-6">
        {loading ? (
           <div className="h-full w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data?.rtoByCourier} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <Tooltip 
                cursor={{fill: 'rgba(107, 114, 128, 0.1)'}}
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#d1d5db' }}
                 formatter={(value: number) => [value, 'RTOs']}
            />
            <Bar dataKey="value" fill="#fb923c" radius={[4, 4, 0, 0]} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default RtoRateWidget;
