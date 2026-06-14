export interface KitchenOrder {
  id: string;
  customerName: string;
  timestamp: string;
  status: 'RECEIVED' | 'PREPARING' | 'READY' | 'COMPLETED';
  items: {
    name: string;
    quantity: number;
    notes?: string;
  }[];
  totalPrice: number;
}

export const INITIAL_ORDERS: KitchenOrder[] = [
  {
    id: "TB-1024",
    customerName: "Boluwatife Fayemi",
    timestamp: "12 mins ago",
    status: "PREPARING",
    items: [
      { name: "Phala'ment Kota", quantity: 1, notes: "Extra atchar, no polony" },
      { name: "Chips (Only)", quantity: 1 }
    ],
    totalPrice: 95
  },
  {
    id: "TB-1025",
    customerName: "Sipho Modise",
    timestamp: "Just Now",
    status: "RECEIVED",
    items: [
      { name: "4 Hot/Full Sticky Wings & Chips", quantity: 2, notes: "Make it extra sticky" }
    ],
    totalPrice: 150
  },
  {
    id: "TB-1023",
    customerName: "Lerato Nkomo",
    timestamp: "28 mins ago",
    status: "READY",
    items: [
      { name: "Traditional Boerewors Roll with Onions", quantity: 1 },
      { name: "Pancakes (Pack of 4)", quantity: 1 }
    ],
    totalPrice: 55
  }
];