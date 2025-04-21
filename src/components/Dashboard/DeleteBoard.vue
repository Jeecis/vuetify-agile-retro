<template>
  <v-dialog v-model="isActive" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <Tile v-bind="activatorProps" icon="mdi-delete" text="Delete Board" />
    </template>

    <template v-slot:default>
      <v-card title="Delete Board">
        <v-card-text>
          Enter the deletion ID that was provided upon creating the board. After
          deleting the board there will be no possibility to revert the change.
        </v-card-text>
        <v-col sm="12">
          <!-- Error message -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <v-text-field
            v-model="id"
            label="Board deletion ID *"
            :error="!!errorMessage"
            required
          />
        </v-col>

        <v-card-actions>
          <v-spacer />

          <v-btn text="Close" variant="plain" @click="isActive = false" />

          <v-btn
            color="deep-orange-darken-4"
            text="Delete"
            variant="tonal"
            @click="deleteBoard"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>

  <v-dialog v-model="openDeleted" max-width="400">
    <v-card>
      <v-card-title>Board Deleted</v-card-title>
      <v-card-text> The board has been successfully deleted. </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Close" @click="openDeleted = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";

const isActive = ref(false);
const openDeleted = ref(false);
const id = ref("");
const errorMessage = ref("");

function deleteBoard() {
  console.log("Delete board function called");

  if (id.value === "") {
    console.log("ID is empty, cannot delete board");
    errorMessage.value = "Invalid board deletion id";
    return;
  }
  isActive.value = false;

  errorMessage.value = ""; // Clear error message if validation passes
  openDeleted.value = true;
}
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 0.875rem;
  margin-bottom: 8px;
}
</style>
