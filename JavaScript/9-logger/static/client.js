'use strict';

//? move to config
//? FE usage
const url = new URL('http://localhost:8001');
const structure = {
  user: {
    create: ['record'],
    read: ['id'],
    update: ['id', 'record'],
    delete: ['id'],
    find: ['mask'],
  },
  country: {
    read: ['id'],
    delete: ['id'],
    find: ['mask'],
  },
};

const createRequestWs = (socket) => async (serviceName, methodName, args) =>
  new Promise((resolve) => {
    const packet = { name: serviceName, method: methodName, args };
    socket.send(JSON.stringify(packet));
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      resolve(data);
    };
  });

const createRequestHttp = (url) => async (serviceName, methodName, args) => {
  const path = `${serviceName}/${methodName}`;
  const response = await fetch(new URL(path, url), {
    method: 'POST', //? ask about methods
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  if (response.ok) {
    return await response.json();
  }
  throw new Error(`${response.url} ${response.statusText}`);
};

const createRequest = (url) => {
  if (url.protocol === 'ws:') {
    const socket = new WebSocket(url);
    return createRequestWs(socket);
  }
  if (url.protocol === 'http:') {
    return createRequestHttp(url);
  }
  throw new Error(`Invalid protocol ${url.protocol}`);
};

const scaffold = (url) => (structure) => {
  const api = {};
  const services = Object.keys(structure);
  const request = createRequest(url);
  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[serviceName][methodName] = (...args) =>
        request(serviceName, methodName, args);
    }
  }
  return api;
};

const api = scaffold(url)(structure);
