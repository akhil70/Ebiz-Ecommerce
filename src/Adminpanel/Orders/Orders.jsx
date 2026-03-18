import React from "react";
import { Download, Plus } from "lucide-react";
import "./Orders.css";

const orders = [
  {
    id: "#2453",
    total: "$87",
    customer: "Carry Anna",
    avatar: "https://i.pravatar.cc/80?img=32",
    paymentStatus: "COMPLETE",
    paymentTone: "success",
    fulfillmentStatus: "CANCELLED",
    fulfillmentTone: "gray",
    deliveryType: "Cash on delivery",
    date: "Dec 12, 12:56 PM",
  },
  {
    id: "#2452",
    total: "$7264",
    customer: "Milind Mikuja",
    avatar: "https://i.pravatar.cc/80?img=12",
    paymentStatus: "CANCELLED",
    paymentTone: "gray",
    fulfillmentStatus: "READY TO PICKUP",
    fulfillmentTone: "blue",
    deliveryType: "Free shipping",
    date: "Dec 9, 2:28 PM",
  },
  {
    id: "#2451",
    total: "$375",
    customer: "Stanly Drinkwater",
    avatar: "https://i.pravatar.cc/80?img=14",
    paymentStatus: "PENDING",
    paymentTone: "amber",
    fulfillmentStatus: "COMPLETED",
    fulfillmentTone: "success",
    deliveryType: "Local pickup",
    date: "Dec 4, 12:56 PM",
  },
  {
    id: "#2450",
    total: "$657",
    customer: "Josef Stravinsky",
    avatar: "https://i.pravatar.cc/80?img=19",
    paymentStatus: "CANCELLED",
    paymentTone: "gray",
    fulfillmentStatus: "PARTIALLY FULFILED",
    fulfillmentTone: "amber",
    deliveryType: "Standard shipping",
    date: "Dec 1, 4:07 AM",
  },
  {
    id: "#2449",
    total: "$9562",
    customer: "Igor Borvibson",
    avatar: "https://i.pravatar.cc/80?img=9",
    paymentStatus: "FAILED",
    paymentTone: "red",
    fulfillmentStatus: "PARTIALLY FULFILED",
    fulfillmentTone: "success",
    deliveryType: "Express",
    date: "Nov 28, 7:28 PM",
  },
  {
    id: "#2448",
    total: "$46",
    customer: "Katerina Karenin",
    avatar: "https://i.pravatar.cc/80?img=48",
    paymentStatus: "PAID",
    paymentTone: "success",
    fulfillmentStatus: "UNFULFILED",
    fulfillmentTone: "red",
    deliveryType: "Local delivery",
    date: "Nov 27, 1:16 PM",
  },
];

const StatusPill = ({ text, tone }) => {
  return <span className={`orders-pill ${tone}`}>{text}</span>;
};

export default function Orders() {
  return (
    <div className="orders-page">
      <div className="orders-toolbar">
        <button className="orders-export-btn">
          <Download size={15} />
          Export
        </button>
        <button className="orders-add-btn">
          <Plus size={16} />
          Add order
        </button>
      </div>

      <div className="orders-table-wrap">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ORDER</th>
              <th>TOTAL</th>
              <th>CUSTOMER</th>
              <th>PAYMENT STATUS</th>
              <th>FULFILMENT STATUS</th>
              <th>DELIVERY TYPE</th>
              <th>DATE</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="orders-link">{order.id}</td>
                <td>{order.total}</td>
                <td>
                  <div className="orders-customer-cell">
                    <img src={order.avatar} alt={order.customer} />
                    <span>{order.customer}</span>
                  </div>
                </td>
                <td>
                  <StatusPill text={order.paymentStatus} tone={order.paymentTone} />
                </td>
                <td>
                  <StatusPill text={order.fulfillmentStatus} tone={order.fulfillmentTone} />
                </td>
                <td className="orders-muted">{order.deliveryType}</td>
                <td className="orders-muted">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
