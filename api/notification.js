export default async function handler(req, res) {
  const url = `https:https://mxcrk7vq-5000.asse.devtunnels.ms/hubs/notification${req.url.replace('/api/notification', '')}`;

  const backendRes = await fetch(url, {
    method: req.method,
    headers: { ...req.headers, host: undefined },
    body: req.method === 'GET' || req.method === 'HEAD' ? null : req,
  });

  res.status(backendRes.status);
  backendRes.body.pipe(res);
}
