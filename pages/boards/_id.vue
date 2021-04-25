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
        <h1 v-if="!board.edit" @click="inlineBoardEdit">
          {{ board.name }}
        </h1>
        <v-text-field
          v-else
          class="mt-0 pt-0 shrink"
          type="text"
          ref="boardName"
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
          :options="{ animation: 200 }"
          ghost-class="moving-list"
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
                <!-- <v-btn
                  class="mr-1"
                  fab
                  x-small
                  color="info"
                  @click="openMoveListDialog(list, listIndex)"
                >
                  <v-icon>mdi-folder-move</v-icon>
                </v-btn> -->

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
                :options="{ animation: 200 }"
                ghost-class="moving-card"
              >
                <v-card
                  v-for="(card, cardIndex) in list.cards"
                  class="card mb-2"
                  @click="editCard(card, cardIndex)"
                  :key="card.id"
                  :id="card.id"
                >
                  <v-card-text> {{ card.name }} </v-card-text>
                  <v-card-text>
                    <v-icon small v-if="card.desc">mdi-text</v-icon>
                    <v-icon
                      small
                      v-if="
                        board.actions.some(
                          (action) => action.data.card.id === card.id
                        )
                      "
                      >mdi-comment</v-icon
                    >
                  </v-card-text>
                </v-card>
              </draggable>
              <v-btn
                depressed
                @click="
                  newCardListId = list.id;
                  dialogAddCard = true;
                "
                class="create-card mt-1"
                >Add card</v-btn
              >
            </div>
          </transition-group>
        </draggable>
        <!--<DialogMoveList
          v-model="moveListDialog"
          :current-list="currentList"
          @move-list="moveListUpdate"
        ></DialogMoveList>-->
        <div class="d-flex flex-row">
          <v-btn depressed @click="listDialog = true" class="create-list"
            >Create new list</v-btn
          >
          <DialogAddList
            v-if="listDialog"
            :board="board"
            v-model="listDialog"
            @add-list="(list) => board.lists.push(list)"
          ></DialogAddList>
        </div>
        <DialogAddCard
          v-if="dialogAddCard"
          v-model="dialogAddCard"
          @add-card="addCardToList"
          :list-id="newCardListId"
        ></DialogAddCard>
        <DialogEditCard
          v-if="dialogEditCard"
          v-model="dialogEditCard"
          :current-card="currentCard"
          @delete-card="deleteCardFromList"
          @update-card="updateCardOnList"
        >
        </DialogEditCard>
      </div>
    </div>
  </v-container>
</template>

<script>
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';
import { calculatePos } from '~/utils/calculatePos.js';

export default {
  components: {
    draggable
  },
  data() {
    return {
      listDrag: false,
      cardDrag: false,
      newCardListId: '',
      listDialog: false,
      moveListDialog: false,
      currentList: {},
      dialogAddCard: false,
      dialogEditCard: false,
      currentCard: {}
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
        cards: 'all',
        actions: 'commentCard',
        member_fields: 'fullName,username'
      }
    };
    const boardData = await $trelloAPI.makeRequest(requestObj);
    console.log(JSON.parse(JSON.stringify(boardData.json)));
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
  methods: {
    async inlineBoardEdit() {
      this.board.edit = !this.board.edit;
      await this.$nextTick();
      this.$refs.boardName.focus();
    },
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
    openMoveListDialog(list, listIndex) {
      this.moveListDialog = true;
      this.currentList = { ...list, listIndex };
    },
    moveListUpdate(list) {
      if (this.board.id === list.idBoard) {
        this.board.lists[list.listIndex] = list;
      }
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
      const position = calculatePos(beforeItem, afterItem);
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
    async copyList(list, index) {
      const afterItem = this.board.lists[index + 1];
      const position = calculatePos(list, afterItem);
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
    addCardToList(cardData) {
      this.board.lists.map((list) => {
        if (list.id === this.newCardListId) {
          list.cards.push(cardData);
        }
      });
      this.newCardListId = '';
    },
    async updateCardPosition(item) {
      const toList = this.board.lists.find(
        (list) => list.id === item.to.parentElement.id
      );
      const currentCard = toList.cards.find((card) => card.id === item.item.id);
      const currentCardIndex = toList.cards.findIndex(
        (card) => card.id === item.item.id
      );
      const beforeCard = toList.cards[currentCardIndex - 1];
      const afterCard = toList.cards[currentCardIndex + 1];
      const position = calculatePos(beforeCard, afterCard) || currentCard.pos;
      const requestObj = {
        path: `cards/${currentCard.id}`,
        method: 'PUT',
        data: {
          idList: toList.id,
          pos: position
        }
      };
      await this.$trelloAPI.makeRequest(requestObj);
      toList.cards[currentCardIndex].pos = position;
      toList.cards[currentCardIndex].idList = toList.id;
      this.cardDrag = false;
    },
    editCard(card, cardIndex) {
      this.dialogEditCard = true;
      this.currentCard = { ...card, cardIndex };
    },
    deleteCardFromList() {
      this.board.lists.map((list) => {
        if (list.id === this.currentCard.idList) {
          list.cards = list.cards.filter(
            (card) => card.id !== this.currentCard.id
          );
        }
      });
    },
    updateCardOnList() {
      this.board.lists.map((list) => {
        if (list.id === this.currentCard.idList) {
          list.cards[this.currentCard.cardIndex] = this.currentCard;
        }
      });
      this.currentCard = {};
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
.moving-list {
  background: rgba(0, 0, 0, 0.3) !important;
  transform: rotate(15deg);
}
.moving-card {
  background: rgba(0, 0, 0, 0.3) !important;
  transform: rotate(10deg);
}
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
    color: rgba(0, 0, 0, 0.8);
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
