export default async function handler(req, res) {
  const API_KEY = process.env.DO_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "DO_API_KEY not set" });
  const { id, action } = req.query;
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };
  if (req.method === "DELETE") {
    const r = await fetch(`https://api.digitalocean.com/v2/droplets/${id}`, {
      method: "DELETE", headers,
    });
    return res.status(r.status).json({ success: r.status === 204 });
  }
  if (req.method === "POST" && action) {
    const r = await fetch(`https://api.digitalocean.com/v2/droplets/${id}/actions`, {
      method: "POST", headers,
      body: JSON.stringify({ type: action }),
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  }
      }
