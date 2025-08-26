import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../ui/Card';
import { DashboardSummary } from '../../types';
import { ArrowTrendingUpIcon } from '../icons/Icons';

interface NetProfitWidgetProps {
  data: DashboardSummary | null;
  loading: boolean;
}

const NetProfitWidget: React.FC<NetProfitWidgetProps> = ({ data, loading }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Net Profit</h3>
          {loading ? (
             <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mt-2"></div>
          ) : (
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {formatCurrency(data?.monthlyNetProfit || 0)}
            </p>
          )}
        </div>
        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
            <ArrowTrendingUpIcon className="text-green-500" />
        </div>
      </div>
      <div className="h-20 mt-4 -mb-4 -mx-6">
        {loading ? (
            <div className="h-full w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        ) : (
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.netProfitHistory} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
                    labelStyle={{ color: '#d1d5db' }}
                    formatter={(value: number) => [formatCurrency(value), 'Profit']}
                />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
            </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default NetProfitWidget;
