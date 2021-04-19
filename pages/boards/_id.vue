<template>
  <v-container>
    <div
      class="d-flex flex-column board"
      :style="board.color ? `background-color:${board.color}` : ''"
    >
      <h1>
        {{ board.name }}
        <v-icon small @click="deleteBoard()">mdi-delete-outline</v-icon>
      </h1>
      <small>{{ board.description }}</small>
      <div class="d-flex flex-row pr-6 pt-3">
        <div
          v-for="list in board.lists"
          @drop="drop($event, list.id)"
          @dragover="allowDrop($event)"
          class="d-flex flex-column pt-3 mr-6 list"
          v-bind:key="list.id"
        >
          <div class="d-flex flex-row justify-space-between">
            <h4>{{ list.name }}</h4>
            <v-icon small @click="archiveList(list.id)"
              >mdi-delete-outline</v-icon
            >
          </div>

          <!--display cards-->
          <v-card
            v-for="card in list.cards"
            :draggable="true"
            @dragover.prevent
            @dragstart="drag($event, card)"
            class="mt-5"
            @click="editCard(card)"
            v-bind:key="card.id"
          >
            <v-card-text> {{ card.title }} </v-card-text>
          </v-card>

          <v-btn
            depressed
            @click="
              dialogCard = true;
              listId = list.id;
            "
            class="mt-auto"
            >Add card</v-btn
          >
        </div>
        <v-dialog v-model="dialogCard" persistent max-width="600px">
          <v-card elevation="0">
            <v-card-title>
              <span class="headline">Card name</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Stuff to do"
                      v-model="card.title"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogCard = false">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="createCard()">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <div class="d-flex flex-row">
          <v-btn depressed @click="dialog = true" class="create-list"
            >Create new list</v-btn
          >
          <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card elevation="0">
              <v-card-title>
                <span class="headline">List name</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Stuff to do"
                        v-model="list.name"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">
                  Close
                </v-btn>
                <v-btn color="blue darken-1" text @click="createList()">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <v-dialog v-model="dialogEditCard" persistent max-width="600px">
          <v-card elevation="0">
            <v-card-title>
              <span class="headline">{{ currentCard.title }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Edit title"
                      v-model="currentCard.title"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="deleteCard()">
                Delete
              </v-btn>
              <v-btn color="blue darken-1" text @click="dialogEditCard = false">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="updateCard()">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      listId: '',
      list: {
        // id: '',
        name: ''
        // idBoard: this.$route.params.id
      },
      card: {
        title: ''
      },
      currentCard: {},
      cardDraggedId: '',
      cardDraggedListId: '',
      dialog: false,
      dialogCard: false,
      dialogEditCard: false,
      drawer: false
    };
  },
  async asyncData({ $trelloAPI, params }) {
    const [boardData, boardLists] = await Promise.all([
      $trelloAPI.makeRequest(`boards/${params.id}`),
      $trelloAPI.makeRequest(`boards/${params.id}/lists`)
    ]);
    return { board: { ...boardData.json, lists: boardLists.json } };
  },
  created() {
    console.log(this.board);
  },
  methods: {
    async createList() {
      console.log(JSON.parse(JSON.stringify(this.list)));
      const listData = await this.$trelloAPI.makeRequest(
        `boards/${this.board.id}/lists`,
        'POST',
        this.list
      );
      console.log(JSON.parse(JSON.stringify(listData.json)));
      this.board.lists.push(listData.json);
      this.dialog = false;
    },

    async updateCardList(newlistId) {},

    async archiveList(listId) {
      await this.$trelloAPI.makeRequest(`lists/${listId}/closed`, 'PUT', {
        value: true
      });
      this.board.lists = this.board.lists.filter((list) => list.id !== listId);
    },
    async createCard() {},
    editCard(card) {
      this.dialogEditCard = true;
      this.currentCard = card;
    },
    async updateCard() {},
    async deleteCard() {},
    async deleteBoard() {
      await this.$trelloAPI.makeRequest(`boards/${this.board.id}`, 'DELETE');
      this.$router.push('/');
    },
    async updateBoard() {}
  }
};
</script>

<style lang="scss" scoped>
.board {
  padding: 12px;
  height: 100vh;
  overflow: auto;
  .list {
    min-width: 250px;
    background-color: rgb(228 228 228 / 35%);
    padding: 25px;
    border-radius: 12px;
    min-height: 70vh;
  }
  .create-list {
    background-color: rgb(228 228 228 / 35%);
  }
  a {
    text-decoration: none;
  }
  .menu-items a {
    // color: $text-color;
    padding: 10px 0px 10px 3px;
    font-size: 24px;
  }
  .jello-topbar {
    background-color: rgb(255, 255, 255, 0);
    padding: 0px !important;
  }
}
</style>
