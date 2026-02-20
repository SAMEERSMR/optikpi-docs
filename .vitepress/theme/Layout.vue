<script setup>
import DefaultTheme from 'vitepress/theme'
import EmojiToIcon from './components/EmojiToIcon.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-top>
      <EmojiToIcon />
    </template>
  </Layout>
</template>
