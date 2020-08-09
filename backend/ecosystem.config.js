module.exports = {
  apps : [{
    name: 'server',
    script: './bin/www',
    env: {
      NODE_ENV: 'production',
      PORT: '8080'
    }
  }]
};
