import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import axios from 'axios';
// import '@/assets/fonts/fonts.css'; 


// Vue.prototype.$axios = axios;

// createApp(App).use(router).mount('#app')
const app = createApp(App);
app.config.globalProperties.$axios = axios; // Asignar Axios al prototipo de Vue


app.use(router).mount('#app');