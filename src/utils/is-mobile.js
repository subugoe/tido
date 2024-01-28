import { ref } from 'vue';

const mobileBreakpoint = 1200; // xl
const isMobile = ref(window.innerWidth <= mobileBreakpoint);
window.onresize = () => isMobile.value = window.innerWidth <= mobileBreakpoint;

export { isMobile };
