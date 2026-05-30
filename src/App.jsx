import { useState, useEffect, useCallback } from "react";
const REGIONS = [
  { id: "nyc1", name: "New York", flag: "🇺🇸" },
  { id: "fra1", name: "Frankfurt", flag: "🇩🇪" },
  { id: "sgp1", name: "Singapore", flag: "🇸🇬" },
  { id: "lon1", name: "London", flag: "🇬🇧" },
  { id: "tor1", name: "Toronto", flag: "🇨🇦" },
  { id: "syd1", name: "Sydney", flag: "🇦🇺" },
];
const SIZES = [
  { id: "s-1vcpu-1gb", label: "Starter", cpu: 1, ram: "1 GB", disk: "25 GB", price: 4 },
  { id: "s-1vcpu-2gb", label: "Basic", cpu: 1, ram: "2 GB", disk: "50 GB", price: 12, popular: true },
  { id: "s-2vcpu-4gb", label: "Standard", cpu: 2, ram: "4 GB", disk: "80 GB", price: 24 },
  { id: "s-4vcpu-8gb", label: "Pro", cpu: 4, ram: "8 GB", disk: "160 GB", price: 48 },
];
export default function App() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);
  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };
  const loadDroplets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/droplets");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setServers(data.droplets || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { loadDroplets(); }, [loadDroplets]);
  const getIP = (s) => s.networks?.v4?.find(n => n.type === "public")?.ip_address || "Pending...";
  const getSize = (slug) => SIZES.find(s => s.id === slug) || { label: slug, cpu: "?", ram: "?", price: 0 };
  const getRegion = (slug) => REGIONS.find(r => r.id === slug) || { flag: "🌍", name: slug };
  const totalCost = servers.reduce((acc, s) => acc + (getSize(s.size_slug)?.price || 0), 0);
  return (
    <div style={{ minHeight: "100vh", background: "#060a10", color: "#f0f4ff", fontFamily: "monospace", padding: 24 }}>
      {notification && (
        <div style={{ position: "fixed", top: 20, right: 20, background: notification.type === "error" ? "#1a0a0a" : "#0a1a10", border: `1px solid ${notification.type === "error" ? "#e74c3c" : "#22d98a"}`, borderRadius: 8, padding: "12px 20px", color: notification.type === "error" ? "#e74c3c" : "#22d98a", zIndex: 9999 }}>
          {notification.msg}
        </div>
      )}
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>⬡ NexCloud</h1>
      <p style={{ color: "#4a5568", marginBottom: 24 }}>Personal Cloud Dashboard · ${totalCost}/mo</p>
      {error && <div style={{ background: "#1a0a0a", border: "1px solid #e74c3c55", borderRadius: 8, padding: 16, color: "#e74c3c", marginBottom: 16 }}>⚠ {error} — Make sure DO_API_KEY is set in Vercel.</div>}
      <button onClick={loadDroplets} style={{ padding: "10px 20px", background: "#3b82f6", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", marginBottom: 24 }}>
        {loading ? "Loading..." : "↻ Refresh Servers"}
      </button>
      {servers.length === 0 && !loading && !error && (
        <div style={{ padding: 40, textAlign: "center", color: "#3a4560", border: "1px solid #1e2330", borderRadius: 12 }}>No servers found. Create one on DigitalOcean!</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {servers.map(s => {
          const reg = getRegion(s.region?.slug);
          const sz = getSize(s.size_slug);
          return (
            <div key={s.id} style={{ background: "#0d1117", border: "1px solid #1e2330", borderRadius: 12, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.status === "active" ? "#22d98a" : "#e74c3c" }} />
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</span>
                </div>
                <div style={{ color: "#4a5568", fontSize: 11 }}>{reg.flag} {reg.name} · {getIP(s)}</div>
                <div style={{ color: "#4a5568", fontSize: 11 }}>{sz.cpu} CPU · {sz.ram} · ${sz.price}/mo</div>
              </div>
              <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, background: s.status === "active" ? "rgba(34,217,138,0.1)" : "rgba(231,76,60,0.1)", color: s.status === "active" ? "#22d98a" : "#e74c3c" }}>{s.status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
   }
