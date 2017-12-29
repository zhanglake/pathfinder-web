import Vue from 'vue'
import Router from 'vue-router'

import System from '@/page/system/index.vue'
import User from '@/page/system/user.vue'
import Role from '@/page/system/role.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'system',
      component: System
    },
    {
      path: '/system',
      component: System,
      children: [
        {
          path: '',
          component: User
        },
        {
          path: 'user',
          component: User
        },
        {
          path: 'role',
          component: Role
        }
      ]
    }
  ]
})