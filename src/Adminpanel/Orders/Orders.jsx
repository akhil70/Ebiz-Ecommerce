import React, { useState, useEffect } from "react";
import { Download, Plus } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../Utils/AxiosConfig";
import NoData from "../Components/NoData";
import "./Orders.css";

const formatCurrency = (value) => {
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
};

const formatDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const paymentTone = (status) => {
  const s = (status || "").toUpperCase().replace(/\s+/g, "_");
  if (
    ["COMPLETE", "COMPLETED", "PAID", "SUCCESS", "SUCCEEDED"].some((x) =>
      s.includes(x)
    )
  )
    return "success";
  if (["PENDING", "PROCESSING", "REQUIRES"].some((x) => s.includes(x)))
    return "amber";
  if (["FAILED", "DECLINED", "REFUNDED"].some((x) => s.includes(x)))
    return "red";
  if (["CANCELLED", "CANCELED", "VOID"].some((x) => s.includes(x)))
    return "gray";
  return "gray";
};

const fulfillmentTone = (status) => {
  const s = (status || "").toUpperCase();
  if (["COMPLETED", "FULFILLED", "DELIVERED"].some((x) => s.includes(x)))
    return "success";
  if (["CANCELLED", "CANCELED"].some((x) => s.includes(x))) return "gray";
  if (["READY", "PICKUP", "SHIPPED"].some((x) => s.includes(x))) return "blue";
  if (["PARTIAL", "PARTIALLY"].some((x) => s.includes(x))) return "amber";
  if (["UNFULFILLED", "UNFULFILED", "UNSHIPPED"].some((x) => s.includes(x)))
    return "red";
  return "gray";
};

const StatusPill = ({ text, tone }) => {
  const label = text?.trim() || "—";
  return <span className={`orders-pill ${tone}`}>{label}</span>;
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await API.get("/orders");
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.data ?? [];
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to fetch orders"
        );
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <div className="orders-toolbar">
        <button type="button" className="orders-export-btn">
          <Download size={15} />
          Export
        </button>
        <button type="button" className="orders-add-btn">
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
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "24px" }}>
                  Loading orders…
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 0, border: "none" }}>
                  <NoData message="No orders found." />
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const email = order.customerEmail ?? "";
                const name = order.customerName ?? "—";
                const avatarSrc = email
                  ? `https://i.pravatar.cc/80?u=${encodeURIComponent(email)}`
                  : `https://i.pravatar.cc/80?u=${encodeURIComponent(order.id || "order")}`;
                return (
                  <tr key={order.id}>
                    <td className="orders-link" title={order.id}>
                      {order.id ?? "—"}
                    </td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                    <td>
                      <div className="orders-customer-cell">
                        <img src={avatarSrc} alt="" />
                        <div className="orders-customer-text">
                          <span>{name}</span>
                          {email ? (
                            <span className="orders-customer-email">{email}</span>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td>
                      <StatusPill
                        text={order.paymentStatus}
                        tone={paymentTone(order.paymentStatus)}
                      />
                    </td>
                    <td>
                      <StatusPill
                        text={order.fulfillmentStatus}
                        tone={fulfillmentTone(order.fulfillmentStatus)}
                      />
                    </td>
                    <td className="orders-muted">
                      {order.deliveryType ?? "—"}
                    </td>
                    <td className="orders-muted">
                      {formatDateTime(order.createdAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
