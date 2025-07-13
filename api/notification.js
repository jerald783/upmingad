// api/notification.js
export const config = {
  api: {
    bodyParser: false,   // disable built-in body parsing
    externalResolver: true  // allow streaming response
  }
};

export default async function handler(req, res) {
  const targetUrl = `https://mxcrk7vq-5000.asse.devtunnels.ms/hubs/notification${req.url.replace('/api/notification', '')}`;

  // Proxy the request
  const proxyRes = await fetch(targetUrl, {
    method: req.method,
    headers: {
      ...req.headers,
      host: undefined, // avoid mismatched Host header
    },
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
  });

  // Set status and headers
  res.status(proxyRes.status);
  for (const [key, value] of proxyRes.headers.entries()) {
    res.setHeader(key, value);
  }

  // Pipe the proxied response back
  proxyRes.body.pipe(res);
}
