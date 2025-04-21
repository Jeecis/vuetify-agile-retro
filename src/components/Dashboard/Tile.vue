<template>
  <v-btn
    :prepend-icon="icon"
    stacked
    variant="outlined"
    size="x-large"
    rounded="m"
  >
    {{ text }}
  </v-btn>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
  },
  text: {
    type: String,
  },
});
</script>
