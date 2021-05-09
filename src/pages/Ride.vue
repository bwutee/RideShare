<template>
  
  <div>
    <div v-if="!isLoggedIn">
      Please log in to get started
    </div>
    <div v-else-if="isLoggedIn">
      <!--search ride : {{searchRides}}-->
      <v-form>
        From: {{ fromLocation }}
        <v-select
          v-model="fromLocation"
          placeholder="select from location"
          :items="locations"
          outlined
        >
        </v-select>
        to: {{ toLocation }}
        <v-select
          v-model="toLocation"
          placeholder="select destination"
          :items="locations"
          outlined
        >
        </v-select>

        <v-btn depressed color="primary" v-on:click="handleSubmit">
          Search
        </v-btn>
      </v-form>
        selected: {{selectRide}}
      <v-data-table
        v-model="selectRide"
        :headers="headers"
        :items="searchRides"
        single-select
        item-key="id"
        show-select
        class="elevation-1"
      >
      </v-data-table>
      <v-btn v-on:click="joinRide">
        Join
      </v-btn>
      <v-snackbar v-model="snackbar.show">
        {{ snackbar.msge }}
        <v-btn text color="primary" @click="snackbar.show = false">Close</v-btn>
      </v-snackbar>
    </div>
  </div>
</template>


<script>
export default {
  name: "Locations",
  data: function () {
    return {
      selectRide : null,
      fromLocation: "",
      toLocation: "",
      locations: { name: "item name", address: "item address" },
      headers: [
        { text: "id", value: "id"},
        { text: "Date", value: "date" },
        { text: "Time", value: "time" },
        { text: "fee", value: "fee"},
        { text: "vehicle id", value: "vehicleId"}
      ],
      searchRides: [],
      snackbar: {
        show: false,
        msge: "",
      },
    };
  },

  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    }
  },

  mounted: function () {
    this.$axios.get("/locations").then((response) => {
      this.locations = response.data.map((location) => ({
        value: location.id,
        text: `${location.name}, ${location.address}`
      }));
    });

  },

  methods: {
    handleSubmit: function () {
      // Post the content of the form to the Hapi server.
      this.$axios
        .get(`/rides/${this.fromLocation}/to/${this.toLocation}`)
        .then((result) => {
          this.searchRides = result.data.map(ride => ({
          id: ride.id,
          date: ride.date,
          time: ride.time,
          fee: ride.fee,
          vehicleId: ride.vehicleId
        }));
        })
        .catch((err) => this.showDialog("Failed", err));
    },
    joinRide: function () {
      this.$axios
        .post("/join-ride",{
          userId: this.$store.state.currentAccount.id,
          rideId: this.selectRide[0].id
        }).then((result) => {
          this.showSnackbar(result.data.msge);
          if (result.data.ok) {
            this.$store.commit("logIn", result.data.details);
            this.$router.push({ name: "home-page" });
          }
        })
        .catch((err) => this.showSnackbar(err));
    },

    showSnackbar(msge) {
      this.snackbar.msge = msge;
      this.snackbar.show = true;
    },
  },
};
</script>

<style>
</style>
