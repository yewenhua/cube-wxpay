<template>
    <div class="center-page">
        <div class="header-wrapper">
            <div class="header">
                <div class="left">
                    <img :src="data ? data.headimgurl : header_img"/>
                </div>
                <div class="right">
                    <div class="name">{{data ? data.nickname : '东方不败'}}</div>
                    <div class="address">锁有不凡，源于坚持</div>
                </div>
            </div>
        </div>

        <div class="home-content">
            <ul>
                <li>
                    <router-link :to="{ name:'socket'}">
                        <div class="img">
                            <img :src="require('../assets/img/device.svg')"/>
                        </div>
                        <div class="title">socket</div>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name:'jspay'}">
                        <div class="img">
                            <img :src="require('../assets/img/pointer.svg')"/>
                        </div>
                        <div class="title">H5支付</div>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name:'jsapi'}">
                        <div class="img">
                            <img :src="require('../assets/img/lock.svg')"/>
                        </div>
                        <div class="title">头像扫码</div>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name:'scanpay'}">
                        <div class="img">
                            <img :src="require('../assets/img/alert.svg')"/>
                        </div>
                        <div class="title">扫码支付</div>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name:'scanpay'}">
                        <div class="img">
                            <img :src="require('../assets/img/safe.svg')"/>
                        </div>
                        <div class="title">扫码支付</div>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name:'scanpay'}">
                        <div class="img">
                            <img :src="require('../assets/img/service.svg')"/>
                        </div>
                        <div class="title">扫码支付</div>
                    </router-link>
                </li>
            </ul>
        </div>

        <div class="dm-content">
            <div class="top">
                <ul class="yx" :style="{animationDuration: '20s', width: (1.2 + 0.35) * yxdmlist.length + 'rem'}">
                    <li v-for="(item, index) in yxdmlist" :key="index" class="dm" :style="{width: ((0.2) * 4 + 0.35) + 'rem'}">
                        <img class="hd" :src="header_img"/>
                        <img class="sex" :src="woman_img"/>
                        <span class="text">{{item.word}}</span>
                    </li>
                </ul>
            </div>
            <div class="middle">
                <ul class="yx" :style="{animationDuration: '10s', width: (1.2 + 0.35) * yxdmlist.length + 'rem'}">
                    <li v-for="(item, index) in yxdmlist" :key="index" class="dm" :style="{width: ((0.2) * 4 + 0.35) + 'rem'}">
                        <img class="hd" :src="header_img"/>
                        <img class="sex" :src="man_img"/>
                        <span class="text">{{item.word}}</span>
                    </li>
                </ul>
            </div>
            <div class="bottom">
                <ul class="yx" :style="{animationDuration: '15s', width: (1.2 + 0.35) * yxdmlist.length + 'rem'}">
                    <li v-for="(item, index) in yxdmlist" :key="index" class="dm" :style="{width: ((0.2) * 4 + 0.35) + 'rem'}">
                        <img class="hd" :src="header_img"/>
                        <img class="sex" :src="woman_img"/>
                        <span class="text">{{item.word}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="dm-content">
            <ul class="wx">
                <li v-for="(item, index) in wxdmlist" :key="index" class="dm" :style="{width: ((0.2) * 4 + 0.35) + 'rem', top: item.top, animationDelay: index * 0.3 + 's', animationDuration: item.time + 's' }">
                    <img class="hd" :src="header_img"/>
                    <img class="sex" :src="man_img"/>
                    <span class="text">{{item.word}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import lodash from "lodash";
    import {
        Loading,
        Slide,
        Button,
        Dialog,
        Toast,
        Style
    } from 'cube-ui';
    import { mapState } from 'vuex';
    import { checkToken }  from '../utils/ajax';

    Vue.use(Loading);
    Vue.use(Slide);
    Vue.use(Button);
    Vue.use(Toast);
    Vue.use(Dialog);
    Vue.use(Style);

    export default {
        computed: {
            ...mapState([
                'wechat',
                'domainUrl'
            ])
        },
        data () {
            return {
                data: null,
                loading: false,
                statistic: null,
                header_img: require('../assets/img/sns_icon_8.png'),
                man_img: require('../assets/img/man.jpg'),
                woman_img: require('../assets/img/woman.jpg'),
                toast: null,
                code: '',
                yxdmlist: [
                    {
                        word: '有序弹幕'
                    },
                    {
                        word: '有序弹幕'
                    },
                    {
                        word: '有序弹幕'
                    },
                    {
                        word: '有序弹幕'
                    },
                    {
                        word: '有序弹幕'
                    },
                    {
                        word: '有序弹幕'
                    },
                    {
                        word: '有序弹幕'
                    }
                ],
                wxdmlist: [
                    {
                        word: '无序弹幕',
                        time: lodash.random(2, 8),
                        delay: lodash.random(0, 1),
                        top: lodash.random(0, 80) + '%'
                    },
                    {
                        word: '无序弹幕',
                        time: lodash.random(2, 8),
                        delay: lodash.random(0, 1),
                        top: lodash.random(0, 80) + '%'
                    },
                    {
                        word: '无序弹幕',
                        time: lodash.random(2, 8),
                        delay: lodash.random(0, 1),
                        top: lodash.random(0, 80) + '%'
                    },
                    {
                        word: '无序弹幕',
                        time: lodash.random(2, 8),
                        delay: lodash.random(0, 1),
                        top: lodash.random(0, 80) + '%'
                    },
                    {
                        word: '无序弹幕',
                        time: lodash.random(2, 8),
                        delay: lodash.random(0, 1),
                        top: lodash.random(0, 80) + '%'
                    },
                    {
                        word: '无序弹幕',
                        time: lodash.random(2, 8),
                        delay: lodash.random(0, 1),
                        top: lodash.random(0, 80) + '%'
                    },
                    {
                        word: '无序弹幕',
                        time: lodash.random(2, 8),
                        delay: lodash.random(0, 1),
                        top: lodash.random(0, 80) + '%'
                    }
                ]
            }
        },
        methods:{
            showToastLoading (msg) {
                this.toast = this.$createToast({
                    txt: msg || '加载中...',
                    mask: true
                })
                this.toast.show();
            },
            hideToastLoading (){
                this.toast.hide();
            },
            showToastMsg(type, msg){
                this.$createToast({
                    type: type,
                    time: 1000,
                    txt: msg
                }).show();
            },
            outhurl(){
                if(!this.loading) {
                    this.loading = true;
                    //this.showToastLoading('加载中...');
                    this.axios({
                        method: 'post',
                        url: '/wechat/outhurl',
                        data: {
                            type: 'userinfo',
                            state: 'maoxy',
                            redirect_uri: 'http://wxpay.maoxy.com'
                        }
                    }).then(function (response) {
                        this.loading = false;
                        if (response.status == 200 && response.data.code == 0) {
                            location.href = response.data.data.url;
                        }
                        else {
                            this.showToastMsg('warn', response.data.msg);
                        }
                    }.bind(this)).catch(function (error) {
                        this.loading = false;
                        this.showToastMsg('warn', '未知错误');
                    }.bind(this));
                }
            },
            outhinfo(successCb, errorCb){
                if(!this.loading) {
                    this.loading = true;
                    //this.showToastLoading('加载中...');
                    this.axios({
                        method: 'post',
                        url: '/wechat/outhinfo',
                        data: {
                            type: 'userinfo',
                            code: this.code
                        }
                    }).then(function (response) {
                        this.loading = false;
                        if (response.status == 200 && response.data.code == 0) {
                            this.sessionkey = response.data.data.sessionkey;
                            this.data = response.data.data;
                            let temp = this.data;
                            temp.code = this.code;
                            this.$store.dispatch('wechat', temp);
                            successCb();
                        }
                        else {
                            this.showToastMsg('warn', response.data.msg);
                            errorCb();
                        }
                    }.bind(this)).catch(function (error) {
                        this.loading = false;
                        this.showToastMsg('warn', '未知错误');
                        errorCb();
                    }.bind(this));
                }
            },
            getUrlKey(name) {
                return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
            }

        },
        mounted(){
            let that = this;
            document.title = '微信公众号';
            if(that.wechat && that.wechat.nickname){
                that.data = that.wechat;
            }

            let code = that.getUrlKey('code');
            if((that.wechat && !that.wechat.code) || !that.wechat) {
                if (code) {
                    that.code = code;
                    that.outhinfo(() => {
                        console.log('000000000000');
                    }, () => {
                        console.log('222222222222');
                    });
                }
                else {
                    that.outhurl();
                }
            }
        }
    }
</script>
<style scoped="scoped">
    .center-page{
        position: relative;
        background-color: #f0eff4;
        overflow-y: auto;
    }
    .header-wrapper {
        height: 0.9rem;
        width: 100%;
        display: flex;
        flex-direction: column;
        background: url('../assets/img/head.png');
        background-size: 100% 100%;
    }
    .header{
        height: 0.9rem;
        width: 100%;
        display: flex;
        flex-direction: row;
        padding-left: 0.15rem;
        padding-right: 0.15rem;
        box-sizing: border-box;
        align-items: center;
    }
    .header .left{
        width: 0.45rem;
        height: 0.45rem;
        box-sizing: border-box;
    }
    .header .right{
        box-sizing: border-box;
        padding-left: 0.25rem;
        width: calc( 100% - 0.6rem);
    }
    .header .left img{
        height: 100%;
        width: 100%;
        border-radius: 50%;
        border: 0.02rem solid white;
        display: block;
    }
    .header .right .name{
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #FFFFFF;
        font-weight: bold;
        margin-bottom: 0.08rem;
    }
    .header .right .address{
        font-family: PingFangSC-Regular;
        font-size: 0.14rem;
        color: rgba(255,255,255,0.80);
    }
    .home-content{
        background: #fff;
        margin-top: 0.12rem;
        padding-left: 0.15rem;
        padding-right: 0.15rem;
        font-family: PingFangSC-Regular;
        font-size: 0.12rem;
        box-sizing: border-box;
        padding-top: 0.12rem;
        padding-bottom: 0.12rem;
        color: #A7873E;
        position: relative;
    }
    .home-content:after{
        content: '';
        background-color: rgba(220,220,220,0.50);
        box-shadow: inset 0 -0.01rem 0 0 rgba(206,206,206,0.50);
        height: 0.01rem;
        transform: scaleY(0.5);
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
    }
    .home-content ul{
        list-style: none;
        margin: 0;
        padding: 0;
        padding-left: 0.1rem;
        padding-right: 0.1rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
    }
    .home-content li{
        width: 33.3%;
        padding-top: 0.1rem;
        padding-bottom: 0.1rem;
    }
    .home-content li .img{
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    .home-content li .num{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        margin-left: 0.15rem;
        top: -0.05rem;
        background: red;
        color: white;
        font-size: 0.12rem;
        border-radius: 50%;
        font-weight: bold;
        padding: 0.03rem 0.04rem;
    }
    .home-content li .img img{
        width: 0.3rem;
        height: 0.3rem;
        display: block;
    }
    .home-content li .title{
        text-align: center;
        height: 0.35rem;
        line-height: 0.35rem;
        font-size: 0.13rem;
        color: #3F3F3F;
    }
    .dm-content{
        width: 100%;
        height: calc( 50% - 1.6rem );
        margin-top: 0.12rem;
        overflow: hidden;
        background: white;
    }
    .dm-content ul.wx{
        margin: 0;
        padding: 0;
        list-style: none;
        position: relative;
        height: 100%;
        width: 100%;
    }
    .dm-content ul.wx .dm{
        position:absolute;
        animation: barrage 5s linear 0s infinite;
        display: flex;
        align-items: center;
        padding: 0.03rem;
        text-align: left;
        background: rgba(0,0,0,0.6);
        color:white;
        border-radius: 0.2rem;
        left:100%;
        font-size: 0.16rem;
    }
    .dm-content .top, .dm-content .middle, .dm-content .bottom{
        height: 33.3%;
        width: 100%;
        overflow: hidden;
        position: relative;
    }
    .dm-content ul.yx{
        margin: 0;
        padding: 0;
        list-style: none;
        height: 100%;
        width: 300%;
        display: flex;
        align-items: center;
        position: absolute;
        left:100%;
        animation: barrage 5s linear 0s infinite;
    }
    .dm-content ul.yx .dm{
        display: flex;
        align-items: center;
        padding: 0.03rem;
        text-align: left;
        background: rgba(0,0,0,0.6);
        color:white;
        border-radius: 0.2rem;
        float: left;
        margin-right: 0.15rem;
        font-size: 0.16rem;
        position: relative;
    }
    @keyframes barrage{
        from{
            visibility: visible;
            left:100%;
            transform:translate3d(0,0,0);
        }
        to{
            visibility: visible;
            left:0;
            /*通过3d变化（translate3d属性）来开启硬件加速*/
            transform:translate3d(-110%,0,0);
        }
    }
    .dm-content .dm .hd{
        display: inline-block;
        width: 0.3rem;
        height: 0.3rem;
        border-radius: 50%;
    }
    .dm-content .dm .text{
        font-size: 0.15rem;
        margin-left: 0.1rem;
    }
    .dm-content .dm .sex{
        position: absolute;
        left: 0.25rem;
        bottom: 0.06rem;
        display: block;
        width: 0.12rem;
        border-radius: 50%;
    }

</style>