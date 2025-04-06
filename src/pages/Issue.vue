<template>
  <div
    class="d-flex flex-column align-center justify-center"
    style="height: 90vh"
  >
    <p class="text-h4 font-weight-bold mb-4">Redirecting...</p>
    <v-progress-circular
      indeterminate
      color="primary"
      size="70"
      width="7"
    ></v-progress-circular>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  mounted() {
    const router = useRouter(); // Move useRouter() here
    window.open("https://github.com", "_blank");
    router.push({ name: "Dashboard" });
  },
};
</script>
