import React, { useContext } from 'react';
import toast from 'react-hot-toast';
import { ActionItem } from '../types';
import { exportToCsv } from '../utils/reportUtils';
import { AppContext } from '../contexts/AppContext';
import KpiBar from '../components/dashboard/KpiBar';
import SalesVsRtoChart from '../components/dashboard/SalesVsRtoChart';
import ActionRequired from '../components/dashboard/ActionRequired';
import RtoHotspots from '../components/dashboard/RtoHotspots';
import RecentSyncActivity from '../components/dashboard/RecentSyncActivity';
import Button from '../components/ui/Button';
import { Screen } from '../App';
import { DocumentArrowDownIcon } from '../components/icons/Icons';


interface DashboardProps {
  setActiveScreen: (screen: Screen) => void;
}

function Dashboard({ setActiveScreen }: DashboardProps): React.ReactNode {
  const { 
    kpiData, 
    salesData, 
    rtoHotspots, 
    syncActivity, 
    loading, 
    actionItems 
  } = useContext(AppContext);
  
  const handleActionClick = (item: ActionItem) => {
    if (item.type === 'Credit Note') {
        setActiveScreen('GST Automation');
    } else if (item.type === 'Authentication') {
        setActiveScreen('Integrations');
    } else {
        toast('This action would take you to the relevant page.');
    }
  };

  const handleDownloadReport = () => {
    if (!kpiData || salesData.length === 0) {
        toast.error("Data not available for reporting.");
        return;
    }
    const reportData = [
        { Metric: 'Revenue (This Month)', Value: kpiData.revenue },
        { Metric: 'RTO Rate (%)', Value: kpiData.rtoRate },
        { Metric: 'Pending GST Adjustments (INR)', Value: kpiData.pendingGst },
        ...salesData.map(d => ({ Metric: `Sales (${d.name})`, Value: d.Sales })),
        ...salesData.map(d => ({ Metric: `RTOs (${d.name})`, Value: d.RTOs })),
    ];
    
    exportToCsv('d2c-sync_monthly_report.csv', reportData);
    toast.success("Report downloaded successfully!");
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-3xl sm:text-4xl font-light text-charcoal">Dashboard</h2>
        <Button onClick={handleDownloadReport} disabled={loading} variant="primary" className="w-full sm:w-auto">
            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
            Download Report
        </Button>
      </div>
      
      <div className="py-6 border-b border-gray-200">
        <KpiBar data={kpiData} loading={loading} onCardClick={setActiveScreen} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <SalesVsRtoChart data={salesData} loading={loading} />
        </div>
        <div>
          <ActionRequired data={actionItems} loading={loading} onActionClick={handleActionClick}/>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
         <div className="lg:col-span-2">
           <RecentSyncActivity data={syncActivity} loading={loading} />
         </div>
        <div>
           <RtoHotspots data={rtoHotspots} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;