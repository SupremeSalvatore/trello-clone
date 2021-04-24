<template>
  <v-dialog v-model="listDialog" persistent max-width="400px">
    <v-card elevation="0">
      <v-card-title>
        <span class="headline">List name</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form v-model="valid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Stuff to do"
                  v-model.trim="newList.name"
                  :rules="[(v) => !!v || 'List name is required']"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="$emit('input', false)">
          Close
        </v-btn>
        <v-btn color="primary" text :disabled="!valid" @click="createList()">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { calculatePos } from '~/utils/calculatePos';
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    board: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      valid: false,
      newList: {
        name: '',
        pos: ''
      }
    };
  },
  computed: {
    listDialog() {
      return this.value;
    }
  },
  methods: {
    async createList() {
      const [lastListItem] = this.board.lists.slice(-1);
      this.newList.pos = calculatePos(lastListItem);
      const requestObj = {
        path: `boards/${this.board.id}/lists`,
        method: 'POST',
        data: this.newList
      };
      const listData = await this.$trelloAPI.makeRequest(requestObj);
      console.log(JSON.parse(JSON.stringify(listData.json)));
      this.$emit('input', false);
      this.$emit('add-list', { ...listData.json, cards: [] });
      this.newList = {
        name: '',
        pos: ''
      };
    }
  }
};
</script>

<style></style>
