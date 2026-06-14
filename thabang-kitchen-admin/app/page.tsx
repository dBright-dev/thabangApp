'use client';

import React, { useState } from 'react';
import { INITIAL_ORDERS, KitchenOrder } from './mockOrders';
import { Flame, Clock, CheckCircle2, ChefHat, Package, ShoppingBag } from 'lucide-react-native'; 
// Note: If developing on standard Next.js web, import from 'lucide-react' directly:
import { 
  Flame as FlameIcon, 
  Clock as ClockIcon, 
  CheckCircle2 as CheckIcon, 
  ChefHat as ChefIcon, 
  Package as PackageIcon, 
  ShoppingBag as BagIcon 
} from 'lucide-react';

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<KitchenOrder[]>(INITIAL_ORDERS);

  // Programmatically forward order status lines upon interaction clicks
  const updateOrderStatus = (orderId: string, nextStatus: KitchenOrder['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: nextStatus } : order
      )
    );
  };

  // Status Filter Categories
  const columns: { title: string; status: KitchenOrder['status']; color: string; icon: React.ReactNode }[] = [
    { title: 'New Tickets', status: 'RECEIVED', color: 'border-red-500/30 text-red-400', icon: <FlameIcon className="text-red-500 w-5 h-5" /> },
    { title: 'In Progress', status: 'PREPARING', color: 'border-orange-500/30 text-orange-400', icon: <ChefIcon className="text-orange-500 w-5 h-5" /> },
    { title: 'Ready for Pickup', status: 'READY', color: 'border-green-500/30 text-green-400', icon: <CheckIcon className="text-green-500 w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-6 lg:p-8 font-sans">
      
      {/* GLOBAL KITCHEN BRAND HEADER BAR */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Thabang Food <span className="text-sm bg-orange-600/20 text-orange-500 px-2.5 py-1 rounded-md border border-orange-500/30 font-bold uppercase tracking-wider">Kitchen Monitor</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Live order orchestration screen optimized for fast kitchen operations.</p>
        </div>
        <div className="flex gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm">
          <div className="text-center px-4 border-r border-zinc-800">
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Active Tickets</p>
            <p className="text-xl font-black text-white mt-0.5">{orders.filter(o => o.status !== 'COMPLETED').length}</p>
          </div>
          <div className="text-center px-2">
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Completed Today</p>
            <p className="text-xl font-black text-green-500 mt-0.5">{orders.filter(o => o.status === 'COMPLETED').length}</p>
          </div>
        </div>
      </header>

      {/* THREE-COLUMN DYNAMIC KITCHEN BOARD PIPELINE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {columns.map((col) => {
          const colOrders = orders.filter(o => o.status === col.status);
          
          return (
            <div key={col.status} className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 min-h-[70vh]">
              
              {/* Column Header */}
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-800/60">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-zinc-300">
                  {col.icon}
                  <span>{col.title}</span>
                </div>
                <span className="bg-zinc-800 text-zinc-300 text-xs font-bold px-2 py-0.5 rounded-full">
                  {colOrders.length}
                </span>
              </div>

              {/* Order Ticket Container Feed */}
              <div className="space-y-4">
                {colOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-zinc-600 border border-dashed border-zinc-800 rounded-xl">
                    <PackageIcon className="w-8 h-8 stroke-[1.5] mb-2" />
                    <p className="text-xs font-medium">Station Clear</p>
                  </div>
                ) : (
                  colOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className={`bg-zinc-900 border rounded-xl p-4 transition-all duration-200 ${
                        order.status === 'RECEIVED' ? 'animate-urgent border-red-500' : 'border-zinc-800'
                      }`}
                    >
                      {/* Ticket Summary Bar */}
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div>
                          <span className="text-xs font-mono font-black text-zinc-500 tracking-wider">#{order.id}</span>
                          <h3 className="text-md font-bold text-white tracking-tight mt-0.5">{order.customerName}</h3>
                        </div>
                        <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800/40">
                          <ClockIcon className="w-3 h-3 text-orange-500" />
                          {order.timestamp}
                        </span>
                      </div>

                      {/* Line Item Quantities */}
                      <div className="space-y-2 border-y border-zinc-800/60 py-3 my-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-sm">
                            <div className="flex items-start gap-3">
                              <span className="font-black text-orange-500 bg-orange-500/10 text-xs min-w-[22px] h-[22px] rounded flex items-center justify-center border border-orange-500/20">
                                {item.quantity}x
                              </span>
                              <span className="font-bold text-zinc-200 flex-1">{item.name}</span>
                            </div>
                            {item.notes && (
                              <p className="ml-8 mt-1 text-xs text-amber-500 font-semibold bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10">
                                ⚠️ Note: {item.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Total Pricing Reference */}
                      <div className="flex justify-between items-center text-xs text-zinc-500 mb-4">
                        <span>Total Paid</span>
                        <span className="font-black text-zinc-300">R{order.totalPrice}</span>
                      </div>

                      {/* ACTION KITCHEN CONTROLLER PIPELINE TRIGGERS */}
                      <div className="mt-2">
                        {order.status === 'RECEIVED' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                            className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white text-xs font-black py-3 rounded-xl transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5"
                          >
                            <ChefIcon className="w-4 h-4" /> Start Preparing
                          </button>
                        )}
                        {order.status === 'PREPARING' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'READY')}
                            className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 text-white text-xs font-black py-3 rounded-xl transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5"
                          >
                            <CheckIcon className="w-4 h-4" /> Mark as Ready
                          </button>
                        )}
                        {order.status === 'READY' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                            className="w-full bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-300 text-xs font-black py-3 rounded-xl transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5 border border-zinc-700/40"
                          >
                            <BagIcon className="w-4 h-4" /> Clear From Board
                          </button>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}