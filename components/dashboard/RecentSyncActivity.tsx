import React from 'react';
import Card from '../ui/Card';
import { SyncActivity } from '../../types';
import { ArrowPathIcon } from '../icons/Icons';

interface RecentSyncActivityProps {
  data: SyncActivity[];
  loading: boolean;
}

const RecentSyncActivity: React.FC<RecentSyncActivityProps> = ({ data, loading }) => {
  return (
    <Card className="h-full">
      <h3 className="text-lg font-bold text-charcoal mb-4">Recent Sync Activity</h3>
      {loading ? (
        <div className="space-y-3">
          <div className="h-12 w-full bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-12 w-full bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-12 w-full bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      ) : (
        <ul className="space-y-1">
          {data.map(activity => (
            <li key={activity.id} className="flex items-start p-3 border-b border-gray-100 last:border-0">
              <div className="mt-1">
                <ArrowPathIcon className="w-5 h-5 text-primary mr-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal">{activity.description}</p>
                <p className="text-xs text-light-grey">{activity.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default RecentSyncActivity;