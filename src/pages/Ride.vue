<template>
<div>
<v-form>
  <v-select 
  v-model="select"
  :hint="`${select.value}, ${select.text}`"
  placeholder="select from location"
  :items="locations"
  persistent-hint
  outlined
  > 
  </v-select>

  <v-select 
  v-model="select"
  :hint="`${select.value}, ${select.text}`"
  placeholder="select destination"
  :items="locations"
  persistent-hint
  outlined
  > 
  </v-select>
</v-form>

<p>
{{locations}}
</p>
</div>
</template>


<script>
export default {
  name: "Locations",

  data: function() {
    return {
      select:{name:'White House', address:'600 Pennsylvania Avenue NW'},
      locations:{name: 'item name', address: 'item address'}
    };
  },

  mounted: function() {
    this.$axios.get("/locations").then(response => {
      this.locations = response.data.map(location => ({
        value: location.address,
        text: location.name
      }));
    });
  },

  methods: {
  }
};
</script>

<style>

</style>
