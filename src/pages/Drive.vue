<template>
  <v-container>
    <div v-if="!isLoggedIn">
      <h2>Login to Get Started!</h2>
    </div>
    <div v-if="isLoggedIn">
      <h2>Drive Anywhere</h2>
      <p> [Current accout]<br> 
        id: {{this.$store.state.currentAccount.id}}<br>
        Name: {{this.$store.state.currentAccount.lastName}} {{this.$store.state.currentAccount.firstName}}<br>
        email: {{this.$store.state.currentAccount.email}}<br><br>
      </p>

      <div v-if="drivers.length > 0">
        Hi, {{this.$store.state.currentAccount.lastName}}!
        <p>
          user id : {{drivers[0].userId}} <br>
          ID: {{ drivers[0].userId }} <br>
          License Number : {{ drivers[0].licenseNumber }} <br>
          License State : {{ drivers[0].licenseState }}
        </p>
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

          <v-btn depressed color="primary" v-on:click="handleSearch">
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
        
        <v-btn v-on:click="driveRide"> Drive </v-btn>
        <v-snackbar v-model="snackbar.show">
          {{ snackbar.msge }}
          <v-btn text color="primary" @click="snackbar.show = false"
            >Close</v-btn
          >
        </v-snackbar>
      </div>

      <div v-else-if="drivers.length === 0">
        Oops! you are not a driver yet. Sign up to get started!
        <v-form v-model="valid">
          <v-text-field
            v-model="newDriver.licenseNumber"
            v-bind:rules="rules.licenseNumber"
            label="license number"
          ></v-text-field>
          <v-text-field
            v-model="newDriver.licenseState"
            v-bind:rules="rules.licenseState"
            label="license state"
          ></v-text-field>
          <v-btn v-bind:disabled="!valid" v-on:click="handleSubmit"
            >Sign Up
          </v-btn>
        </v-form>
        
        <div class="text-xs-center">
          <v-dialog v-model="dialogVisible" width="500">
            <v-card>
              <v-card-title primary-title>
                {{ dialogHeader }}
              </v-card-title>

              <v-card-text>
                {{ dialogText }}
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text v-on:click="hideDialog">Okay</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
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
      drivers: [],
      valid: false,

      newDriver: {
        licenseNumber: "",
        licenseState: "",
      },

      rules: {
        required: [(val) => val.length > 0 || "Required"],
        licenseNumber: [
          (val) => val.length === 8 || "license number must be length of 8",
        ],
        licenseState: [
          (val) =>
            /(NY|IN)/.test(val) || "Sorry only IN or NY available for now.",
        ],
      },
      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,
    };
  },

  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },

  mounted: function () {
    this.$axios
      .get(`/drivers/${this.$store.state.currentAccount.id}`)
      .then((response) => {
        this.drivers = response.data.map((driver) => ({
          id: driver.id,
          userId: driver.userId,
          licenseNumber: driver.licenseNumber,
          licenseState: driver.licenseState,
        }));
      });
    this.$axios.get("/locations").then((response) => {
      this.locations = response.data.map((location) => ({
        value: location.id,
        text: `${location.name}, ${location.address}`
      }));
    });
  },
  methods: {
    handleSearch: function () {
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
    signOut() {
      this.$store.commit("logOut");
      if (this.$router.currentRoute.name != "home-page") {
        this.$router.push({ name: "home-page" });
      }
    },
    handleSubmit: function () {
      // Haven't been successful yet.
      this.driverCreated = false;

      // Post the content of the form to the Hapi server.
      this.$axios
        .post("/driver", {
          userId: this.$store.state.currentAccount.id,
          licenseNumber: this.newDriver.licenseNumber,
          licenseState: this.newDriver.licenseState,
        })
        .then((result) => {
          // Based on whether things worked or not, show the
          // appropriate dialog.
          if (result.data.ok) {
            this.showDialog("Success", result.data.msge);
            this.driverCreated = true;
          } else {
            this.showDialog("Sorry", result.data.msge);
          }
        })
        .catch((err) => this.showDialog("Failed", err));
    },
    // Helper method to display the dialog box with the appropriate content.
    showDialog: function (header, text) {
      this.dialogHeader = header;
      this.dialogText = text;
      this.dialogVisible = true;
    },

    // Invoked by the "Okay" button on the dialog; dismiss the dialog
    // and navigate to the home page.
    hideDialog: function () {
      this.dialogVisible = false;
      if (this.accountCreated) {
        // Only navigate away from the sign-up page if we were successful.
        this.$router.push({ name: "home-page" });
      }
    },
    driveRide: function () {
      this.$axios
        .post("/drive-ride",{
          driverId:  this.drivers[0].id,
          rideId: this.selectRide[0].id
        }).then((result) => {
          this.showSnackbar(result.data.msge);
          if (result.data.ok) {
            this.showDialog("Success", result.data.msge);
            this.accountCreated = true;
          }
        })
        .catch((err) => this.showSnackbar(err));
    },
    showSnackbar(msge) {
      this.snackbar.msge = msge;
      this.snackbar.show = true;
    }
  },
};
</script>

<style>
h2 {
  font-size: 35px;
}
</style>
