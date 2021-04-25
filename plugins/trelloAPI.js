export default ({ $config, env }, inject) => {
  let authString = '';
  inject('trelloAPI', {
    getMember,
    makeRequest
  });
  async function getMember(auth) {
    authString = `key=${auth.key}&token=${auth.token}`;
    try {
      const response = await fetch(
        `${env.TRELLO_URL}/members/me?${authString}`
      );
      if (!response.ok) {
        throw Error(
          response.statusText ||
            'Credentials are invalid, please enter valid key and token.'
        );
      }
      const parsedResponse = await response.json();
      return {
        ...response,
        json: parsedResponse
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async function makeRequest({ path, params = {}, method = 'GET', data }) {
    try {
      const requestSettings = {
        method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      if (method === 'PUT') {
        requestSettings.headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
        // requestSettings.body = JSON.stringify(data);
        requestSettings.body = new URLSearchParams(data);
      } else if (method === 'POST') {
        requestSettings.headers = {
          'Content-Type': 'application/json'
        };
        requestSettings.body = JSON.stringify(data);
      }
      const paramsToString = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      const response = await fetch(
        `${env.TRELLO_URL}/${path}?${paramsToString}&${authString}`,
        requestSettings
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const parsedResponse = await response.json();
      return {
        ...response,
        json: parsedResponse
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};
