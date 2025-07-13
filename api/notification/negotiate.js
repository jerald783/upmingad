import fetch from 'node-fetch';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  const backendUrl = 'https://https://mxcrk7vq-5000.asse.devtunnels.ms/hubs/notification/negotiate' + req.url.replace('/api/notification/negotiate','');
  const backendRes = await fetch(backendUrl, {
    method: 'POST',
    headers: req.headers,
    body: req.body
  });
  res.status(backendRes.status).set(Object.fromEntries(backendRes.headers)).send(await backendRes.text());
}
