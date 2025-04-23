<template>
  <v-container
    class="fill-height d-flex align-center"
    style="padding-left: 4rem"
  >
    <v-row class="align-center">
      <v-col cols="12" class="d-flex align-center" style="gap: 3rem">
        <img
          src="../assets/logo.png"
          alt="Logo"
          style="width: 15rem; height: auto"
        />
        <!-- Title -->
        <div class="text-h2 font-weight-bold">
          Agile Retrospective<br />Board
        </div>
      </v-col>

      <!-- Button below both -->
      <v-col cols="12" class="pl-12">
        <v-btn
          variant="outlined"
          size="x-large"
          class="mt-4 text-h6 font-weight-bold"
          @click="toDashboard"
        >
          START WITH NO AUTHORIZATION
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function toDashboard() {
  router.push({ name: "Dashboard" });
}
</script>
