import React, { useState, useMemo, useContext } from 'react';
import Card from '../components/ui/Card';
import { GstActionItem } from '../types';
import { AppContext } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import toast from 'react-hot-toast';
import { exportToCsv } from '../utils/reportUtils';
import { ArrowPathIcon, DocumentArrowDownIcon } from '../components/icons/Icons';

const GstAutomationHub: React.FC = () => {
    const { gstItems, syncGstCreditNotes, loading } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState<'Pending' | 'Completed'>('Pending');
    const [selectedItems, setSelectedItems] = useState(new Set<string>());
    const [processingItems, setProcessingItems] = useState(new Set<string>());

    const filteredItems = useMemo(() => gstItems.filter(item => {
        if (activeTab === 'Pending') return item.status === 'Pending' || item.status === 'In Process';
        if (activeTab === 'Completed') return item.status === 'Completed';
        return false;
    }), [gstItems, activeTab]);

    const handleSelectItem = (itemId: string) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allPendingIds = filteredItems
                .filter(item => item.status === 'Pending')
                .map(item => item.id);
            setSelectedItems(new Set(allPendingIds));
        } else {
            setSelectedItems(new Set());
        }
    };

    const isAllSelected = useMemo(() => {
        const pendingItems = filteredItems.filter(i => i.status === 'Pending');
        return pendingItems.length > 0 && pendingItems.every(item => selectedItems.has(item.id));
    }, [selectedItems, filteredItems]);

    const handleGenerateSync = async (itemIds: string[]) => {
        const itemsToProcess = itemIds.filter(id => !processingItems.has(id));
        if (itemsToProcess.length === 0) return;

        setProcessingItems(prev => new Set([...prev, ...itemsToProcess]));

        const promise = syncGstCreditNotes(itemsToProcess);

        toast.promise(promise, {
            loading: `Syncing ${itemsToProcess.length} credit note(s)...`,
            success: () => {
                setProcessingItems(prev => {
                    const newSet = new Set(prev);
                    itemsToProcess.forEach(id => newSet.delete(id));
                    return newSet;
                });
                setSelectedItems(new Set());
                return `${itemsToProcess.length} credit note(s) synced!`;
            },
            error: () => {
                 setProcessingItems(prev => {
                    const newSet = new Set(prev);
                    itemsToProcess.forEach(id => newSet.delete(id));
                    return newSet;
                });
                return "Some items failed to sync.";
            }
        });
    };
    
    const handleExport = () => {
        if(filteredItems.length === 0) {
            toast.error("No data to export.");
            return;
        }
        exportToCsv(`gst-automation-${activeTab.toLowerCase()}.csv`, filteredItems);
        toast.success("Data exported successfully!");
    }
    
    const StatusBadge: React.FC<{ status: GstActionItem['status'] }> = ({ status }) => {
        const colorClasses: { [key in GstActionItem['status']]: string } = {
            'Pending': 'text-warning',
            'In Process': 'text-warning',
            'Completed': 'text-success'
        };
        return <span className={`text-xs font-semibold ${colorClasses[status]}`}>{status}</span>;
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-3xl sm:text-4xl font-light mb-6 text-charcoal">GST Automation Hub</h2>
            <Card>
                <div className="border-b border-gray-200 mb-4">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button 
                            onClick={() => { setActiveTab('Pending'); setSelectedItems(new Set()); }}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 text-sm ${activeTab === 'Pending' ? 'border-primary text-primary font-semibold' : 'border-transparent text-light-grey hover:text-primary'}`}>
                            Pending Action ({gstItems.filter(i => i.status === 'Pending').length})
                        </button>
                        <button 
                            onClick={() => { setActiveTab('Completed'); setSelectedItems(new Set()); }}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 text-sm ${activeTab === 'Completed' ? 'border-primary text-primary font-semibold' : 'border-transparent text-light-grey hover:text-primary'}`}>
                            Completed
                        </button>
                    </nav>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center my-4 gap-4">
                    <div className="w-full sm:w-auto">
                        {selectedItems.size > 0 && activeTab === 'Pending' && (
                            <Button className="w-full sm:w-auto" onClick={() => handleGenerateSync(Array.from(selectedItems))} disabled={processingItems.size > 0}>
                                <ArrowPathIcon className="w-5 h-5 mr-2" />
                                Generate for {selectedItems.size} Selected
                            </Button>
                        )}
                    </div>
                     <Button onClick={handleExport} variant="secondary" className="w-full sm:w-auto">
                         <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                         Export as CSV
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-light-grey">
                        <thead className="text-xs text-charcoal uppercase bg-white">
                            <tr>
                                {activeTab === 'Pending' && (
                                <th scope="col" className="p-2 sm:p-4">
                                    <Checkbox
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        aria-label="Select all pending items"
                                    />
                                </th>
                                )}
                                <th scope="col" className="px-2 py-3 sm:px-6 font-medium">Order Details</th>
                                <th scope="col" className="px-2 py-3 sm:px-6 font-medium">Dates</th>
                                <th scope="col" className="px-2 py-3 sm:px-6 font-medium">Value</th>
                                <th scope="col" className="px-2 py-3 sm:px-6 font-medium">GST To Reclaim</th>
                                <th scope="col" className="px-2 py-3 sm:px-6 font-medium">Status</th>
                                <th scope="col" className="px-2 py-3 sm:px-6 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="bg-white border-b border-gray-200">
                                        {activeTab === 'Pending' && <td className="p-2 sm:p-4"><div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div></td>}
                                        <td className="px-2 py-4 sm:px-6"><div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div></td>
                                        <td className="px-2 py-4 sm:px-6"><div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div></td>
                                        <td className="px-2 py-4 sm:px-6"><div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div></td>
                                        <td className="px-2 py-4 sm:px-6"><div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div></td>
                                        <td className="px-2 py-4 sm:px-6"><div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div></td>
                                        <td className="px-2 py-4 sm:px-6"><div className="h-8 bg-gray-200 rounded-md animate-pulse w-28"></div></td>
                                    </tr>
                                ))
                            ) : (
                                filteredItems.map(item => (
                                    <tr key={item.id} className="bg-white border-b border-gray-200">
                                        {activeTab === 'Pending' && (
                                            <td className="p-2 sm:p-4">
                                                {item.status === 'Pending' && (
                                                    <Checkbox
                                                        checked={selectedItems.has(item.id)}
                                                        onChange={() => handleSelectItem(item.id)}
                                                        aria-label={`Select item ${item.id}`}
                                                    />
                                                )}
                                            </td>
                                        )}
                                        <td className="px-2 py-4 sm:px-6 font-medium text-charcoal">
                                            <div>{item.customerName}</div>
                                            <div className="text-xs text-light-grey">{item.products}</div>
                                        </td>
                                        <td className="px-2 py-4 sm:px-6 text-charcoal">
                                            <div>Invoice: {item.originalInvoiceDate}</div>
                                            <div className="text-xs">RTO: {item.rtoDate}</div>
                                        </td>
                                        <td className="px-2 py-4 sm:px-6 text-charcoal">₹{item.orderValue.toFixed(2)}</td>
                                        <td className="px-2 py-4 sm:px-6 font-semibold text-charcoal">₹{item.gstToReclaim.toFixed(2)}</td>
                                        <td className="px-2 py-4 sm:px-6"><StatusBadge status={item.status} /></td>
                                        <td className="px-2 py-4 sm:px-6">
                                            {item.status === 'Pending' && (
                                                <Button 
                                                    size="sm"
                                                    onClick={() => handleGenerateSync([item.id])}
                                                    isLoading={processingItems.has(item.id)}
                                                >
                                                    Generate & Sync
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default GstAutomationHub;