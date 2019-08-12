<template>
    <div class="content">
        <ul>
            <li :class="item.selected ? 'price-wrapper active' : 'price-wrapper'" @click="select(item, index)" v-for="(item, index) in lists" :key="index">
                <div class="inner">
                    <div class="price">{{item.price}}元</div>
                </div>
            </li>
        </ul>
        <div class="bind">
            <cube-button :primary="true" @click="pay">提交支付</cube-button>
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
    import { mapState } from 'vuex';

    Vue.use(Loading);
    Vue.use(Button);
    Vue.use(Toast);
    Vue.use(Style);

    export default {
        computed: {
            ...mapState([
                'domainUrl'
            ])
        },
        data () {
            return {
                loading: false,
                openkey: '',
                price: '',
                code: '',
                lists: [
                    {
                        price: 0.01,
                        selected: true,
                    },
                    {
                        price: 0.02,
                        selected: false,
                    },
                    {
                        price: 0.03,
                        selected: false,
                    },
                    {
                        price: 1,
                        selected: false,
                    },
                    {
                        price: 10,
                        selected: false,
                    },
                    {
                        price: 20,
                        selected: false,
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
            showToastMsg(type, msg, time){
                this.$createToast({
                    type: type,
                    time: time || 1500,
                    txt: msg
                }).show();
            },
            select(item, index){
                let lists = this.lists;
                for(let i=0; i<lists.length; i++){
                    lists[i].selected = false;
                    if(i == index){
                        lists[i].selected = true;
                        this.price = lists[i].price;
                    }
                }

                this.lists = lists;
            },
            outhurl(){
                if(!this.loading) {
                    this.loading = true;
                    this.showToastLoading('加载中...');
                    this.axios({
                        method: 'post',
                        url: '/wechat/outhurl',
                        data: {
                            type: 'base',
                            state: 'maoxy',
                            redirect_uri: this.domainUrl
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
            outhinfo(){
                if(!this.loading) {
                    this.loading = true;
                    this.showToastLoading('加载中...');
                    this.axios({
                        method: 'post',
                        url: '/wechat/outhinfo',
                        data: {
                            type: 'base',
                            code: this.code
                        }
                    }).then(function (response) {
                        this.loading = false;
                        if (response.status == 200 && response.data.code == 0) {
                            this.openkey = response.data.data.openkey;
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
            pay(){
                if(!this.loading) {
                    this.loading = true;
                    this.showToastLoading('提交中...');
                    this.axios({
                        method: 'post',
                        url: '/wechat/wxpay',
                        data: {
                            openkey: this.openkey,
                            price: this.price
                        }
                    }).then(function (response) {
                        this.loading = false;
                        if (response.status == 200 && response.data.code == 0) {
                            //this.showToastMsg('correct', '支付成功');

                        }
                        else {
                            this.showToastMsg('warn', response.data.msg);
                        }
                    }.bind(this)).catch(function (error) {
                        this.loading = false;
                        this.showToastMsg('warn', '未知错误');
                    }.bind(this));
                }
            }
        },
        mounted(){
            let query = this.$route.query;
            if(query && query.code){
                this.code = query.code;
                this.outhinfo();
            }
            else{
                this.outhurl();
            }
        }
    }
</script>
<style scoped="scoped">
    .content{
        height: 100%;
        width: 100%;
        background: white;
    }
    .content ul{
        list-style: none;
        padding:0;
        margin: 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        margin-bottom: 0.35rem;
    }
    .price-wrapper{
        width: 50%;
        box-sizing: border-box;
    }
    .price-wrapper .inner{
        margin-left: 0.15rem;
        margin-right: 0.15rem;
        margin-top: 0.15rem;
        border-radius: 0.03rem;
        border: 1px dashed #44b549;
        background: white;
        color: #44b549;
        padding: 0.1rem;
        text-align: center;
    }
    .price-wrapper.active .inner{
        background-image: -webkit-linear-gradient( 0deg, rgb(0,172,208) 0%, rgb(0,199,191) 100%);
        border: 1px solid #efeef6;
        color: white;
    }
    .price-wrapper .inner .price{
        font-size: 0.2rem;
        font-weight:bold;
        display: block;
    }
    .price-wrapper .inner .name{
        font-size: 0.14rem;
        display: inline;
    }
    .price-wrapper.active .inner .price{
        color: white;
    }
    .bind{
        margin-top: 0.3rem;
        padding: 0.15rem;
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
</style>