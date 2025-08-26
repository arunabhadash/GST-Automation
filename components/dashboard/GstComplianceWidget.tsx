import React from 'react';
import Card from '../ui/Card';
import { GstReturn } from '../../types';
import { DocumentCheckIcon, CalendarDaysIcon } from '../icons/Icons';

interface GstComplianceWidgetProps {
  data: GstReturn[];
  loading: boolean;
}

const GstStatusIndicator: React.FC<{ status: 'Draft' | 'Filed' | 'Due' }> = ({ status }) => {
    const baseClasses = "text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full";
    const statusClasses = {
        Draft: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        Filed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        Due: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
}


const GstComplianceWidget: React.FC<GstComplianceWidgetProps> = ({ data, loading }) => {
  return (
    <Card className="md:col-span-2 xl:col-span-1">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">GST Compliance</h3>
          <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">Upcoming Deadlines</p>
        </div>
        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
            <DocumentCheckIcon className="text-blue-500" />
        </div>
      </div>
      <div className="space-y-4">
        {loading ? (
            <>
                <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </>
        ) : (
            data.map((item, index) => (
            <div key={index} className="flex items-center">
                <div className="flex-shrink-0">
                    <CalendarDaysIcon className="text-gray-400"/>
                </div>
                <div className="ml-4 flex-grow">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.type} Filing</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Due: {new Date(item.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'})}</p>
                </div>
                 <GstStatusIndicator status={item.status} />
            </div>
            ))
        )}
      </div>
    </Card>
  );
};

export default GstComplianceWidget;
