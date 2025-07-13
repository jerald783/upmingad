export default async function handler(req, res) {
  const backendUrl = `https://https://mxcrk7vq-5000.asse.devtunnels.ms/hubs/notification${req.url.replace('/api/notification', '')}`;

  const response = await fetch(backendUrl, {
    method: req.method,
    headers: {
      ...req.headers,
      host: undefined, // prevent host override
    },
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
  });

  res.status(response.status);
  response.body.pipe(res);
}
