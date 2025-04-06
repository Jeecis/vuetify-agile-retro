<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center" class="text-center">
      <v-col cols="auto" class="pa-4">
        <CreateBoard />
      </v-col>
      <v-col cols="auto" class="pa-4">
        <JoinBoard />
      </v-col>
      <v-col cols="auto" class="pa-4">
        <DeleteBoard />
      </v-col>
      <v-col cols="auto" class="pa-4">
        <Tile icon="mdi-bug" text="Issue & Feature request" @click="toIssue" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
function toIssue() {
  // Use the router to navigate to the dashboard
  router.push({ name: "Issue" });
}
</script>
