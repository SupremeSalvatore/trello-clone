<template>
  <v-container>
    <DialogAddBoard v-model="dialog" />
    <div class="d-flex flex-row align-center justify-space-between mb-2">
      <h1>My Boards</h1>
      <v-btn small depressed @click="dialog = true">
        ADD BOARD
      </v-btn>
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
          <nuxt-link :to="`/boards/${board.id}`" class="text-decoration-none">
            <v-card
              :style="attachBackground(board.prefs)"
              class="tello-board-tile"
            >
              <v-card-title>
                {{ board.name }} <v-spacer></v-spacer>
                <v-icon v-if="board.starred" color="yellow">mdi-star</v-icon>
                <v-icon v-else color="yellow">mdi-star-outline</v-icon>
              </v-card-title>
              <v-card-subtitle class="text-truncate" :title="board.desc">
                {{ board.desc }}
              </v-card-subtitle>
            </v-card>
          </nuxt-link>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

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
      dialog: false
    };
  },
  computed: {
    ...mapGetters(['getBoards'])
  },
  methods: {
    attachBackground(boardPrefs) {
      return {
        background: boardPrefs.backgroundColor
          ? boardPrefs.background
          : `url(${boardPrefs.backgroundImage}) center`
      };
    }
  }
};
</script>
<style>
.v-card__subtitle {
  max-width: 250px;
}
</style>
