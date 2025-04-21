<template>
  <v-dialog v-model="isActive" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <Tile v-bind="activatorProps" icon="mdi-plus" text="Create Board" />
    </template>

    <template v-slot:default>
      <v-card title="Create Board">
        <v-card-text> Enter a Board name. </v-card-text>
        <v-col sm="12">
          <!-- Error message -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <v-text-field
            v-model="boardName"
            label="Board name*"
            :error="!!errorMessage"
            required
          ></v-text-field>
        </v-col>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="isActive = false"></v-btn>

          <v-btn
            color="primary"
            text="Create Board"
            variant="tonal"
            @click="createBoard"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>

  <v-dialog v-model="openContinue" max-width="400">
    <v-card>
      <v-card-title>Board "{{ boardName }}" has been created</v-card-title>
      <v-card-text>
        Before clicking continue save the board deletion ID and board ID.
      </v-card-text>
      <v-card-text>
        Board ID: <strong>{{ BoardID }}</strong>
      </v-card-text>
      <v-card-text>
        Board deletion ID: <strong>{{ DeletionID }}</strong>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Continue" @click="continueToBoard"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import router from "@/router";
import api from "@/services/apiService";
import { ref } from "vue";

const isActive = ref(false);
const openContinue = ref(false);
const BoardID = ref("ABCDEF");
const DeletionID = ref("123456");
const boardName = ref("");
const errorMessage = ref("");

async function createBoard() {
  if (boardName.value === "") {
    console.log("Name is empty, cannot create board");
    errorMessage.value = "board name must be provided";
    return;
  }
  isActive.value = false;

  try {
    let resp = await api.createBoard({
      name: boardName.value,
    });
    BoardID.value = resp.data.id;
    DeletionID.value = resp.data.deletion_id;
  } catch (error) {
    console.log("Error while creating a board ", error);
  }

  errorMessage.value = ""; // Clear error message if validation passes
  openContinue.value = true;
}

function continueToBoard() {
  console.log("Continue to board function called");
  openContinue.value = false;
  router.push({ name: "Board", params: { id: BoardID.value } });
  // Add logic to navigate to the created board or perform any other action
}
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 0.875rem;
  margin-bottom: 8px;
}
</style>
