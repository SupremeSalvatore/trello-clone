<template>
  <v-container>
    <div
      class="d-flex flex-column board"
      :style="board.color ? `background-color:${board.color}` : ''"
    >
      <h1>
        {{ board.name }}
        <v-btn fab x-small color="red" @click="deleteBoard()" class="ml-1">
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
      </h1>
      <small>{{ board.description }}</small>
      <div class="d-flex flex-row pr-6 pt-3">
        <div
          v-for="list in board.lists"
          class="d-flex flex-column pt-3 mr-6 list pa-2"
          :key="list.id"
        >
          <div class="d-flex flex-row justify-space-between mb-2">
            <h4>{{ list.name }}</h4>
            <v-btn
              fab
              x-small
              color="red"
              @click="archiveList(list.id)"
              class="ml-1"
            >
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </div>

          <!--display cards-->
          <v-card
            v-for="card in list.cards"
            class="mb-2"
            @click="editCard(card)"
            :key="card.id"
          >
            <v-card-text> {{ card.name }} </v-card-text>
            <v-card-text> {{ card.desc }} </v-card-text>
          </v-card>

          <v-btn
            depressed
            @click="
              dialogCard = true;
              newCard.idList = list.id;
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
                <v-form ref="card-form" v-model="valid">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Stuff to do"
                        v-model="newCard.name"
                        :rules="[(v) => !!v || 'Card name is required']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Description"
                        v-model="newCard.desc"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="
                  dialogCard = false;
                  valid = false;
                "
              >
                Close
              </v-btn>
              <v-btn
                :disabled="!valid"
                color="blue darken-1"
                text
                @click="createCard()"
              >
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
              <span class="headline">{{ currentCard.name }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Edit name"
                      v-model="currentCard.name"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="Edit description"
                      v-model="currentCard.desc"
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
      list: {
        name: ''
      },
      newCard: {
        idList: '',
        idBoard: this.$route.params.id,
        name: '',
        desc: ''
      },
      currentCard: {},

      dialog: false,
      valid: false,
      dialogCard: false,
      dialogEditCard: false
    };
  },
  async asyncData({ $trelloAPI, params }) {
    const requestObj = {
      path: `boards/${params.id}`,
      params: {
        lists: 'open',
        cards: 'all'
      }
    };
    const boardData = await $trelloAPI.makeRequest(requestObj);
    boardData.json.lists = boardData.json.lists.map((list) => {
      list.cards = boardData.json.cards.reduce((accCardArr, card) => {
        if (card.idList === list.id) {
          accCardArr.push(card);
        }
        return accCardArr;
      }, []);
      console.log(JSON.parse(JSON.stringify(list.cards)));
      return list;
    });
    return { board: boardData.json };
  },
  created() {
    console.log(JSON.parse(JSON.stringify(this.board)));
  },
  methods: {
    async createList() {
      console.log(JSON.parse(JSON.stringify(this.list)));
      const requestObj = {
        path: `boards/${this.board.id}/lists`,
        method: 'POST',
        data: this.list
      };
      const listData = await this.$trelloAPI.makeRequest(requestObj);
      console.log(JSON.parse(JSON.stringify(listData.json)));
      this.board.lists.push(listData.json);
      this.dialog = false;
    },

    async updateCardList(newlistId) {},

    async archiveList(listId) {
      const requestObj = {
        path: `lists/${listId}/closed`,
        method: 'PUT',
        data: {
          value: true
        }
      };
      await this.$trelloAPI.makeRequest(requestObj);
      this.board.lists = this.board.lists.filter((list) => list.id !== listId);
    },
    async createCard() {
      const requestObj = {
        path: `cards`,
        method: 'POST',
        data: this.newCard
      };
      const cardData = await this.$trelloAPI.makeRequest(requestObj);
      this.board.lists.map((list) => {
        if (list.id === this.newCard.idList) {
          list.cards.push(cardData.json);
        }
      });
      this.newCard.name = '';
      this.newCard.desc = '';
      this.dialogCard = false;
    },
    editCard(card) {
      this.dialogEditCard = true;
      this.currentCard = card;
    },
    async updateCard() {
      const requestObj = {
        path: `cards/${this.currentCard.id}`,
        method: 'PUT',
        data: this.currentCard
      };
      await this.$trelloAPI.makeRequest(requestObj);
      this.dialogEditCard = false;
    },
    async deleteCard() {
      const requestObj = {
        path: `cards/${this.currentCard.id}`,
        method: 'DELETE'
      };
      await this.$trelloAPI.makeRequest(requestObj);
      this.board.lists.map((list) => {
        if (list.id === this.currentCard.idList) {
          list.cards = list.cards.filter(
            (card) => card.id !== this.currentCard.id
          );
        }
      });
      this.dialogEditCard = false;
    },
    async deleteBoard() {
      await this.$trelloAPI.makeRequest({
        path: `boards/${this.board.id}`,
        method: 'DELETE'
      });
      this.$router.push('/');
    },
    async updateBoard() {}
  }
};
</script>

<style lang="scss" scoped>
.board {
  padding: 12px;
  height: 90vh;
  overflow: auto;
  .list {
    min-width: 250px;
    background-color: rgb(228 228 228 / 35%);
    // padding: 25px;
    border-radius: 12px;
    // min-height: 70vh;
    height: fit-content;
  }
  .v-card__text {
    padding: 0px 8px;
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
}
</style>
