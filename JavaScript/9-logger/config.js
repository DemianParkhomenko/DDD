module.exports = {
  db: {
    host: '127.0.0.1',
    port: 5432,
    database: 'example',
    user: 'marcus',
    password: 'marcus',
  },
  api: {
    port: 8001,
  },
  static: {
    port: 8000,
  },
  vm: {
    timeout: 5000,
    displayErrors: false,
  },
};
