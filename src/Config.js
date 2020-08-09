const Config = {
  backendUrl: 'http://localhost:4000',
  userToken: null
};
Config.backendEndpoint = (path) => {
  const joinChar = path.includes('?') ? '&' : '?';
  return Config.backendUrl + '/api' + path + joinChar + 'userId=' + Config.userToken;
}

export default Config;