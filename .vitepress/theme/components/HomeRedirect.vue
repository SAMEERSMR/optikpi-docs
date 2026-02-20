<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vitepress';

const router = useRouter();

onMounted(() => {
  if (window.location.pathname === '/' || window.location.pathname === '/index') {
    router.go('/getting-started/introduction');
  }
});
</script>

<template>
  <div></div>
</template>
