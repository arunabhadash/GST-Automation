import React from 'react';
import Card from '../ui/Card';
import { RtoHotspot } from '../../types';
import { MapPinIcon } from '../icons/Icons';

interface RtoHotspotsProps {
  data: RtoHotspot[];
  loading: boolean;
}

const RtoHotspots: React.FC<RtoHotspotsProps> = ({ data, loading }) => {
  return (
    <Card className="h-full">
      <h3 className="text-lg font-bold text-charcoal mb-4">RTO Hotspots</h3>
      {loading ? (
        <div className="space-y-3">
          <div className="h-8 w-full bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-8 w-full bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-8 w-full bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      ) : (
        <ul className="space-y-2">
          {data.map(hotspot => (
            <li key={hotspot.location} className="flex items-center text-sm p-2 border-b border-gray-100 last:border-0">
              <MapPinIcon className="w-5 h-5 text-charcoal mr-3 flex-shrink-0" />
              <span className="font-medium text-light-grey flex-1 truncate">{hotspot.location}</span>
              <span className="font-bold text-danger ml-2">{hotspot.rate}%</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default RtoHotspots;