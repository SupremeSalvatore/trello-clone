<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="8" align="center">
      <v-card class="elevation-4 text-left">
        <v-card-title class="align-center justify-center primary--text">
          <h4 class="text-h4">
            <span class="font-italic">Trello</span> Clone
          </h4></v-card-title
        >
        <v-card-subtitle>
          Get your key and token on this
          <a href="https://trello.com/app-key" target="_blank">link.</a>
        </v-card-subtitle>
        <v-form
          v-model="formValid"
          class="text-center pa-4 pt-0"
          @submit.prevent="login"
        >
          <v-text-field
            label="Key"
            name="key"
            prepend-icon="mdi-account"
            type="text"
            :rules="[(v) => !!v || 'Key is required']"
            required
            v-model.trim="auth.key"
          ></v-text-field>

          <v-text-field
            label="Token"
            name="token"
            prepend-icon="mdi-lock"
            type="token"
            :rules="[(v) => !!v || 'Token is required']"
            required
            v-model.trim="auth.token"
          ></v-text-field>
          <v-btn
            :disabled="!formValid"
            color="primary"
            type="submit"
            depressed
            large
            >Login</v-btn
          >
        </v-form>
      </v-card>
      <v-snackbar v-model="snackbarOpt.isVisible" v-bind="snackbarOpt">
        {{ snackbarOpt.message }}
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  layout: 'login',
  asyncData({ env }) {
    return { auth: { key: env.TRELLO_KEY, token: env.TRELLO_TOKEN } };
  },
  data() {
    return {
      formValid: false,
      snackbarOpt: {
        isVisible: false,
        absolute: true,
        top: true,
        right: true,
        color: 'red',
        timeout: 4000,
        message: ''
      },
      snackbar: false,
      snackbarText: ''
      // auth: {
      //   key: this.TRELLO_KEY,
      //   token: this.TRELLO_TOKEN
      // }
    };
  },
  methods: {
    ...mapActions(['onAuthAction']),
    async login() {
      try {
        const loginData = await this.$trelloAPI.getMember(this.auth);
        this.$router.push('/');
        this.onAuthAction(loginData);
      } catch (error) {
        this.snackbarOpt.message = error?.statusText || error;
        this.snackbarOpt.isVisible = true;
      }
    }
  }
};
</script>
