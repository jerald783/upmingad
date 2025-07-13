// pages/api/notification.js or api/notification.js (for Vercel Serverless Functions)

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

const target = 'https://mxcrk7vq-5000.asse.devtunnels.ms/hubs/notification';
const streamPipeline = promisify(pipeline);

export default async function handler(req, res) {
  const { method, headers, url } = req;

  const path = req.url.replace('/api/notification', '');
  const backendUrl = new URL(target + path);

  const proxyReq = https.request(
    {
      method,
      hostname: backendUrl.hostname,
      path: backendUrl.pathname + backendUrl.search,
      headers: {
        ...headers,
        host: backendUrl.hostname, // important fix
      },
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', (err) => {
    console.error('Proxy request error:', err);
    res.statusCode = 500;
    res.end('Proxy error');
  });

  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    await streamPipeline(req, proxyReq);
  } else {
    proxyReq.end();
  }
}
