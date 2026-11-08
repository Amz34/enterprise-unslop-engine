const http = require('http');

const PORT = 9090;

const server = http.createServer((req, res) => {
  const targetPort = req.url.startsWith('/webhook') ? 9095 : 9096;
  const proxyReq = http.request({
    hostname: '127.0.0.1',
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: req.headers
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Gateway upstream unavailable', details: err.message }));
  });

  req.pipe(proxyReq, { end: true });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`⚡ Enterprise Gateway reverse-proxy active on http://127.0.0.1:${PORT}`);
});
