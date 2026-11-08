/**
 * Enterprise GitHub App Webhook Daemon
 * Listens for GitHub Pull Request events, executes Unslop AST & Visual checks,
 * and posts real-time comments / checks status to GitHub.
 */

const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = process.env.UNSLOP_PORT || 9095;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const event = req.headers['x-github-event'] || 'pull_request';

        console.log(`[Webhook] Received GitHub Event: ${event}`);

        if (event === 'pull_request' || event === 'issue_comment') {
          const prNumber = payload.pull_request ? payload.pull_request.number : (payload.issue ? payload.issue.number : '0');
          console.log(`[Webhook] Triggering Unslop Gate for PR #${prNumber}...`);

          const botScript = path.resolve(__dirname, '../bot/unslop-pr-bot.js');
          const output = execSync(`node "${botScript}" "${prNumber}"`, { encoding: 'utf8' });
          console.log(`[Webhook] Audit complete for PR #${prNumber}.`);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'success', pr: prNumber, message: 'Unslop Gate executed' }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ignored', event }));
      } catch (err) {
        console.error('[Webhook] Error processing payload:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', service: 'enterprise-unslop-webhook-daemon', version: '1.0.0' }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Enterprise Unslop Webhook Daemon running on http://127.0.0.1:${PORT}`);
});
