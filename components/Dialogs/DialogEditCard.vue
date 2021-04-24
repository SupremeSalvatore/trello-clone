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
                <v-textarea
                  label="Edit description"
                  v-model.trim="currentCard.desc"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="deleteCard()">
          Delete
        </v-btn>
        <v-btn color="blue darken-1" text @click="$emit('input', false)">
          Close
        </v-btn>

        <v-btn
          type="submit"
          color="blue darken-1"
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
      valid: false
    };
  },
  computed: {
    dialogEditCard() {
      return this.value;
    }
  },
  created() {
    console.log(JSON.parse(JSON.stringify(this.currentCard)));
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
    }
  }
};
</script>

<style></style>
