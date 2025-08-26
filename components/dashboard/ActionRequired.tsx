import React from 'react';
import Card from '../ui/Card';
import { ActionItem } from '../../types';
import { ExclamationCircleIcon, DocumentTextIcon } from '../icons/Icons';

interface ActionRequiredProps {
  data: ActionItem[];
  loading: boolean;
  onActionClick: (item: ActionItem) => void;
}

const ActionRequired: React.FC<ActionRequiredProps> = ({ data, loading, onActionClick }) => {
  const getIcon = (type: ActionItem['type']) => {
    switch (type) {
      case 'Credit Note':
        return <DocumentTextIcon className="w-6 h-6 text-charcoal" />;
      case 'Authentication':
        return <ExclamationCircleIcon className="w-6 h-6 text-charcoal" />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="h-full">
      <h3 className="text-lg font-bold text-charcoal mb-4">Action Required</h3>
      {loading ? (
        <div className="space-y-3">
          <div className="h-14 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-14 w-full bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      ) : (
        <ul className="space-y-1">
          {data.map(item => (
            <li key={item.id}>
              <button
                onClick={() => onActionClick(item)}
                className="w-full flex items-center p-3 rounded-md text-left hover:bg-gray-100 transition-colors duration-200 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex-shrink-0 mr-4">
                  {getIcon(item.type)}
                </div>
                <p className="text-sm font-medium text-charcoal">{item.description}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default ActionRequired;