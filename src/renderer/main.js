// Default electron-vue packages.
import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
// Custom packages.
import timeTo from 'hh-mm-ss'
import dateFns from 'date-fns'
// Bulma.
import 'bulma/css/bulma.css'
import 'bulma-checkradio'
// FontAwesome.
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// Add our custom packages to the prototype chain.
Object.defineProperty(Vue.prototype, '$timeTo', { value: timeTo })
Object.defineProperty(Vue.prototype, '$dateFns', { value: dateFns })
// Add the FontAwesome icons to the library.
library.add(fas, fab)
// Add it as a global component.
Vue.component('fa', FontAwesomeIcon)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// eslint-disable no-new.
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
