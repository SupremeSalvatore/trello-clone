import { unWrap, getErrorResponse } from '~/utils/fetchUtils';

export default ({ $config }, inject) => {
  let authString = '';
  inject('trelloAPI', {
    getMember,
    getBoards,
    createBoard
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
  async function getBoards() {
    try {
      return unWrap(
        await fetch(`https://api.trello.com/1/members/me/boards${authString}`)
      );
    } catch (error) {
      return getErrorResponse(error);
    }
  }
  async function createBoard(boardObj) {
    console.log(JSON.stringify(boardObj));
    try {
      return unWrap(
        await fetch(`https://api.trello.com/1/boards${authString}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(boardObj)
        })
      );
    } catch (error) {
      return getErrorResponse(error);
    }
  }
};
