import React, { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown, Download, Plus } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../Utils/AxiosConfig";
import NoData from "../Components/NoData";
import "./Customers.css";

const formatCurrency = (value) => {
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
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

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await API.get("/customers/purchased");
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.data ?? [];
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to fetch customers"
        );
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => {
      const name = (c.customer ?? "").toLowerCase();
      const email = (c.email ?? "").toLowerCase();
      const city = (c.city ?? "").toLowerCase();
      return name.includes(q) || email.includes(q) || city.includes(q);
    });
  }, [customers, search]);

  return (
    <div className="customers-page">
      <div className="customers-toolbar">
        <div className="customers-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search customers"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

       
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
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "24px" }}>
                  Loading customers…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 0, border: "none" }}>
                  <NoData message="No customers found." />
                </td>
              </tr>
            ) : (
              filtered.map((customer) => {
                const name = customer.customer ?? "—";
                const avatarSrc = customer.email
                  ? `https://i.pravatar.cc/80?u=${encodeURIComponent(customer.email)}`
                  : `https://i.pravatar.cc/80?u=${encodeURIComponent(customer.id || "guest")}`;
                return (
                  <tr key={customer.id ?? customer.email}>
                    <td>
                      <div className="customers-user-cell">
                        <img src={avatarSrc} alt="" />
                        <span>{name}</span>
                      </div>
                    </td>
                    <td className="customers-email">{customer.email ?? "—"}</td>
                    <td>{customer.orders ?? 0}</td>
                    <td className="customers-spent">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                    <td>{customer.city ?? "—"}</td>
                    <td className="customers-muted">
                      {formatDateTime(customer.lastSeen)}
                    </td>
                    <td className="customers-muted">
                      {formatDateTime(customer.lastOrder)}
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
