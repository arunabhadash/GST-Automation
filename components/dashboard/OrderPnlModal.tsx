import React from 'react';
import { Order } from '../../types';
import { XMarkIcon } from '../icons/Icons';

interface OrderPnlModalProps {
  order: Order;
  onClose: () => void;
}

const PnlRow: React.FC<{ label: string; value: number; color?: string; isBold?: boolean; isTotal?: boolean }> = ({ label, value, color, isBold, isTotal }) => (
  <div className={`flex justify-between py-2 ${isTotal ? 'border-t border-gray-200 mt-2 pt-2' : ''}`}>
    <span className={`text-sm ${isBold ? 'font-semibold text-charcoal' : 'text-light-grey'}`}>{label}</span>
    <span className={`text-sm font-semibold ${color || 'text-charcoal'}`}>
      {value < 0 ? '-' : ''}₹{Math.abs(value).toFixed(2)}
    </span>
  </div>
);


const OrderPnlModal: React.FC<OrderPnlModalProps> = ({ order, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-charcoal">Order P&L: {order.id}</h2>
          <button onClick={onClose} className="text-light-grey hover:text-charcoal">
            <XMarkIcon />
          </button>
        </div>
        <div className="p-6">
            <h3 className="font-semibold mb-2 text-charcoal">Revenue</h3>
            <PnlRow label="Sale Price" value={order.orderValue} />
            
            <h3 className="font-semibold mt-4 mb-2 text-charcoal">Costs</h3>
            <PnlRow label="Product Cost" value={-order.productCost} color="text-danger" />
            <PnlRow label="Shipping Fees" value={-order.shippingFee} color="text-danger" />
            <PnlRow label="GST Payable" value={-order.taxAmount} color="text-danger" />
            {order.rtoCost > 0 && <PnlRow label="RTO Cost" value={-order.rtoCost} color="text-danger" />}

            <PnlRow 
              label="Net Profit" 
              value={order.profitability} 
              isBold 
              isTotal 
              color={order.profitability >= 0 ? 'text-success' : 'text-danger'} 
            />
        </div>
         <div className="p-6 bg-gray-50 rounded-b-lg">
             <h3 className="font-semibold mb-2 text-charcoal">Customer Details</h3>
             <p className="text-sm text-charcoal">{order.customer.name}</p>
             <p className="text-sm text-light-grey">{order.customer.address.street}, {order.customer.address.city}, {order.customer.address.pinCode}</p>
         </div>
      </div>
    </div>
  );
};

export default OrderPnlModal;