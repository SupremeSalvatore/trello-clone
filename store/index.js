const actions = {
  async onAuthAction(state, user) {
    if (!user) {
      state.commit('SET_USER', null);
      //redirect from here
      this.$router.push({
        path: '/login'
      });
    } else {
      state.commit('SET_USER', user);
      this.$router.push({
        path: '/'
      });
    }
  }
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  }
};

const state = () => ({
  user: null
});

const getters = {
  getUser(state) {
    return state.user;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
