// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueFire from 'vuefire'
import firebase from 'firebase'
import 'firebase/firestore'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { store } from './store/store'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import { config } from './config/firebaseConfig'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(require('vue-moment'))
Vue.use(VueFire)
Vue.component('icon', Icon)
firebase.initializeApp(config)
export const storage = firebase.storage()
export const db = firebase.firestore()
firebase.auth().onAuthStateChanged(function (user) {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    components: { App, Icon },
    template: '<App/>',
    store: store,
    router
  })
})
