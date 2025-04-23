<template>
  <v-app>
    <!-- this is Vuetify’s “main” flex-container -->
    <v-main class="d-flex align-center justify-center pa-0">
      <!-- plain div with text-centering -->
      <div class="text-center">
        <v-row class="justify-center">
          <img
            src="../assets/logo.png"
            alt="Logo"
            style="width: 15rem; height: auto"
          />
          <h1 style="font-size: 3rem; font-weight: 800; margin-top: 2.7rem">
            Agile Retrospective<br />Board
          </h1>
        </v-row>

        <v-row justify="center" class="mt-8">
          <v-col cols="auto" class="pa-4"><CreateBoard /></v-col>
          <v-col cols="auto" class="pa-4"><JoinBoard /></v-col>
          <v-col cols="auto" class="pa-4"><DeleteBoard /></v-col>
          <v-col cols="auto" class="pa-4">
            <Tile
              icon="mdi-bug"
              text="Issue & Feature request"
              @click="toIssue"
            />
          </v-col>
        </v-row>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
function toIssue() {
  router.push({ name: "Issue" });
}
</script>
