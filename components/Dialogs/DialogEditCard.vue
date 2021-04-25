<template>
  <v-dialog v-model="dialogEditCard" persistent max-width="600px">
    <v-card elevation="0">
      <v-card-title>
        <span class="headline">{{ currentCard.name }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form v-model="valid">
            <v-row>
              <v-col cols="12" class="pa-0">
                <v-text-field
                  label="Edit name"
                  v-model.trim="currentCard.name"
                  :rules="[(v) => !!v || 'Card name is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pa-0">
                <v-text-field
                  label="Edit description"
                  v-model.trim="currentCard.desc"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-text v-if="currentCardAPIData">
        <div
          class=""
          v-for="action in currentCardAPIData.actions"
          :key="action.id"
        >
          <h5 class="comment-title">
            {{ action.memberCreator.fullName }} {{ formatDate(action.date) }}
          </h5>
          <p
            class="cursor-pointer"
            v-if="!action.edit"
            @click="action.edit = !action.edit"
          >
            {{ action.data.text }}
          </p>
          <div v-else class="d-flex justify-between align-center">
            <v-text-field
              type="text"
              ref="boardName"
              :value="action.data.text"
              @blur="updateComment($event, action)"
              @keyup.esc="updateComment($event, action)"
              @keyup.enter="updateComment($event, action)"
            ></v-text-field>
            <v-btn
              class="mr-1"
              fab
              x-small
              color="red"
              @click="deleteComment(action)"
            >
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card-text>
      <v-card-text>
        <v-form v-model="validComment">
          <v-row class="d-flex align-center">
            <v-col cols="9">
              <v-text-field
                label="Add comment"
                v-model.trim="newComment.text"
                :rules="[(v) => !!v || 'Comment is required']"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-btn
                small
                color="primary"
                :disabled="!validComment"
                @click="postComment"
              >
                Post Comment
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="deleteCard()">
          Delete
        </v-btn>
        <v-btn color="primary" text @click="$emit('input', false)">
          Close
        </v-btn>

        <v-btn
          type="submit"
          color="primary"
          text
          :disabled="!valid"
          @click="updateCard()"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    currentCard: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      valid: false,
      validComment: false,
      currentCardAPIData: null,
      newComment: {
        text: '',
        edit: false
      }
    };
  },
  computed: {
    dialogEditCard() {
      return this.value;
    }
  },
  async created() {
    const requestObj = {
      path: `cards/${this.currentCard.id}`,
      method: 'GET',
      params: {
        actions: 'commentCard',
        member_fields: 'fullName,username'
      }
    };
    const cardResponseData = await this.$trelloAPI.makeRequest(requestObj);
    this.currentCardAPIData = cardResponseData.json;
    this.currentCardAPIData.actions = this.currentCardAPIData.actions.map(
      (action) => ({ ...action, edit: false })
    );
  },
  methods: {
    async deleteCard() {
      const requestObj = {
        path: `cards/${this.currentCard.id}`,
        method: 'DELETE'
      };
      await this.$trelloAPI.makeRequest(requestObj);

      this.$emit('delete-card');
      this.$emit('input', false);
    },
    async updateCard() {
      const { name, desc } = this.currentCard;
      const requestObj = {
        path: `cards/${this.currentCard.id}`,
        method: 'PUT',
        data: {
          name,
          desc
        }
      };
      await this.$trelloAPI.makeRequest(requestObj);
      this.$emit('update-card');
      this.$emit('input', false);
    },
    async postComment() {
      const requestObj = {
        path: `cards/${this.currentCard.id}/actions/comments`,
        method: 'POST',
        data: {
          text: this.newComment.text
        }
      };
      const commentResponse = await this.$trelloAPI.makeRequest(requestObj);
      this.currentCardAPIData.actions.unshift({
        ...commentResponse.json,
        edit: false
      });
      this.newComment.text = '';
    },
    async updateComment($event, action) {
      const commentText = $event.target.value.trim();
      if (commentText && commentText !== action.data.text) {
        action.data.text = commentText;
        const requestObj = {
          path: `actions/${action.id}`,
          method: 'PUT',
          data: {
            text: commentText
          }
        };
        await this.$trelloAPI.makeRequest(requestObj);
      }
      action.edit = false;
    },
    async deleteComment(action) {
      console.log('deleting');
      const requestObj = {
        path: `actions/${action.id}`,
        method: 'DELETE'
      };
      await this.$trelloAPI.makeRequest(requestObj);
      this.currentCardAPIData.actions = this.currentCardAPIData.actions.filter(
        (actionItem) => actionItem.id !== action.id
      );
    },
    formatDate(date) {
      const newDate = new Date(date);
      const options = {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      };
      return newDate.toLocaleDateString(['sr'], options);
    }
  }
};
</script>

<style>
.comment-title {
  font-size: 1em;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
