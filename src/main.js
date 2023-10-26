import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIcons from '@element-plus/icons-vue'
import axios from 'axios'
const app = createApp(App)
  for (const iconName in ElIcons) {
    app.component(iconName, ElIcons[iconName])
}
axios.defaults.headers["Content-Type"] = "application/json";
app.mount('#app').use(ElementPlus).use(axios)