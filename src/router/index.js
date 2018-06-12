import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import Conferences from '@/components/Conferences'
import Users from '@/components/Users'
import AddConference from '@/components/AddConference'
import Register from '@/components/Register'
import Profile from '@/components/Profile'
import MyConferences from '@/components/MyConferences'
import AbstractBook from '@/components/AbstractBook'
import firebase from 'firebase'
import { store } from '@/store/store'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/conferences',
      name: 'Conferences',
      component: Conferences
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/register/:conferenceId',
      name: 'Register',
      component: Register,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/abstractbook/:conferenceId',
      name: 'AbstractBook',
      component: AbstractBook,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/myconferences',
      name: 'MyConferences',
      component: MyConferences,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
      meta: {
        requiresAuth: true,
        requiresProfileAdmin: true
      }
    },
    {
      path: '/addConference',
      name: 'AddConference',
      component: AddConference,
      meta: {
        requiresAuth: true,
        requiresCreateConference: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp
    }
  ]
})
router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  let requiresCreateConference = to.matched.some(record => record.meta.requiresCreateConference)
  let requiresProfileAdmin = to.matched.some(record => record.meta.requiresProfileAdmin)
  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next()
  else if (requiresAuth && requiresCreateConference) {
    if (store.getters.getUserProfile.canCreateConference || store.getters.getUserProfile.admin) {
      next()
    } else {
      next('/conferences')
    }
  } else if (requiresAuth && requiresProfileAdmin) {
    if (store.getters.getUserProfile.canEditProfile || store.getters.getUserProfile.canAssignDepartments || store.getters.getUserProfile.canChangeRole || store.getters.getUserProfile.admin) {
      next()
    } else {
      next('/conferences')
    }
  } else next()
})

export default router
