import { ref, onMounted, onUnmounted } from 'vue';

const mobileBreakpoint = 1200;
const isMobile = ref(window.innerWidth <= mobileBreakpoint);
const resizeSubscribers = new Set();

const onWindowResize = () => {
  isMobile.value = window.innerWidth <= mobileBreakpoint;

  // Notify all subscribed functions
  resizeSubscribers.forEach((callback) => callback(isMobile.value));
};

let isInitialized = false;

export function useResize() {
  if (!isInitialized) {
    onMounted(() => {
      window.addEventListener('resize', onWindowResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', onWindowResize);
    });

    isInitialized = true;
  }

  const onResize = (callback) => {
    resizeSubscribers.add(callback);
    return () => resizeSubscribers.delete(callback); // Return an unsubscribe function
  };

  return {
    isMobile,
    onResize,
  };
}

