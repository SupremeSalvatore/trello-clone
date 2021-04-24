<template>
  <v-dialog v-model="dialog" max-width="400px" persistent>
    <v-card elevation="0">
      <v-container class="d-block">
        <v-row no-gutters align="center" justify="space-between">
          <v-row no-gutters>
            <h3>Move Board</h3>
          </v-row>
          <v-icon @click="$emit('input', false)">mdi-close</v-icon>
        </v-row>
        <v-form v-model="valid" @submit.prevent="moveList">
          <div class="d-flex flex-column">
            <v-select
              :value="selectedBoard.id"
              @change="generateBoard($event)"
              item-text="name"
              item-value="id"
              :items="getBoards"
              label="Select Board"
            ></v-select>
            <v-select
              v-model="selectedPosition"
              :items="selectedBoard.availablePositions"
              label="Position"
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
import { mapGetters } from 'vuex';
import { calculatePos } from '~/utils/calculatePos';
export default {
  props: {
    value: {
      type: Boolean,
      defult: false
    },
    currentList: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      valid: false,
      selectedBoard: [],
      selectedPosition: null
      // boardOptions: this.getBoards.map(({ id, name }) => ({
      //   id,
      //   name
      // }))
    };
  },
  created() {
    this.selectedBoard = this.getBoards.find(
      (board) => board.id === this.$route.params.id
    );
    this.selectedBoard.availablePositions = Array.from(
      Array(this.selectedBoard.lists.length + 1).keys()
    ).slice(1);
    this.selectedPosition = this.currentList.listIndex + 1;
  },
  computed: {
    ...mapGetters(['getBoards']),
    dialog() {
      return this.value;
    }
  },
  methods: {
    generateBoard(boardId) {
      this.selectedBoard = this.getBoards.find((board) => board.id === boardId);
      this.selectedBoard.availablePositions = Array.from(
        Array(this.selectedBoard.lists.length + 1).keys()
      ).slice(1);
      this.selectedPosition = this.currentList.listIndex + 1;
    },
    async moveList() {
      const realIndex = this.selectedPosition + 1;
      const beforeItem = this.selectedBoard.lists[realIndex - 1];
      const afterItem = this.selectedBoard.lists[realIndex + 1];
      const position = calculatePos(beforeItem, afterItem);
      const requestObj = {
        path: `lists/${this.currentList.id}`,
        method: 'PUT',
        data: {
          idBoard: this.selectedBoard.id,
          pos: position
        }
      };
      const listData = await this.$trelloAPI.makeRequest(requestObj);
      this.$emit('input', false);
      this.$emit('move-list', { ...listData.json, listIndex: realIndex });
    }
  }
};
</script>

<style></style>
