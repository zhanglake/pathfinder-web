import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/page/home/home.vue'

import System from '@/page/system/index.vue'
import User from '@/page/system/user.vue'
import Role from '@/page/system/role.vue'
import Menu from '@/page/system/menu.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/system',
      name: 'system',
      component: System,
      children: [
        {
          path: '',
          component: User
        },
        {
          path: 'user',
          name: 'user',
          component: User
        },
        {
          path: 'role',
          name: 'role',
          component: Role
        },
        {
          path: 'menu',
          name: 'menu',
          component: Menu
        }
      ]
    }
  ]
})