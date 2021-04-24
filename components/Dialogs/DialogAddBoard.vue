<template>
  <v-dialog v-model="dialog" max-width="400px" persistent overlay-color="white">
    <v-card elevation="0">
      <v-container class="d-block">
        <v-row no-gutters align="center" justify="space-between">
          <v-row no-gutters>
            <h3>Add Board</h3>
          </v-row>
          <v-icon @click="closeBoardDialog">mdi-close</v-icon>
        </v-row>
        <v-form ref="form" v-model="valid" @submit.prevent="createBoard">
          <div class="d-flex flex-column">
            <v-text-field
              label="Board name"
              name="name"
              type="text"
              :rules="[(v) => !!v || 'Board name is required']"
              required
              autocomplete="off"
              v-model.trim="board.name"
            ></v-text-field>
            <v-textarea
              label="Description"
              v-model.trim="board.desc"
            ></v-textarea>
            <v-select
              v-model="board.prefs_background"
              :items="boardColors"
              label="Background"
            ></v-select>
            <v-btn type="submit" :disabled="!valid" color="primary">
              Submit
            </v-btn>
          </div>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: {
    value: Boolean
  },
  data() {
    return {
      valid: false,
      boardColors: [
        'blue',
        'orange',
        'green',
        'red',
        'purple',
        'pink',
        'lime',
        'sky',
        'grey'
      ],
      board: {
        desc: '',
        name: '',
        prefs_background: 'orange'
      }
    };
  },
  computed: {
    dialog() {
      return this.value;
    }
  },
  methods: {
    ...mapMutations(['ADD_BOARD']),
    closeBoardDialog() {
      this.board = {
        desc: '',
        name: '',
        prefs_background: 'orange'
      };
      this.$emit('input', false);
    },
    async createBoard() {
      try {
        const requestObj = {
          path: 'boards',
          method: 'POST',
          data: this.board
        };
        const createdBoardData = await this.$trelloAPI.makeRequest(requestObj);
        this.ADD_BOARD(createdBoardData.json);
        this.$emit('input', false);
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>

<style>
.v-dialog {
  border-radius: 15px;
  padding: 15px;
}
</style>
