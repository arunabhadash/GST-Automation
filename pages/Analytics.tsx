import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '../components/ui/Card';
import { Order, OrderStatus, RtoRiskLevel } from '../types';
import { getRecentOrders } from '../services/apiService';
import OrderPnlModal from '../components/dashboard/OrderPnlModal';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';

// Mock data for analytics widgets
const mockProfitHistory = [
    { name: 'Jan', profit: 380000 }, { name: 'Feb', profit: 410000 },
    { name: 'Mar', profit: 450000 }, { name: 'Apr', profit: 420000 },
    { name: 'May', profit: 482590 }, { name: 'Jun', profit: 510000 }
];

const mockRtoByCourier = [
    { name: 'Delhivery', RTOs: 42 }, { name: 'Shiprocket', RTOs: 35 },
    { name: 'BlueDart', RTOs: 18 }, { name: 'Ecom Express', RTOs: 25 }
];

const mockRtoByReason = [
    { name: 'Customer N/A', value: 45 },
    { name: 'Bad Address', value: 30 },
    { name: 'Refused', value: 20 },
    { name: 'Other', value: 5 },
];
const COLORS = ['#2563eb', '#60a5fa', '#93c5fd', '#bfdbfe'];

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const colorClasses: { [key in OrderStatus]: string } = {
        [OrderStatus.PENDING]: 'text-light-grey',
        [OrderStatus.PROCESSING]: 'text-primary',
        [OrderStatus.SHIPPED]: 'text-primary',
        [OrderStatus.DELIVERED]: 'text-success',
        [OrderStatus.CANCELLED]: 'text-danger',
        [OrderStatus.RTO_INITIATED]: 'text-warning',
        [OrderStatus.RTO_DELIVERED]: 'text-warning',
    };
    return <span className={`text-xs font-semibold ${colorClasses[status]}`}>{status}</span>;
};

const RiskBadge: React.FC<{ risk: RtoRiskLevel }> = ({ risk }) => {
    const colorClasses: { [key in RtoRiskLevel]: string } = {
        [RtoRiskLevel.LOW]: 'text-success',
        [RtoRiskLevel.MEDIUM]: 'text-warning',
        [RtoRiskLevel.HIGH]: 'text-danger font-bold',
    };
    return <span className={`text-sm ${colorClasses[risk]}`}>{risk} Risk</span>
}

const Analytics: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const limit = 10;

    const fetchOrders = useCallback(async (pageNum: number) => {
        setLoading(true);
        try {
            const data = await getRecentOrders(pageNum, limit);
            setOrders(data.orders);
            setTotal(data.total);
        } catch (error) {
            console.error("Failed to fetch recent orders:", error);
            toast.error("Failed to fetch order data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders(page);
    }, [page, fetchOrders]);
    
    const totalPages = Math.ceil(total / limit);
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percent * 100 < 5) return null;

        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="container mx-auto">
            {selectedOrder && <OrderPnlModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
            <h2 className="text-3xl sm:text-4xl font-light mb-6 text-charcoal">Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <h3 className="text-lg font-bold text-charcoal mb-4">Net Profit History</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockProfitHistory} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={(val) => `₹${val/1000}k`} tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.25rem' }}/>
                                <Legend />
                                <Line type="monotone" dataKey="profit" name="Net Profit" stroke="#2563eb" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-bold text-charcoal mb-4">RTO Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 h-[22rem] gap-4">
                        <div className="flex flex-col">
                            <h4 className="font-semibold text-charcoal text-center mb-2">By Courier</h4>
                            <div className="flex-grow">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={mockRtoByCourier} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis type="number" tick={{ fontSize: 12 }} />
                                        <YAxis type="category" dataKey="name" tick={{ fontSize: 12, width: 80 }} />
                                        <Tooltip 
                                            contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.25rem' }}
                                            formatter={(value: number) => [`${value} RTOs`, '']}
                                            cursor={{fill: 'rgba(0,0,0,0.05)'}}
                                        />
                                        <Bar dataKey="RTOs" fill="#2563eb" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h4 className="font-semibold text-charcoal text-center mb-2">By Reason</h4>
                             <div className="flex-grow">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={mockRtoByReason} 
                                            dataKey="value" 
                                            nameKey="name" 
                                            cx="50%" 
                                            cy="50%" 
                                            outerRadius={80} 
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                        >
                                            {mockRtoByReason.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.25rem' }}
                                            formatter={(value: number, name: string) => {
                                                const total = mockRtoByReason.reduce((acc, curr) => acc + curr.value, 0);
                                                const percentage = ((value / total) * 100).toFixed(1);
                                                return [`${value} (${percentage}%)`, name];
                                            }}
                                        />
                                        <Legend iconSize={10} wrapperStyle={{fontSize: "12px", paddingTop: '10px'}}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <Card>
                <h3 className="text-lg font-bold text-charcoal mb-4">Recent Orders</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-light-grey">
                        <thead className="text-xs text-charcoal uppercase bg-white">
                            <tr>
                                <th scope="col" className="px-2 py-3 sm:px-6 font-medium">Order ID</th>
                                <th scope="col" className="px-2 py-3 sm:px-6 font-medium">Customer</th>
                                <th scope="col" className="px-2 py-3 sm:px-6 font-medium">Value</th>
                                <th scope="col" className="px-2 py-3 sm:px-6 font-medium">Profitability</th>
                                <th scope="col" className="px-2 py-3 sm:px-6 font-medium">RTO Risk</th>
                                <th scope="col" className="px-2 py-3 sm:px-6 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: limit }).map((_, i) => (
                                    <tr key={i} className="bg-white border-b border-gray-200">
                                        <td className="px-2 py-4 sm:px-6"><div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div></td>
                                        <td className="px-2 py-4 sm:px-6"><div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div></td>
                                        <td className="px-2 py-4 sm:px-6"><div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div></td>
                                        <td className="px-2 py-4 sm:px-6"><div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div></td>
                                        <td className="px-2 py-4 sm:px-6"><div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div></td>
                                        <td className="px-2 py-4 sm:px-6"><div className="h-6 bg-gray-200 rounded-full animate-pulse w-28"></div></td>
                                    </tr>
                                ))
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id} onClick={() => setSelectedOrder(order)} className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                                        <td className="px-2 py-4 sm:px-6 font-medium text-charcoal whitespace-nowrap">{order.id}</td>
                                        <td className="px-2 py-4 sm:px-6 text-charcoal">{order.customer.name}</td>
                                        <td className="px-2 py-4 sm:px-6 text-charcoal">{formatCurrency(order.orderValue)}</td>
                                        <td className={`px-2 py-4 sm:px-6 font-semibold ${order.profitability >= 0 ? 'text-success' : 'text-danger'}`}>{formatCurrency(order.profitability)}</td>
                                        <td className="px-2 py-4 sm:px-6"><RiskBadge risk={order.rtoRisk} /></td>
                                        <td className="px-2 py-4 sm:px-6"><StatusBadge status={order.status} /></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <nav className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4 sm:gap-0" aria-label="Table navigation">
                    <span className="text-xs font-normal text-light-grey">Showing <span className="font-semibold text-charcoal">{(page-1)*limit + 1}-{Math.min(page*limit, total)}</span> of <span className="font-semibold text-charcoal">{total}</span></span>
                    <div className="inline-flex -space-x-px text-xs h-8">
                       <Button size="sm" variant="secondary" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>Previous</Button>
                       <Button size="sm" variant="secondary" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="ml-2">Next</Button>
                    </div>
                </nav>
            </Card>

        </div>
    );
};

export default Analytics;
