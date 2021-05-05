<template>
  <v-app-bar app dark color="primary">
    <router-link v-bind:to="{ name: 'home-page' }">
      <v-toolbar-title class="white--text">
        Single Page App
      </v-toolbar-title>
    </router-link>

    <v-spacer></v-spacer>

    <v-btn text v-bind:to="{ name: 'drive' }">
      Drive
    </v-btn>
    <v-btn text v-bind:to="{ name: 'ride' }">
      Ride
    </v-btn>
    <v-btn v-if="!isLoggedIn" text v-bind:to="{ name: 'sign-up' }">
      Sign Up
    </v-btn>
    <v-btn v-if="!isLoggedIn" text v-bind:to="{ name: 'sign-in' }">
      Sign In
    </v-btn>
    <v-btn text v-bind:to="{ name: 'about-us' }">About Us</v-btn>

    <v-menu v-if="isLoggedIn" offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          <v-icon dark>mdi-account</v-icon>
          <span>{{ $store.state.currentAccount.firstName }}</span>
          <v-icon dark>mdi-menu-down</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-bind:to="{ name: 'accounts' }">
          <v-list-item-title>Accounts</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>
		<v-list-item v-bind:to="{ name: 'reset-password' }">
			<v-list-item-title>Reset Password </v-list-item-title>
		</v-list-item>
		<v-divider></v-divider>
		
        <v-list-item @click="signOut">
          <v-list-item-title>Sign Out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    }
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
