import React, { useState } from 'react';

const ProfileOrders: React.FC = () => {
  const [orders] = useState([
    { id: 1, item: 'Sample Product', status: 'Processing' },
    { id: 2, item: 'Premium Rice', status: 'Shipped' },
    { id: 3, item: 'Organic Spices', status: 'Delivered' },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-emerald-700 mb-4">Track Orders</h2>
      <ul className="space-y-4">
        {orders.map(order => (
          <li key={order.id} className="border border-emerald-200 rounded-lg p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold text-emerald-800">Order ID: {order.id}</div>
              <div className="text-gray-700">Item: {order.item}</div>
            </div>
            <div className="mt-2 md:mt-0">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileOrders; 