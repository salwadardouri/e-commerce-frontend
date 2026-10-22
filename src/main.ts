import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useAuth } from './modules/auth/auth.hook'

// Restore the admin session (if a token is stored) while the first route loads.
void useAuth().init()

createApp(App).use(router).mount('#app')
