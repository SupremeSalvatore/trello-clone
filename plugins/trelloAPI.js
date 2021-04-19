import { unWrap, getErrorResponse } from '~/utils/fetchUtils';

export default ({ $config }, inject) => {
  let authString = '';
  inject('trelloAPI', {
    getMember,
    makeRequest
  });
  async function getMember(auth) {
    authString = `?key=${auth.key}&token=${auth.token}`;
    try {
      return unWrap(
        await fetch(`https://api.trello.com/1/members/me${authString}`)
      );
    } catch (error) {
      return getErrorResponse(error);
    }
  }
  async function makeRequest(path, method = 'GET', data) {
    try {
      const requestSettings = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      if (method === 'PUT' || method === 'POST') {
        requestSettings.body = JSON.stringify(data);
      }
      return unWrap(
        await fetch(
          `https://api.trello.com/1/${path}${authString}`,
          requestSettings
        )
      );
    } catch (error) {
      return getErrorResponse(error);
    }
  }
};
