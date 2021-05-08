<template>
  <v-container>
    <div v-if="!isLoggedIn">
      <h2>Login to Get Started!</h2>
    </div>
    <div v-if="isLoggedIn">
      <h2>Start Drive!</h2>
      <p> {{this.$store.state.currentAccount}}</p>
    </div>
  </v-container>
</template>

<script>
export default {

  data: function() {
    return {
    };
  },

  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    }
  },

  mounted: function() {
    this.$axios.get(`/drivers/$store.state.currentAccount.id`).then(response => {
        if (response.data.ok) {
            return;
        }
    })
  },
  methods: {
    signOut() {
      this.$store.commit("logOut");
      if (this.$router.currentRoute.name != "home-page") {
        this.$router.push({ name: "home-page" });
      }
    }
  }
};
</script>

<style>
h2{
  font-size: 35px;
}
</style>
