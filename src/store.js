import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// Simple example of using the Vuex package to manage global state.
// Refer to the complete Vuex documentation: https://vuex.vuejs.org/

// Most of the code in this sample uses the most verbose ways to
// access and update global state. Refer to the vuex documentation
// for some nifty ways to make this less painful. For example:
// https://vuex.vuejs.org/guide/state.html#the-mapstate-helper

export default new Vuex.Store({
  // Single source for application state.
  // Cannot update state directly; use a `mutation` (below).
  // Access in components as `this.$store.state.currentAccount`
  state: {
    currentAccount: null
  },

  // A "getter" returns a computed property from the store, similar
  // to a `computed` property in a component.
  // Access in components as `this.$store.getters.isLoggedIn`
  // (Not that it behaves like a property -- no parens.)
  getters: {
    isLoggedIn(state) {
      return state.currentAccount !== null;
    }
  },

  // Make changes to global state.
  // Access in components using the `commit` method:
  // `this.$store.commit('logIn', account)`
  mutations: {
    logIn(state, account) {
      state.currentAccount = account;
    },
    logOut(state) {
      state.currentAccount = null;
    }
  }
});
