<template>
  <div class="d-flex justify-center align-center" style="height: 100vh">
    <v-btn variant="outlined" size="x-large" @click="toDashboard">
      To dashboard
    </v-btn>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "@/services/apiService"; // Adjust the path if necessary
import { useRouter } from "vue-router";

const router = useRouter();
const healthStatus = ref(null);

const checkHealth = async () => {
  try {
    healthStatus.value = await api.health();
  } catch (error) {
    healthStatus.value = "Error fetching health status " + error.message;
  }
};

function toDashboard() {
  // Use the router to navigate to the dashboard
  router.push({ name: "Dashboard" });
}
</script>
