import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      name: 'index',
      component: require('@/components/Index').default
    },
    {
      path: '/',
      name: 'timers',
      component: require('@/components/Timers').default
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('@/components/Settings').default
    },
    {
      path: '/jira-board-settings',
      name: 'jira-board-settings',
      component: require('@/components/AdditionalSettings/JiraBoardSettings').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
