<template>
  <h1>Logout</h1>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  created() {
    console.log('created');
    this.onAuthAction(null);
  },
  methods: {
    ...mapActions(['onAuthAction'])
  }
};
</script>

<style></style>
