export default {
    loading: false,
    userInfo: sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : {name: '', desc: '', email: ''},
    token: sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : '',
    permissions: sessionStorage.getItem('permissions') ? JSON.parse(sessionStorage.getItem('permissions')) : [],
    ball: {
        left: 0,
        bottom: 0
    },
    sitename: 'wxpay',
    baseURL: 'https://maoxy.com/ai',
    domainUrl: 'https://maoxy.com',
    //baseURL: 'http://localhost:3000',
    //domainUrl: 'https://maoxy.com',
    wechat: sessionStorage.getItem('wechat') ? JSON.parse(sessionStorage.getItem('wechat')) : null,
    subCode: sessionStorage.getItem('subCode') ? sessionStorage.getItem('subCode') : '',
    collapse: false,
    activeIndex: sessionStorage.getItem('activeIndex') ? sessionStorage.getItem('activeIndex') : '/admin/user',
    typeOptions: sessionStorage.getItem('typeOptions') ? JSON.parse(sessionStorage.getItem('typeOptions')) : [],
    brandOptions: sessionStorage.getItem('brandOptions') ? JSON.parse(sessionStorage.getItem('brandOptions')) : []
}