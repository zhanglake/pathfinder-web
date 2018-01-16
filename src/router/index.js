import Vue from 'vue'
import Router from 'vue-router'

import Back from '@/page/back.vue'
import Front from '@/page/front.vue'

import Home from '@/page/home/index.vue'

import System from '@/page/system/index.vue'
import User from '@/page/system/user.vue'
import Role from '@/page/system/role.vue'
import Menu from '@/page/system/menu.vue'

import Sale from '@/page/sale/index.vue'
import List from '@/page/sale/list.vue'
import Customer from '@/page/sale/customer.vue'
import Order from '@/page/sale/order.vue'
import Product from '@/page/sale/product.vue'

import New from '@/page/business/new.vue'
import All from '@/page/business/all.vue'
import Mine from '@/page/business/mine.vue'
import Create from '@/page/business/create.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'back',
      component: Back,
      children: [
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
        },
        {
          path: '/sale',
          name: 'sale',
          component: Sale,
          children: [
            {
              path: 'list',
              name: 'list',
              component: List
            },
            {
              path: 'customer',
              name: 'customer',
              component: Customer
            },
            {
              path: 'order',
              name: 'Order',
              component: Order
            },
            {
              path: 'product',
              name: 'Product',
              component: Product
            }
          ]
        }
      ]
    },
    {
      path: '/c',
      name: 'front',
      component: Front,
      children: [
        {
          path: 'new',
          name: 'new',
          component: New
        },
        {
          path: 'all',
          name: 'all',
          component: All
        },
        {
          path: 'mine',
          name: 'mine',
          component: Mine
        },
        {
          path: 'create',
          name: 'create',
          component: Create
        }
      ]
    }
  ]
})