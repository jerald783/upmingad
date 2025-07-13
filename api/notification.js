export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

import http from 'http';
import https from 'https';
import { pipeline } from 'stream';
import { promisify } from 'util';

const target = 'https://mxcrk7vq-5000.asse.devtunnels.ms/hubs/notification'; // ✅ this is your backend

const streamPipeline = promisify(pipeline);

export default async function handler(req, res) {
  const url = new URL(target + (req.url?.replace('/api/notification', '') || ''));

  const proxyReq = https.request(
    {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: req.method,
      headers: {
        ...req.headers,
        host: url.hostname,
      },
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err);
    res.statusCode = 500;
    res.end('Proxy error');
  });

  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    await streamPipeline(req, proxyReq);
  } else {
    proxyReq.end();
  }
}
