import { unWrap, getErrorResponse } from '~/utils/fetchUtils';

export default ({ $config }, inject) => {
  let authString = '';
  inject('trelloAPI', {
    getMember,
    makeRequest
  });
  async function getMember(auth) {
    authString = `key=${auth.key}&token=${auth.token}`;
    try {
      return unWrap(
        await fetch(`https://api.trello.com/1/members/me?${authString}`)
      );
    } catch (error) {
      return getErrorResponse(error);
    }
  }
  async function makeRequest({ path, params = {}, method = 'GET', data }) {
    try {
      const requestSettings = {
        method
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
      return unWrap(
        await fetch(
          `https://api.trello.com/1/${path}?${paramsToString}&${authString}`,
          requestSettings
        )
      );
    } catch (error) {
      return getErrorResponse(error);
    }
  }
};
