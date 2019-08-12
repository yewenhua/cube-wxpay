<template>
    <div class="jsapi-page">
        <div class="jsapi-content">
            <div class="input-item has-border">
                <div class="left">
                    <div class="name">扫码结果</div>
                </div>
                <div class="right">
                    <cube-input v-model="sn" class="bind-input" placeholder="请输入（扫描）条形码或二维码"></cube-input>
                </div>
                <div class="scan-area" @click="scan">
                    <img :src="require('../assets/img/scan.png')"/>
                </div>
            </div>
            <div class="input-item goto" @click="photo">
                <div class="left">
                    <div class="name">选择头像</div>
                </div>
                <div class="right"></div>
            </div>
        </div>

        <div class="preview">
            <img :src="item" v-for="(item, index) in localIds" :key="index"/>
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

    Vue.use(Loading);
    Vue.use(Button);
    Vue.use(Toast);
    Vue.use(Style);

    export default {
        data () {
            return {
                wxinit: false,
                loading: false,
                jssdk: null,
                toast: null,
                sn: '',
                localIds: []
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
            showToastMsg(type, msg, time){
                this.$createToast({
                    type: type,
                    time: time || 1500,
                    txt: msg
                }).show();
            },
            sign(){
                let that = this;
                if(!that.loading) {
                    that.loading = true;
                    that.axios({
                        method: 'post',
                        url: '/wechat/jssdk',
                        data: {
                            url: location.href.split('#')[0]
                        }
                    })
                    .then(function (response) {
                        that.loading = false;
                        if (response.status == 200 && response.data.code == 0) {
                            that.jssdk = response.data.data.jssdk;
                            that.init(response.data.data.jssdk);
                        }
                        else {

                        }
                    })
                    .catch(function (error) {
                        that.loading = false;

                    });
                }
            },
            init(data){
                console.log('===================');
                console.log(data);
                var that = this;
                if(typeof WeixinJSBridge == "undefined"){
                    if(document.addEventListener){
                        document.addEventListener('WeixinJSBridgeReady', wechat, false);
                    }
                    else if(document.attachEvent){
                        document.attachEvent('WeixinJSBridgeReady', wechat);
                        document.attachEvent('onWeixinJSBridgeReady', wechat);
                    }
                }
                else{
                    wechat();
                }

                function wechat(){
                    wx.config({
                        debug:false,
                        signature: data.signature,
                        appId: data.appId,
                        timestamp: data.timeStamp,
                        nonceStr: data.nonceStr,
                        jsApiList: [
                            'scanQRCode',
                            'chooseImage',
                            'previewImage',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                        ],
                    });
                    wx.ready(function(){
                        that.wxinit = true;
                        let share_url = location.href.split('#')[0];

                        wx.onMenuShareAppMessage({
                            title: '分享标题',
                            desc: '分享描述',
                            link: share_url,
                            imgUrl: 'https://wl.voc.so/backend/img/logo.png',
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', //如果type是music或video，则要提供数据链接，默认为空
                            success: function(){
                                // 用户确认分享后执行的回调函数
                                console.log('SUCCESS');
                            },
                            cancel: function(){
                                // 用户取消分享后执行的回调函数
                                console.log('FAIL');
                            }
                        });

                        wx.onMenuShareTimeline({
                            title: '分享标题',
                            link: share_url, // 分享链接
                            imgUrl: 'https://wl.voc.so/backend/img/logo.png', // 分享图标
                            success: function(){
                                // 用户确认分享后执行的回调函数
                                console.log('SUCCESS');
                            },
                            cancel: function(){
                                // 用户取消分享后执行的回调函数
                                console.log('FAIL');
                            }
                        });
                    });
                    wx.error(function(res){
                        that.wxinit = false;
                    });
                }
            },
            scan(){
                var that = this;
                if(that.wxinit) {
                    wx.scanQRCode({
                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                        success: function (res) {
                            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                            if(result.indexOf(',') !== -1){
                                result = result.split(',')[1]
                            }

                            that.sn = result;
                        }
                    });
                }
                else{
                    that.showToastMsg('warn', '微信初始化失败');
                }
            },
            photo(){
                var that = this;
                if(that.wxinit) {
                    wx.chooseImage({
                        count: 1, // 默认9
                        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function (res) {
                            that.localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                            console.log(res.localIds);
                        }
                    });
                }
                else{
                    that.showToastMsg('warn', '微信初始化失败');
                }
            },
            preview(){
                var that = this;
                if(that.wxinit) {
                    wx.previewImage({
                        current: '', // 当前显示图片的http链接
                        urls: [] // 需要预览的图片http链接列表
                    });
                }
                else{
                    that.showToastMsg('warn', '微信初始化失败');
                }
            },
        },
        mounted(){
            this.sign();
        }
    }
</script>
<style>
    .jsapi-page{
        background-color: #f0eff4;
    }
    .jsapi-content{
        background: white;
        margin-top: 0.12rem;
        position: relative;
    }
    .jsapi-content:after{
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
    .input-item{
        margin-left: 0.15rem;
        width: calc( 100% - 0.15rem );
        height: 0.48rem;
        display: flex;
        flex-direction: row;
        background: white;
        position: relative;
    }
    .input-item.has-border:after{
        content: '';
        background-color: rgba(220,220,220,0.50);
        height: 0.01rem;
        transform: scaleY(0.5);
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
    }
    .input-item .left{
        width: 0.8rem;
    }
    .input-item .right{
        width: calc( 100% - 0.8rem );
    }
    .input-item .left .name{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: left;
        font-size: 0.15rem;
        color: #4e4e4e;
    }
    .input-item.goto:after{
        content: '';
        position: absolute;
        right: 0.15rem;
        top: 50%;
        width: 0.08rem;
        height: 0.08rem;
        border-right: 0.01rem solid #B2B2B2;
        border-bottom: 0.01rem solid #B2B2B2;
        transform: rotate(-45deg) translateY(-50%);
        transition: all 0.3s;
    }
    .jsapi-content .cube-input::after{
        border: none;
    }
    .jsapi-content .cube-input{
        margin-bottom: 0rem;
        height: 100%;
        width: 100%;
    }
    .jsapi-content /deep/ .cube-input input.cube-input-field{
        height: 100%;
        margin-bottom: 0rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .scan-area{
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 0.6rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .scan-area img{
        height: 0.3rem;
    }
    .preview{
        margin-top: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .preview img{
        max-height: 3rem;
        max-width: 3rem;
        display: block;

    }
</style>