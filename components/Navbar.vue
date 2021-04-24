<template>
  <div class="d-block">
    <v-container fluid class="navbar">
      <v-row no-gutters align="center" justify="start">
        <v-col cols="1" class="flex-grow-0 flex-shrink-0">
          <v-icon @click="drawer = true">mdi-menu</v-icon>
        </v-col>
        <v-col
          cols="1"
          style="min-width: 100px; max-width:100%;"
          class="flex-grow-1 flex-shrink-0"
        >
          <v-row no-gutters align="center" justify="center">
            <nuxt-link to="/">
              <v-row no-gutters align="center" justify="center">
                <h4 class="text-h4">
                  <span class="font-italic">Trello</span> Clone
                </h4>
              </v-row>
            </nuxt-link>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-navigation-drawer v-model="drawer" fixed left class="d-block drawer1">
      <v-container fluid>
        <v-row no-gutters align="center" justify="space-between">
          <v-icon @click="drawer = false">mdi-close</v-icon>
          <v-row no-gutters align="center" justify="end">
            <p class="trello-user">
              Signed in as<br />
              {{ getUser.email }}
            </p>
            &nbsp;
            <v-icon>mdi-account-circle-outline</v-icon>
          </v-row>
        </v-row>
      </v-container>
      <v-container class="d-block menu-items">
        <div class="d-flex flex-column">
          <div class="d-flex">
            <br />
          </div>
          <div class="d-flex">
            <nuxt-link to="/">
              <v-icon>mdi-view-dashboard-variant-outline</v-icon>&nbsp;&nbsp;<b
                >My Boards</b
              >
            </nuxt-link>
          </div>
          <div class="d-flex">
            <nuxt-link to="/logout">
              <v-icon>mdi-exit-to-app</v-icon>&nbsp;&nbsp;<b>Logout</b>
            </nuxt-link>
          </div>
        </div>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      drawer: false
    };
  },
  computed: {
    ...mapGetters(['getUser'])
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  background-color: rgb(228 228 228 / 35%);
}
.drawer1 {
  transform: none !important;
  transition-property: 'width';
}
.trello-user {
  font-size: 12px;
  margin-bottom: 0px !important;
  text-align: right;
}
a {
  text-decoration: none;
}
.menu-items a {
  // color: $text-color;
  padding: 10px 0px 10px 3px;
  font-size: 24px;
}
</style>
