<!-- Custom theme switch with sun/moon icons -->
<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { useData } from 'vitepress';

const { isDark } = useData();

const toggleAppearance = inject('toggle-appearance', () => {
  isDark.value = !isDark.value;
});

const supportsViewTransition = ref(false);

onMounted(() => {
  supportsViewTransition.value =
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
});
</script>

<template>
  <button
    type="button"
    role="switch"
    title="Toggle dark mode"
    class="CustomSwitchAppearance"
    :aria-checked="isDark"
    :data-view-transition="supportsViewTransition"
    @click="toggleAppearance"
  >
    <ClientOnly>
      <Transition name="fade" mode="out-in">
        <!-- Sun icon for light mode -->
        <svg v-if="!isDark" class="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M12,18C8.69,18 6,15.31 6,12C6,8.69 8.69,6 12,6C15.31,6 18,8.69 18,12C18,15.31 15.31,18 12,18M12,16C14.21,16 16,14.21 16,12C16,9.79 14.21,8 12,8C9.79,8 8,9.79 8,12C8,14.21 9.79,16 12,16M12,1L15.39,4.39L18.36,3.64L17.64,6.61L21,8L17.64,9.39L18.36,12.36L15.39,11.64L12,15L8.61,11.64L5.64,12.36L6.36,9.39L3,8L6.36,6.61L5.64,3.64L8.61,4.39L12,1Z"
          />
        </svg>
        <!-- Moon icon for dark mode -->
        <svg v-else class="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95Z"
          />
        </svg>
      </Transition>
    </ClientOnly>
  </button>
</template>

<style scoped>
.CustomSwitchAppearance {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
  background: none;
  border: none;
  cursor: pointer;
}

.CustomSwitchAppearance:hover {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.CustomSwitchAppearance svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.CustomSwitchAppearance[data-view-transition='false'] .fade-enter-active,
.CustomSwitchAppearance[data-view-transition='false'] .fade-leave-active {
  transition: opacity 0.1s ease;
}

.CustomSwitchAppearance[data-view-transition='false'] .fade-enter-from,
.CustomSwitchAppearance[data-view-transition='false'] .fade-leave-to {
  opacity: 0;
}
</style>
