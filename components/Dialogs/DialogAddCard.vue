<template>
  <v-dialog v-model="dialogCard" persistent max-width="450px">
    <v-card elevation="0">
      <v-card-title>
        <span class="headline">Card name</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="card-form" v-model="valid">
            <v-row>
              <v-col cols="12" class="pa-0">
                <v-text-field
                  label="Stuff to do"
                  v-model.trim="newCard.name"
                  :rules="[(v) => !!v || 'Card name is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pa-0">
                <v-textarea
                  label="Description"
                  v-model.trim="newCard.desc"
                ></v-textarea>
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
            $emit('input', false);
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
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    listId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      valid: false,
      newCard: {
        idList: this.listId,
        idBoard: this.$route.params.id,
        name: '',
        desc: ''
      }
    };
  },
  computed: {
    dialogCard() {
      return this.value;
    }
  },
  created() {
    // console.log(this.$route.params.id);
    console.log(JSON.parse(JSON.stringify(this.$props)));
    console.log(this.listId);
  },
  methods: {
    async createCard() {
      const requestObj = {
        path: `cards`,
        method: 'POST',
        data: this.newCard
      };
      const cardData = await this.$trelloAPI.makeRequest(requestObj);
      console.log(JSON.parse(JSON.stringify(cardData.json)));
      this.$emit('add-card', cardData.json);
      this.newCard.name = '';
      this.newCard.desc = '';
      this.$emit('input', false);
    }
  }
};
</script>

<style></style>
