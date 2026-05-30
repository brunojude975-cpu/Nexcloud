export default async function handler(req, res) {
  const API_KEY = process.env.DO_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "DO_API_KEY not set" });
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };
  if (req.method === "GET") {
    const r = await fetch("https://api.digitalocean.com/v2/droplets", { headers });
    const data = await r.json();
    return res.status(r.status).json(data);
  }
  if (req.method === "POST") {
    const r = await fetch("https://api.digitalocean.com/v2/droplets", {
      method: "POST", headers,
      body: JSON.stringify(req.body),
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  }
      }
