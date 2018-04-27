import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import mainPage from '@/components/mainPage'
import tree from '@/components/tree'
import device from '@/components/device'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: login,
    },
    {
      path:'/mainPage',
      component:mainPage,
      meta:{
        requiresAuth:true     //进入这个路由是需要登录的
      },
    },
    {
      path:'/mainPage/device',
      component:device,
      meta:{
        requiresAuth:true
      }
    }
  ],
  mode:"history"    //去掉#号
})
