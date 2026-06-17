const http = require('http');
const fs = require('fs');
http.createServer((req, res) => {
  if (req.url === '/error' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => { fs.appendFileSync('d:/Documents/projetLogiciel/error_server.log', body + '\n'); res.end('ok'); });
  } else { res.end('ok'); }
}).listen(9999);
