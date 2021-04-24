const actions = {
  async onAuthAction(store, user) {
    if (!user) {
      store.commit('SET_USER', null);
      //redirect from here
      this.$router.push({
        path: '/login'
      });
    } else {
      store.commit('SET_USER', user.json);
      this.$router.push({
        path: '/'
      });
    }
  }
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_BOARDS(state, boards) {
    state.boards = boards;
  },
  ADD_BOARD(state, board) {
    state.boards.push(board);
  }
};

const state = () => ({
  user: null,
  boards: []
});

const getters = {
  getUser(state) {
    return state.user;
  },
  getBoards(state) {
    return state.boards;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
