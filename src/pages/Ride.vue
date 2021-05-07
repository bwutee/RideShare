<template>
  <v-container>
    <div>
      <h4 class="display-1">Rides</h4>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Locations",

  data: function() {
    return {
      locations: [{text: 'Select One', value: null}]
    };
  },

  mounted: function() {
    this.$axios.get("/locations").then(response => {
      this.locations = response.data.map(location => ({
        value: location.name,
        text: location.address
      }));
    });
  },

  methods: {
  }
};
</script>

<style>
.currentAccount {
  background: lightcoral;
}
</style>
