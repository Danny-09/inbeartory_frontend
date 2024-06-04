import { createRouter, createWebHistory } from 'vue-router'
import AreaView from '../views/AreaView.vue'
import InventoryView from '../views/InventoryView.vue'
import ItemsDeletedView from '../views/ItemsDeletedView.vue'
import LoginView from '../views/LoginView.vue'
import UsersView from '../views/UsersView.vue'
import RecoverPasswordView from '../views/RecoverPasswordView.vue'

const routes = [
  {
    path: '/inventario',
    name: 'inventario',
    component: InventoryView
  },
  {
    // path: '/about',
    // name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/areas',
    name: 'areas',
    component: AreaView
  },
  {
    path: '/items/eliminados',
    name: 'itemsDeleted',
    component: ItemsDeletedView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/users',
    name: 'users',
    component: UsersView
  },
  {
    path: '/recover_password',
    name: 'recover_password',
    component: RecoverPasswordView
  }
  

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
