<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="6" align="center">
      <v-card class="elevation-4 text-left">
        <v-card-title class="fancy-title align-center justify-center"
          >Trello Clone</v-card-title
        >
        <v-form class="text-center pa-4 pt-0" @submit.prevent="login">
          <v-text-field
            label="key"
            name="key"
            prepend-icon="mdi-account"
            type="text"
            v-model="auth.key"
          ></v-text-field>

          <v-text-field
            label="token"
            name="token"
            prepend-icon="mdi-lock"
            type="token"
            v-model="auth.token"
          ></v-text-field>
          <v-btn class="login-button" type="submit" depressed large
            >Login</v-btn
          >
        </v-form>
      </v-card>
      <v-snackbar v-model="snackbar" v-bind="snackbarOpt">
        {{ snackbarText }}
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  layout: 'login',
  data() {
    return {
      snackbarOpt: {
        absolute: true,
        top: true,
        right: true,
        color: 'green',
        timeout: 4000
      },
      snackbar: false,
      snackbarText: 'You have successfully signed in.',
      auth: {
        key: '5651ec366c35346b8724dad0aedcf3d7',
        token:
          'c14c27c6fd5a637370d326645b9b0dcd29513fbce471f5fccfc3bde26a8be034'
      }
    };
  },
  methods: {
    ...mapActions(['onAuthAction']),
    async login() {
      try {
        console.log(this);
        // const loginDataResponse = await fetch(
        //   `https://api.trello.com/1//members/me?key=${this.auth.key}&token=${this.auth.token}`
        // );
        // const loginData = await loginDataResponse?.json();
        const loginData = await this.$trelloAPI.getMember(this.auth);
        console.log(loginData);
        $nuxt.$router.push('/');
        this.onAuthAction(loginData);
        this.snackbar = true;
      } catch (error) {
        console.error(error);
        this.snackbarText = error?.message || err;
        this.snackbar = true;
        this.snackbarOpt.color = 'red';
      } finally {
      }
    }
  }
};
</script>
