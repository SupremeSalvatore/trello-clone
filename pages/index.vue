<template>
  <v-container>
    <v-dialog
      v-model="dialog"
      max-width="355px"
      persistent
      overlay-color="white"
    >
      <v-container class="d-block">
        <v-row no-gutters align="center" justify="space-between">
          <v-row no-gutters>
            <h3>Add Board</h3>
          </v-row>
          <v-icon @click="dialog = false">mdi-close</v-icon>
        </v-row>
        <v-form ref="form" v-model="valid" @submit.prevent="createBoard">
          <div class="d-flex flex-column">
            <v-text-field
              label="Board title"
              name="title"
              type="text"
              :rules="[(v) => !!v || 'Board title is required']"
              required
              autocomplete="off"
              v-model.trim="board.name"
            ></v-text-field>
            <v-select
              v-model="board.prefs_background"
              :items="boardColors"
              label="Standard"
            ></v-select>
            <v-btn type="submit" :disabled="!valid" color="primary">
              Submit
            </v-btn>
          </div>
        </v-form>
      </v-container>
    </v-dialog>
    <div class="d-flex flex-row align-center justify-space-between mb-2">
      <h1>My Boards</h1>
      <v-btn small depressed @click="dialog = true">ADD BOARD</v-btn>
    </div>
    <div class="d-flex flex-wrap align-center justify-start">
      <p v-if="!getBoards.length">You have no boards yet.</p>
      <v-row>
        <v-col
          v-for="board in getBoards"
          :key="board.id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card
            :style="
              `background:${
                board.prefs.backgroundColor
                  ? `${board.prefs.background}`
                  : `url(${board.prefs.backgroundImage}) center`
              }`
            "
            @click="$router.push('/boards/' + board.id)"
            class="tello-board-tile"
          >
            <v-card-title>
              {{ board.name }} <v-spacer></v-spacer>
              <v-icon v-if="board.starred" color="yellow">mdi-star</v-icon>
              <v-icon v-else color="yellow">mdi-star-outline</v-icon>
            </v-card-title>
            <v-card-subtitle class="text-truncate">
              {{ board.desc }}
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  async asyncData({ store, $trelloAPI }) {
    const boardsData = await $trelloAPI.makeRequest({
      path: `members/me/boards`
    });
    console.log(JSON.parse(JSON.stringify(boardsData.json)));
    store.commit('SET_BOARDS', boardsData.json);
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
      }
    };
  },
  computed: {
    ...mapGetters(['getBoards'])
  },
  methods: {
    ...mapMutations(['ADD_BOARD']),
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
          this.ADD_BOARD(createdBoardData.json);
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
