<template>
  <v-dialog v-model="isActive" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <Tile
        v-bind="activatorProps"
        icon="mdi-account-group"
        text="Join Board"
      />
    </template>

    <template v-slot:default>
      <v-card title="Join to a new Board">
        <v-card-text> Enter a board ID to connect to the board. </v-card-text>
        <v-col sm="12">
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <v-text-field
            v-model="id"
            label="Enter board ID *"
            :error="!!errorMessage"
            required
          ></v-text-field>
        </v-col>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="isActive = false"></v-btn>

          <v-btn
            color="primary"
            text="Connect"
            variant="tonal"
            @click="deleteBoard"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";

const isActive = ref(false);
const id = ref("");
const errorMessage = ref("");

function deleteBoard() {
  console.log("Join board function called");

  if (id.value === "") {
    console.log("ID is empty, cannot join board");
    errorMessage.value = "Invalid board ID";
    return;
  }
  isActive.value = false;

  errorMessage.value = "";
}
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 0.875rem;
  margin-bottom: 8px;
}
</style>
