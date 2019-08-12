<template>
    <div class="wechat-page">
        <div class="b-tip">
            <img :src="logo_img"/>
        </div>
        <div class="w-content">
            <cube-input v-model="mobile" class="bind-input" placeholder="请输入手机号码"></cube-input>
            <cube-input v-model="password" type="password" class="bind-input" placeholder="请输入密码"></cube-input>
        </div>
        <div class="bind">
            <cube-button :primary="true" @click="login">登录</cube-button>
        </div>
        <div class="goto">
            <div class="left">
                <router-link :to="{ name:'signup'}">注册账号</router-link>
            </div>
            <div class="right">
                <router-link :to="{ name:'forget'}">忘记密码</router-link>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {
        Loading,
        Button,
        Toast,
        Style
    } from 'cube-ui';
    import { checkSigninPage }  from '../../utils/ajax';

    Vue.use(Loading);
    Vue.use(Button);
    Vue.use(Toast);
    Vue.use(Style);

    export default {
        data () {
            return {
                logo_img: require('../../assets/img/logo.png'),
                password: '',
                mobile: '',
                loading: false,
                toast: null
            }
        },
        methods:{
            showToastLoading (msg) {
                this.toast = this.$createToast({
                    txt: msg,
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
                    time: 1500,
                    txt: msg
                }).show();
            },
            login(){
                if(!this.mobile){
                    this.showToastMsg('warn', '手机号码不能为空');
                    return false;
                }
                if(!this.password){
                    this.showToastMsg('warn', '密码不能为空');
                    return false;
                }

                if(!this.loading) {
                    this.loading = true;
                    this.showToastLoading('登录中...');
                    let url = 'oauth/token?client_id=e41df05b-f963-4a66-a8cd-8596d1564fee&client_secret=3ca4b24f-d2cd-44cc-b5c9-31f88c7c5631&grant_type=password&scope=read,write&username=' + this.mobile + '&password=' + this.password;
                    this.axios({
                        method: 'post',
                        url: url,
                        data: {

                        },
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    }).then(function (response) {
                        this.loading = false;
                        this.hideToastLoading();
                        if (response.status == 200 && response.data.type == 'SUCCESS') {
                            //this.showToastMsg('correct', '登录成功');
                            this.$store.dispatch('login', {
                                access_token: response.data.data.access_token,
                                refresh_token: response.data.data.refresh_token
                            });

                            let redirect = decodeURIComponent(this.$route.query.redirect || '/');
                            this.$router.push({
                                path: redirect
                            });
                        }
                        else {
                            this.showToastMsg('warn', response.data.content);
                        }
                    }.bind(this)).catch(function (error) {
                        this.loading = false;
                        this.hideToastLoading();
                        this.showToastMsg('warn', error.content || '未知错误');
                    }.bind(this));
                }
            }
        },
        mounted(){
            document.title = '登录';
            let query = this.$route.query;
            if(query && query.code){
                this.$store.dispatch('subcribe', {
                    subCode: query.code
                });
            }

            checkSigninPage(()=>{
                this.$router.push({
                    path: '/'
                });
            });
        }
    }
</script>
<style scoped="scoped">
    .wechat-page{
        box-sizing: border-box;
        padding: 0.15rem;
        background-color: #fff;
    }
    .b-tip{
        font-family: PingFangSC-Regular;
        font-size: 0.12rem;
        color: #888888;
        margin-bottom: 0.08rem;
        text-align: center;
        display: flex;
        justify-content: center;
        padding-top: 0.3rem;
        padding-bottom: 0.3rem;
    }
    .b-tip img{
        width: 1.68rem;
        height: 0.8rem;
        display: block;
    }
    .w-content .cube-input::after{
        border: none;
        box-shadow: inset 0 -0.01rem 0 0 rgba(220,220,220,0.50);
    }
    .w-content .cube-input{
        margin-bottom: 0.2rem;
    }
    .bind{
        margin-top: 0.4rem;
    }
    .bind .cube-btn{
        width: 100%;
        height: 0.45rem;
        line-height: 0.45rem;
        padding: 0;
        font-size:  0.16rem;
    }
    .bind .cube-btn-primary {
        background: rgba(79,119,255,1);
        box-shadow: 0 0.05rem 0.08rem 0 rgba(79,119,255,0.25);
        border-radius: 0.04rem;
    }
    .bind:active .cube-btn-primary {
        background: rgba(79,119,255,0.8);
    }
    .goto{
        display: flex;
        flex-direction: row;
        height: 0.4rem;
        margin-top: 0.15rem;
    }
    .goto .left{
        width: 50%;
        position: relative;
        height: 100%;
    }
    .goto .right{
        width: 50%;
        height: 100%;
    }
    .goto .left:after{
        content: '';
        background-color: rgba(220,220,220,0.50);
        height: 100%;
        transform: scaleX(0.5);
        transform: scaleY(0.5);
        width: 0.01rem;
        position: absolute;
        right: 0;
        top: 0;
    }
    .goto a{
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.14rem;
        color: #555555;
    }
</style>