import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ActionItem, Integration, KpiData, GstActionItem, SalesDataPoint, RtoHotspot, SyncActivity } from '../types';
import { getDashboardData, getGstData } from '../services/apiService';
import { ShopifyLogoIcon, ShiprocketLogoIcon, WooCommerceLogoIcon, DelhiveryLogoIcon } from '../components/icons/Icons';

interface AppContextType {
  integrations: Integration[];
  actionItems: ActionItem[];
  kpiData: KpiData | null;
  salesData: SalesDataPoint[];
  rtoHotspots: RtoHotspot[];
  syncActivity: SyncActivity[];
  gstItems: GstActionItem[];
  loading: boolean;
  updateIntegrationStatus: (id: string, status: Integration['status']) => void;
  syncGstCreditNotes: (itemIds: string[]) => Promise<void>;
}

export const AppContext = createContext<AppContextType>({
  integrations: [],
  actionItems: [],
  kpiData: null,
  salesData: [],
  rtoHotspots: [],
  syncActivity: [],
  gstItems: [],
  loading: true,
  updateIntegrationStatus: () => {},
  syncGstCreditNotes: () => Promise.resolve(),
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'int1', name: 'Shopify', logo: <ShopifyLogoIcon className="h-6" />, status: 'Connected', type: 'E-commerce' },
    { id: 'int2', name: 'Shiprocket', logo: <ShiprocketLogoIcon className="h-8" />, status: 'Needs Re-authentication', type: 'Logistics' },
    { id: 'int3', name: 'WooCommerce', logo: <WooCommerceLogoIcon className="h-6" />, status: 'Not Connected', type: 'E-commerce' },
    { id: 'int4', name: 'Delhivery', logo: <DelhiveryLogoIcon className="h-5" />, status: 'Not Connected', type: 'Logistics' },
  ]);

  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [rtoHotspots, setRtoHotspots] = useState<RtoHotspot[]>([]);
  const [syncActivity, setSyncActivity] = useState<SyncActivity[]>([]);
  const [gstItems, setGstItems] = useState<GstActionItem[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [dashboardPromise, gstPromise] = [getDashboardData(), getGstData()];
            const [[kpis, sales, _, hotspots, syncs], gst] = await Promise.all([dashboardPromise, gstPromise]);
            
            // Calculate the initial pending GST from the fetched GST items to ensure consistency
            const initialPendingGst = gst
                .filter(item => item.status === 'Pending')
                .reduce((sum, item) => sum + item.gstToReclaim, 0);

            // Update the KPI data with the correct calculated value before setting state
            const correctedKpis = { ...kpis, pendingGst: initialPendingGst };

            setKpiData(correctedKpis);
            setSalesData(sales);
            setRtoHotspots(hotspots);
            setSyncActivity(syncs);
            setGstItems(gst);

        } catch (error) {
            console.error("Failed to load application data:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    // Derive all action items from the current state of integrations and gstItems
    const newActionItems: ActionItem[] = [];

    // 1. Check for authentication actions
    const authActionNeeded = integrations.find(int => int.status === 'Needs Re-authentication');
    if (authActionNeeded) {
        newActionItems.push({ 
            id: 'auth-action', 
            description: `${authActionNeeded.name} integration needs re-authentication`, 
            type: 'Authentication' 
        });
    }

    // 2. Check for credit note actions
    if (gstItems) {
        const pendingCreditNotesCount = gstItems.filter(item => item.status === 'Pending').length;
        if (pendingCreditNotesCount > 0) {
            newActionItems.push({
                id: 'credit-note-action',
                description: `${pendingCreditNotesCount} Credit Note${pendingCreditNotesCount > 1 ? 's are' : ' is'} ready to issue for RTOs`,
                type: 'Credit Note'
            });
        }
    }
    
    setActionItems(newActionItems);
  }, [integrations, gstItems]);
  
  const updateIntegrationStatus = (id: string, status: Integration['status']) => {
    setIntegrations(prev =>
      prev.map(int => (int.id === id ? { ...int, status } : int))
    );
  };

  const syncGstCreditNotes = async (itemIds: string[]) => {
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
    const updatedGstItems = gstItems.map(item => 
      itemIds.includes(item.id) ? { ...item, status: 'Completed' as const } : item
    );
    setGstItems(updatedGstItems);
  
    const newPendingGst = updatedGstItems
      .filter(item => item.status === 'Pending')
      .reduce((sum, item) => sum + item.gstToReclaim, 0);
  
    setKpiData(prevKpiData => {
      if (!prevKpiData) return null;
      return { ...prevKpiData, pendingGst: newPendingGst };
    });
  };

  const value = {
    integrations,
    actionItems,
    kpiData,
    salesData,
    rtoHotspots,
    syncActivity,
    gstItems,
    loading,
    updateIntegrationStatus,
    syncGstCreditNotes,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};