<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

// Replace ✅ emoji with SVG checkmark icon
const checkmarkSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 18px; height: 18px; vertical-align: middle; color: #10b981;"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>`

// Replace ❌ emoji with SVG X icon  
const xSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 18px; height: 18px; vertical-align: middle; color: #ef4444;"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/></svg>`

// Replace ⚠️ emoji with SVG warning icon
const warningSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 18px; height: 18px; vertical-align: middle; color: #f59e0b;"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"/></svg>`

const replaceEmojis = () => {
  const tables = document.querySelectorAll('.vp-doc table td')
  tables.forEach(td => {
    if (td.textContent?.includes('✅') && !td.querySelector('svg')) {
      td.innerHTML = td.innerHTML.replace(/✅/g, checkmarkSVG)
    }
    if (td.textContent?.includes('❌') && !td.querySelector('svg')) {
      td.innerHTML = td.innerHTML.replace(/❌/g, xSVG)
    }
    if (td.textContent?.includes('⚠️') && !td.querySelector('svg')) {
      td.innerHTML = td.innerHTML.replace(/⚠️/g, warningSVG)
    }
  })
}

onMounted(() => {
  replaceEmojis()
  
  // Watch for dynamic content
  const observer = new MutationObserver(() => {
    setTimeout(replaceEmojis, 100)
  })
  observer.observe(document.body, { childList: true, subtree: true })
})

// Replace emojis when route changes
watch(() => route.path, () => {
  setTimeout(replaceEmojis, 300)
})
</script>

<template>
  <div style="display: none;"></div>
</template>
