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
  data() {
    return {
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
      snackbarText: '',
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
        const loginData = await this.$trelloAPI.getMember(this.auth);
        console.log(loginData);
        this.$router.push('/');
        this.onAuthAction(loginData);
      } catch (error) {
        console.error(error);
        this.snackbarOpt.message = error?.message || err;
        this.snackbarOpt.isVisible = true;
      } finally {
      }
    }
  }
};
</script>
