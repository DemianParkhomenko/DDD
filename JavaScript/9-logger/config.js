module.exports = {
  db: {
    //? url vs params
    host: '127.0.0.1',
    port: 5432,
    database: 'example',
    user: 'marcus',
    password: 'marcus',
  },
  api: {
    port: 8001,
    transport: 'http',
  },
  static: {
    port: 8000,
  },
  load: {
    timeout: 5000,
    displayErrors: false,
  },
};
