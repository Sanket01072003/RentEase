import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProductsByOwnerApi,
  deleteProductApi,
  getRentalsByProductApi,
  confirmReturnApi,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const s = {
  page: { maxWidth: 1100, margin: "0 auto", padding: "32px 24px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  title: { fontSize: 28, fontWeight: 700, color: "#1a237e" },
  sub: { fontSize: 14, color: "#888", marginTop: 4 },
  addBtn: {
    background: "#1a237e",
    color: "white",
    border: "none",
    padding: "10px 22px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  statsRow: { display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" },
  statCard: {
    background: "white",
    borderRadius: 10,
    padding: "16px 24px",
    flex: 1,
    minWidth: 120,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  statNum: { fontSize: 28, fontWeight: 700, color: "#1a237e" },
  statLabel: { fontSize: 13, color: "#888", marginTop: 4 },
  tabs: { display: "flex", gap: 8, marginBottom: 24 },
  tab: {
    padding: "10px 24px",
    borderRadius: 8,
    border: "1.5px solid #ddd",
    background: "white",
    color: "#666",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  tabActive: {
    background: "#1a237e",
    color: "white",
    border: "1.5px solid #1a237e",
  },
  card: {
    background: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 14,
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  pName: { fontSize: 16, fontWeight: 700, color: "#1a237e", marginBottom: 4 },
  detail: { fontSize: 13, color: "#666", marginBottom: 2 },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  AVAILABLE: { background: "#e8f5e9", color: "#2e7d32" },
  RENTED: { background: "#fff3e0", color: "#e65100" },
  UNAVAILABLE: { background: "#f5f5f5", color: "#888" },
  ACTIVE: { background: "#e8f5e9", color: "#2e7d32" },
  RETURNED: { background: "#e3f2fd", color: "#1a237e" },
  CANCELLED: { background: "#ffebee", color: "#c62828" },
  actions: { display: "flex", gap: 8 },
  editBtn: {
    background: "#e3f2fd",
    color: "#1a237e",
    border: "1px solid #90caf9",
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  delBtn: {
    background: "#ffebee",
    color: "#c62828",
    border: "1px solid #ef9a9a",
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  retBtn: {
    background: "#e8f5e9",
    color: "#2e7d32",
    border: "1px solid #a5d6a7",
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    padding: "48px 0",
    color: "#aaa",
    fontSize: 15,
  },
};

export default function OwnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);
  // const [rentalsLoaded, setRentalsLoaded] = useState(false);

  // useEffect(() => {
  //   if (!user?.id) return;
  //   getProductsByOwnerApi(user.id)
  //     .then(r => setProducts(r.data || []))
  //     .catch(() => {})
  //     .finally(() => setLoading(false));
  // }, [user]);

  // const loadRentals = async () => {
  //   if (rentalsLoaded) return;
  //   try {
  //     const all = [];
  //     for (const p of products) {
  //       const res = await getRentalsByProductApi(p.productId);
  //       all.push(...(res.data || []));
  //     }
  //     setRentals(all);
  //     setRentalsLoaded(true);
  //   } catch {}
  // };

  // const handleTab = tab => {
  //   setActiveTab(tab);
  //   if (tab === 'rentals') loadRentals();
  // };

  useEffect(() => {
    if (!user?.id) return;

    getProductsByOwnerApi(user.id)
      .then(async (r) => {
        const prods = r.data || [];
        setProducts(prods);

        // ✅ Fetch rentals for all products right away too
        const all = [];
        for (const p of prods) {
          const res = await getRentalsByProductApi(p.productId);
          all.push(...(res.data || []));
        }
        setRentals(all);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleTab = (tab) => {
    setActiveTab(tab);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProductApi(productId);
      toast.success("Product deleted!");
      setProducts((prev) => prev.filter((p) => p.productId !== productId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed!");
    }
  };

  const handleReturn = async (rentalId) => {
    if (!window.confirm("Confirm return? Deposit will be refunded to renter."))
      return;
    try {
      await confirmReturnApi(rentalId);
      toast.success("Return confirmed! Deposit refund initiated.");
      setRentals((prev) =>
        prev.map((r) =>
          r.rentalId === rentalId ? { ...r, status: "RETURNED" } : r,
        ),
      );
      // Update product status too
      setProducts((prev) =>
        prev.map((p) => {
          const rental = rentals.find((r) => r.rentalId === rentalId);
          return rental && p.productId === rental.product?.productId
            ? { ...p, status: "AVAILABLE" }
            : p;
        }),
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed!");
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.title}>Owner Dashboard</div>
          <div style={s.sub}>Welcome, {user?.name}</div>
        </div>
        <button style={s.addBtn} onClick={() => navigate("/owner/add-product")}>
          + Add Product
        </button>
      </div>

      {/* Stats */}
      <div style={s.statsRow}>
        {[
          { label: "My Products", num: products.length },
          {
            label: "Available",
            num: products.filter((p) => p.status === "AVAILABLE").length,
          },
          {
            label: "Rented Out",
            num: products.filter((p) => p.status === "RENTED").length,
          },
          {
            label: "Total Earnings",
            num: `₹${rentals.filter((r) => r.status !== "CANCELLED").reduce((a, r) => a + (r.totalRent || 0), 0)}`,
          },
        ].map((st) => (
          <div key={st.label} style={s.statCard}>
            <div style={s.statNum}>{st.num}</div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        <button
          style={{ ...s.tab, ...(activeTab === "products" ? s.tabActive : {}) }}
          onClick={() => handleTab("products")}
        >
          My Products ({products.length})
        </button>
        <button
          style={{ ...s.tab, ...(activeTab === "rentals" ? s.tabActive : {}) }}
          onClick={() => handleTab("rentals")}
        >
          Rental Requests ({rentals.filter((r) => r.status === "ACTIVE").length}{" "}
          active)
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === "products" &&
        (loading ? (
          <div style={s.empty}>Loading...</div>
        ) : products.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
            <div>No products yet.</div>
            <button
              style={{ ...s.addBtn, marginTop: 16 }}
              onClick={() => navigate("/owner/add-product")}
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          products.map((p) => (
            <div key={p.productId} style={s.card}>
              <div>
                <div style={s.pName}>{p.productName}</div>
                <div style={s.detail}>
                  💰 ₹{p.pricePerDay}/day | Deposit: ₹{p.depositAmount}
                </div>
                <div style={s.detail}>📂 {p.category?.categoryName}</div>
                <span style={{ ...s.badge, ...s[p.status] }}>{p.status}</span>
              </div>
              <div style={s.actions}>
                <button
                  style={s.editBtn}
                  onClick={() => navigate(`/owner/edit-product/${p.productId}`)}
                >
                  ✏️ Edit
                </button>
                <button
                  style={s.delBtn}
                  onClick={() => handleDelete(p.productId)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ))}

      {/* Rentals Tab */}
      {activeTab === "rentals" &&
        (rentals.length === 0 ? (
          <div style={s.empty}>No rental requests yet</div>
        ) : (
          rentals.map((r) => (
            <div key={r.rentalId} style={s.card}>
              <div>
                <div style={s.pName}>{r.product?.productName}</div>
                <div style={s.detail}>
                  📅 {r.fromDate} → {r.toDate}
                </div>
                <div style={s.detail}>
                  💰 Rent: ₹{r.totalRent} | Deposit: ₹{r.depositAmount}
                </div>
                <div style={s.detail}>🏷️ Rental ID: #{r.rentalId}</div>
                <span style={{ ...s.badge, ...s[r.status] }}>{r.status}</span>
              </div>
              <div style={s.actions}>
                {r.status === "ACTIVE" && (
                  <button
                    style={s.retBtn}
                    onClick={() => handleReturn(r.rentalId)}
                  >
                    ✅ Confirm Return
                  </button>
                )}
              </div>
            </div>
          ))
        ))}
    </div>
  );
}
