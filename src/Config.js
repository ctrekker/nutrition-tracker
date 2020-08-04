const Config = {
  backendUrl: 'http://localhost:4000',
  userToken: null
};
Config.backendEndpoint = (path) => Config.backendUrl + '/api' + path + '?userId=' + Config.userToken;

export default Config;