<template>
  <v-container
    fluid
    :style="
      board.prefs.backgroundColor
        ? `background:${board.prefs.background}`
        : `background:url(${board.prefs.backgroundImage})`
    "
  >
    <div class="d-flex flex-column board">
      <div class="d-flex align-center">
        <h1 v-if="!board.edit" @click="board.edit = !board.edit">
          {{ board.name }}
        </h1>
        <v-text-field
          v-else
          class="mt-0 pt-0 shrink"
          type="text"
          :value="board.name"
          @blur="updateBoard($event)"
          @keyup.esc="updateBoard($event)"
          @keyup.enter="updateBoard($event)"
        />
        <v-btn fab x-small color="red" @click="deleteBoard()" class="ml-4">
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
      </div>

      <div class="d-flex flex-row pr-6 pt-3">
        <draggable
          class="d-flex"
          group="lists"
          v-model="board.lists"
          @start="listDrag = true"
          @end="updateListPosition"
        >
          <transition-group class="d-flex">
            <div
              v-for="(list, listIndex) in board.lists"
              class="d-flex flex-column pt-3 mr-6 list pa-2"
              :key="list.id"
              :id="list.id"
            >
              <div class="d-flex flex-row justify-space-between mb-2">
                <h4 v-if="!list.edit" @click="list.edit = !list.edit">
                  {{ list.name }}
                </h4>
                <v-text-field
                  v-else
                  class="mt-0 pt-0"
                  type="text"
                  ref="boardName"
                  :value="list.name"
                  @blur="updateList($event, list)"
                  @keyup.esc="updateList($event, list)"
                  @keyup.enter="updateList($event, list)"
                />
                <v-spacer></v-spacer>
                <v-btn
                  class="mr-1"
                  fab
                  x-small
                  color="info"
                  @click="moveList(list, listIndex)"
                >
                  <v-icon>mdi-folder-move</v-icon>
                </v-btn>
                <v-btn
                  class="mr-1"
                  fab
                  x-small
                  color="purple"
                  @click="copyList(list, listIndex)"
                >
                  <v-icon>mdi-content-copy</v-icon>
                </v-btn>
                <v-btn fab x-small color="red" @click="archiveList(list.id)">
                  <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
              </div>

              <!--display cards-->
              <draggable
                group="cards"
                v-model="list.cards"
                @start="cardDrag = true"
                @end="updateCardPosition"
              >
                <v-card
                  v-for="card in list.cards"
                  class="card mb-2"
                  @click="editCard(card)"
                  :key="card.id"
                >
                  <v-card-text> {{ card.name }} </v-card-text>
                  <v-card-text> {{ card.desc }} </v-card-text>
                </v-card>
              </draggable>
              <v-btn
                depressed
                @click="
                  dialogCard = true;
                  newCard.idList = list.id;
                "
                class="create-card mt-1"
                >Add card</v-btn
              >
            </div>
          </transition-group>
        </draggable>
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
                        v-model.trim="newCard.name"
                        :rules="[(v) => !!v || 'Card name is required']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Description"
                        v-model.trim="newCard.desc"
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
          <v-btn depressed @click="listDialog = true" class="create-list"
            >Create new list</v-btn
          >
          <v-dialog v-model="listDialog" persistent max-width="360px">
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
                        v-model.trim="newList.name"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="listDialog = false">
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
                      v-model.trim="currentCard.name"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="Edit description"
                      v-model.trim="currentCard.desc"
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
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';
import { calculateListPos } from '~/utils/calculatePos.js';

export default {
  components: {
    draggable
  },
  data() {
    return {
      listDrag: false,
      newList: {
        name: '',
        pos: ''
      },
      newCard: {
        idList: '',
        idBoard: this.$route.params.id,
        name: '',
        desc: ''
      },
      currentCard: {},
      cardDrag: false,
      listDialog: false,
      valid: false,
      dialogCard: false,
      dialogEditCard: false
    };
  },
  computed: {
    ...mapGetters(['getBoards'])
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
      list.edit = false;
      list.cards = boardData.json.cards.reduce((accCardArr, card) => {
        if (card.idList === list.id) {
          accCardArr.push(card);
        }
        return accCardArr;
      }, []);
      return list;
    });
    return { board: { ...boardData.json, edit: false } };
  },
  created() {
    console.log(JSON.parse(JSON.stringify(this.board)));
    console.log(JSON.parse(JSON.stringify(this.getBoards)));
  },
  methods: {
    async updateBoard($event) {
      const boardName = $event.target.value.trim();
      if (boardName && boardName !== this.board.name) {
        this.board.name = boardName;
        const requestObj = {
          path: `boards/${this.board.id}`,
          method: 'PUT',
          data: {
            name: this.board.name
          }
        };
        await this.$trelloAPI.makeRequest(requestObj);
      }
      this.board.edit = false;
    },
    async updateList($event, list) {
      const listName = $event.target.value.trim();
      if (listName && listName !== list.name) {
        list.name = $event.target.value.trim();
        const requestObj = {
          path: `lists/${list.id}`,
          method: 'PUT',
          data: {
            name: list.name
          }
        };
        await this.$trelloAPI.makeRequest(requestObj);
      }
      list.edit = false;
    },
    async updateListPosition(item) {
      const beforeItem = this.board.lists[item.newIndex - 1];
      const afterItem = this.board.lists[item.newIndex + 1];
      const position = calculateListPos(beforeItem, afterItem);
      const requestObj = {
        path: `lists/${item.item.id}`,
        method: 'PUT',
        data: {
          pos: position
        }
      };
      await this.$trelloAPI.makeRequest(requestObj);
      this.board.lists[item.newIndex].pos = position;
      this.listDrag = false;
    },

    async createList() {
      const [lastListItem] = this.board.lists.slice(-1);
      this.newList.pos = calculateListPos(lastListItem);
      const requestObj = {
        path: `boards/${this.board.id}/lists`,
        method: 'POST',
        data: this.newList
      };
      const listData = await this.$trelloAPI.makeRequest(requestObj);
      console.log(JSON.parse(JSON.stringify(listData.json)));
      this.board.lists.push(listData.json);
      this.listDialog = false;
      this.newList = {
        name: '',
        pos: ''
      };
    },
    async copyList(list, index) {
      const afterItem = this.board.lists[index + 1];
      const position = calculateListPos(list, afterItem);
      const { id, name, idBoard } = list;
      const requestObj = {
        path: `lists`,
        method: 'POST',
        data: { name, pos: position, idListSource: id, idBoard }
      };
      const listData = await this.$trelloAPI.makeRequest(requestObj);
      this.board.lists.splice(index, 0, {
        ...list,
        ...listData.json
      });
    },
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
    updateCardPosition(item) {
      console.log('update card position');
      this.cardDrag = false;
    },
    async updateCardList(newlistId) {},
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
    }
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
    color: white;
    padding: 0px 8px;
  }
  .create-list {
    background-color: rgb(228 228 228 / 35%);
  }
  .card,
  .create-card {
    background-color: rgb(228 228 228 / 40%);
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
