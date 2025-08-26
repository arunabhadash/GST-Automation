import React, { useState, useEffect, useCallback } from 'react';
import Card from '../ui/Card';
import { Order, OrderStatus, RtoRiskLevel } from '../../types';
import { getRecentOrders } from '../../services/apiService';

interface RecentOrdersWidgetProps {
  onOrderClick: (order: Order) => void;
}

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const colorClasses: { [key in OrderStatus]: string } = {
    [OrderStatus.PENDING]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    [OrderStatus.PROCESSING]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [OrderStatus.SHIPPED]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    [OrderStatus.RTO_INITIATED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [OrderStatus.RTO_DELIVERED]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>{status}</span>;
};

const RiskBadge: React.FC<{ risk: RtoRiskLevel }> = ({ risk }) => {
    const colorClasses: { [key in RtoRiskLevel]: string } = {
        [RtoRiskLevel.LOW]: 'text-green-500',
        [RtoRiskLevel.MEDIUM]: 'text-yellow-500',
        [RtoRiskLevel.HIGH]: 'text-red-500 font-bold',
    };
    return <span className={`text-sm ${colorClasses[risk]}`}>{risk} Risk</span>
}

const RecentOrdersWidget: React.FC<RecentOrdersWidgetProps> = ({ onOrderClick }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 7;

    const fetchOrders = useCallback(async (pageNum: number) => {
        setLoading(true);
        try {
            const data = await getRecentOrders(pageNum, limit);
            setOrders(data.orders);
            setTotal(data.total);
        } catch (error) {
            console.error("Failed to fetch recent orders:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders(page);
    }, [page, fetchOrders]);
    
    const totalPages = Math.ceil(total / limit);

  return (
    <Card className="col-span-1 md:col-span-2 xl:col-span-3">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Order ID</th>
                        <th scope="col" className="px-6 py-3">Customer</th>
                        <th scope="col" className="px-6 py-3">Value</th>
                        <th scope="col" className="px-6 py-3">Profitability</th>
                        <th scope="col" className="px-6 py-3">RTO Risk</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        Array.from({ length: limit }).map((_, i) => (
                            <tr key={i} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div></td>
                                <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div></td>
                                <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div></td>
                                <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div></td>
                                <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div></td>
                                <td className="px-6 py-4"><div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-28"></div></td>
                            </tr>
                        ))
                    ) : (
                        orders.map(order => (
                            <tr key={order.id} onClick={() => onOrderClick(order)} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{order.id}</td>
                                <td className="px-6 py-4">{order.customer.name}</td>
                                <td className="px-6 py-4">₹{order.orderValue.toFixed(2)}</td>
                                <td className={`px-6 py-4 font-semibold ${order.profitability > 0 ? 'text-green-500' : 'text-red-500'}`}>₹{order.profitability.toFixed(2)}</td>
                                <td className="px-6 py-4"><RiskBadge risk={order.rtoRisk} /></td>
                                <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
        <nav className="flex items-center justify-between pt-4" aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Showing <span className="font-semibold text-gray-900 dark:text-white">{(page-1)*limit + 1}-{Math.min(page*limit, total)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{total}</span></span>
            <div className="inline-flex -space-x-px text-sm h-8">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50">Previous</button>
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50">Next</button>
            </div>
        </nav>
    </Card>
  );
};

export default RecentOrdersWidget;
