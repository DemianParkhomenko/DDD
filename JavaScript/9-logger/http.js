'use strict';

const http = require('node:http');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': 600,
};

const parseBody = async (req) => {
  const buffer = [];
  for await (const chunk of req) buffer.push(chunk);
  const data = Buffer.concat(buffer).toString();
  return JSON.parse(data);
};

//? Why do we need to read signatures
module.exports = (routing, port) => {
  http
    .createServer(async (req, res) => {
      res.writeHead(200, headers);
      if (req.method !== 'POST') return void res.end('"Not found"');
      const { url, socket } = req;
      const [name, method] = url.substring(1).split('/');
      const entity = routing[name];
      if (!entity) return void res.end('Not found');
      const handler = entity[method];
      if (!handler) return void res.end('Not found');
      const body = await parseBody(req);
      console.log(`${socket.remoteAddress} ${method} ${url}`);
      const result = await handler(...body);
      res.end(JSON.stringify(result.rows));
    })
    .listen(port);
  console.log(`API on port ${port}`);
};
