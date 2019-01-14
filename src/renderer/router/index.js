import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/accounts-overview',
      name: 'accounts-overview',
      component: require('@/components/AccountsOverview').default
    },
    {
      path: '/accounts-overview/account-one',
      name: 'account-one',
      component: require('@/components/Accounts/AccountOne').default
    },
    {
      path: '/accounts-overview/account-two',
      name: 'account-two',
      component: require('@/components/Accounts/AccountTwo').default
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
