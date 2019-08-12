import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/'

import Frame from '../components/frame/Frame.vue'
import Personal from '../components/personal/Personal.vue'

import Center from '../components/Center.vue'
import EditPwd from '../components/EditPwd.vue'

import Jspay from '../components/Jspay.vue'
import Scanpay from '../components/Scanpay.vue'
import Socket from '../components/Socket.vue'
import Jsapi from '../components/Jsapi.vue'

import Signin from '../components/personal/Signin.vue'
import Signup from '../components/personal/Signup.vue'
import Forget from '../components/personal/Forget.vue'

Vue.use(Router)

const routes = [
    {
        path: '/app',
        component: Frame,
        children: [
            {
                path: 'center',
                name: 'center',
                component: Center,
                meta: {
                    requireAuth: false
                }
            },
            {
                path: 'scanpay',
                name: 'scanpay',
                component: Scanpay,
                meta: {
                    requireAuth: false
                }
            },
            {
                path: 'jspay',
                name: 'jspay',
                component: Jspay,
                meta: {
                    requireAuth: false
                }
            },
            {
                path: 'socket',
                name: 'socket',
                component: Socket,
                meta: {
                    requireAuth: false
                }
            },
            {
                path: 'editpwd',
                name: 'editpwd',
                component: EditPwd,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: 'jsapi',
                name: 'jsapi',
                component: Jsapi,
                meta: {
                    requireAuth: false
                }
            },
        ]
    },
    {
        path: '/personal',
        component: Personal,
        children: [
            {
                path: 'signin',
                name: 'signin',
                component: Signin,
                meta: {
                    requireAuth: false
                }
            },
            {
                path: 'signup',
                name: 'signup',
                component: Signup,
                meta: {
                    requireAuth: false
                }
            },
            {
                path: 'forget',
                name: 'forget',
                component: Forget,
                meta: {
                    requireAuth: false
                }
            },
        ]
    },
    {
        path: '*',
        redirect: '/app/center'
    }
];

const router = new Router({
    scrollBehavior: () => ({ y: 0 }), // 滚动条滚动的行为，不加这个默认就会记忆原来滚动条的位置
    routes
});

router.beforeEach((to, from, next) => {
    store.dispatch('showLoading');
    if (to.matched.some(r => r.meta.requireAuth)) {
        if (store.state.token) {
            next();
        }
        else {
            next({
                path: '/personal/signin',
                query: {redirect: to.fullPath}
            })
        }
    }
    else {
        next();
    }
});

router.afterEach(function (to) {
    store.dispatch('hideLoading')
});

export default router;
