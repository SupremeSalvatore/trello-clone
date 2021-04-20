<template>
  <v-container>
    <v-dialog v-model="dialog" max-width="355" persistent>
      <v-container class="d-block">
        <v-row no-gutters align="center" justify="space-between">
          <v-row no-gutters>
            <h3>Add Board</h3>
          </v-row>
          <v-icon @click="dialog = false">mdi-close</v-icon>
        </v-row>
        <v-form ref="form" v-model="valid">
          <div class="d-flex flex-column">
            <v-text-field
              label="Board title"
              name="title"
              type="text"
              :rules="[(v) => !!v || 'Board title is required']"
              required
              v-model="board.name"
            ></v-text-field>
            <v-select
              v-model="board.prefs_background"
              :items="boardColors"
              label="Standard"
            ></v-select>
            <v-btn :disabled="!valid" color="primary" @click="createBoard"
              >Submit</v-btn
            >
          </div>
        </v-form>
      </v-container>
    </v-dialog>
    <div class="d-flex flex-row align-center justify-space-between mb-2">
      <h1>My Boards</h1>
      <v-btn small depressed @click="dialog = true">ADD BOARD</v-btn>
    </div>
    <div class="d-flex flex-wrap align-center justify-start">
      <p v-if="boards.length === 0">You have no boards yet.</p>
      <v-row>
        <v-col v-for="board in boards" :key="board.id" cols="12" md="6" lg="4">
          <v-card
            :color="board.prefs.background"
            @click="$router.push('/boards/' + board.id)"
            class="tello-board-tile"
          >
            <v-card-title>
              {{ board.name }}
            </v-card-title>
            <v-card-subtitle class="text-truncate">
              {{ board.desc }}
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-snackbar
      :timeout="3000"
      v-model="snackbar"
      absolute
      bottom
      color="primary"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  async asyncData({ $trelloAPI }) {
    const boardsData = await $trelloAPI.makeRequest({
      path: `members/me/boards`
    });
    console.log(JSON.parse(JSON.stringify(boardsData.json)));
    return { boards: boardsData.json };
  },
  data() {
    return {
      enableColor: false,
      dialog: false,
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
        desc: 'Your Description',
        name: 'My First API board',
        prefs_background: 'orange'
      },
      snackbar: false,
      snackbarText: 'No error message'
    };
  },
  created() {},
  methods: {
    async createBoard() {
      try {
        if (this.$refs.form.validate()) {
          const requestObj = {
            path: 'boards',
            method: 'POST',
            data: this.board
          };
          const createdBoardData = await this.$trelloAPI.makeRequest(
            requestObj
          );
          console.log(JSON.parse(JSON.stringify(createdBoardData)));
          this.boards.push(createdBoardData.json);
          this.dialog = false;
        }
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
.upload-block {
  border: 2px dashed #adadad;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 20px;
}
.v-card__subtitle {
  max-width: 250px;
}
</style>
