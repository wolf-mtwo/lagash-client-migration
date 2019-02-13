let env = process.env.ENVIRONMENT || 'develop';

let config = {
  develop: {
    db: 'mongodb://127.0.0.1:27017/lagash-migration-develop'
  },
  production: {
    db: 'mongodb://mongo:27017/lagash-migration'
  }
};

module.exports = config[env];
