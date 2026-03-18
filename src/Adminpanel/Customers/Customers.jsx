import React from "react";
import { Search, ChevronDown, Download, Plus } from "lucide-react";
import "./Customers.css";

const customers = [
  {
    id: 1,
    name: "Carry Anna",
    email: "annac34@gmail.com",
    orders: 89,
    totalSpent: "$ 23987",
    city: "Budapest",
    lastSeen: "34 min ago",
    lastOrder: "Dec 12, 12:56 PM",
    avatar: "https://i.pravatar.cc/80?img=32",
  },
  {
    id: 2,
    name: "Milind Mikuja",
    email: "mimiku@yahoo.com",
    orders: 76,
    totalSpent: "$ 21567",
    city: "Manchester",
    lastSeen: "6 hours ago",
    lastOrder: "Dec 9, 2:28 PM",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    id: 3,
    name: "Stanly Drinkwater",
    email: "stnlwasser@hotmail.com",
    orders: 69,
    totalSpent: "$ 19872",
    city: "Smallville",
    lastSeen: "43 min ago",
    lastOrder: "Dec 4, 12:56 PM",
    avatar: "https://i.pravatar.cc/80?img=14",
  },
  {
    id: 4,
    name: "Josef Stravinsky",
    email: "Josefsky@sni.it",
    orders: 67,
    totalSpent: "$ 17996",
    city: "Metropolis",
    lastSeen: "2 hours ago",
    lastOrder: "Dec 1, 4:07 AM",
    avatar: "https://i.pravatar.cc/80?img=19",
  },
  {
    id: 5,
    name: "Igor Borvibson",
    email: "vibigorr@technext.it",
    orders: 61,
    totalSpent: "$ 16785",
    city: "Central city",
    lastSeen: "5 days ago",
    lastOrder: "Nov 29, 10:35 PM",
    avatar: "https://i.pravatar.cc/80?img=9",
  },
];

export default function Customers() {
  return (
    <div className="customers-page">
      <div className="customers-toolbar">
        <div className="customers-search">
          <Search size={16} />
          <input type="text" placeholder="Search customers" />
        </div>

        <button className="customers-filter-btn">
          Country <ChevronDown size={15} />
        </button>
        <button className="customers-filter-btn">
          VIP <ChevronDown size={15} />
        </button>
        <button className="customers-filter-btn">More filters</button>

        <button className="customers-export-btn">
          <Download size={15} />
          Export
        </button>
        <button className="customers-add-btn">
          <Plus size={16} />
          Add customer
        </button>
      </div>

      <div className="customers-table-wrap">
        <table className="customers-table">
          <thead>
            <tr>
             
              <th>CUSTOMER</th>
              <th>EMAIL</th>
              <th>ORDERS</th>
              <th>TOTAL SPENT</th>
              <th>CITY</th>
              <th>LAST SEEN</th>
              <th>LAST ORDER</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
               
                <td>
                  <div className="customers-user-cell">
                    <img src={customer.avatar} alt={customer.name} />
                    <span>{customer.name}</span>
                  </div>
                </td>
                <td className="customers-email">{customer.email}</td>
                <td>{customer.orders}</td>
                <td className="customers-spent">{customer.totalSpent}</td>
                <td>{customer.city}</td>
                <td className="customers-muted">{customer.lastSeen}</td>
                <td className="customers-muted">{customer.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
