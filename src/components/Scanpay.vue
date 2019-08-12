<template>
    <div class="content">
        <ul>
            <li :class="item.selected ? 'price-wrapper active' : 'price-wrapper'" @click="select(item, index)" v-for="(item, index) in lists" :key="index">
                <div class="inner">
                    <div class="price">{{item.price}}元</div>
                </div>
            </li>
        </ul>
        <div class="pay-code">
            <img class="payqrcode" :src="codeSrc ? codeSrc : require('../assets/img/qrcode.jpg')"/>
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
                lists: [
                    {
                        price: 0.1,
                        selected: true,
                    },
                    {
                        price: 0.2,
                        selected: false,
                    },
                    {
                        price: 0.3,
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
                ],
                loading: false,
                codeSrc: ''
            }
        },
        methods:{
            select(item, index){
                let lists = this.lists;
                for(let i=0; i<lists.length; i++){
                    lists[i].selected = false;
                    if(i == index){
                        lists[i].selected = true;
                    }
                }

                this.lists = lists;
            },
            codeurl(){
                let that = this;
                if(!that.loading) {
                    that.loading = true;
                    that.axios.post('/wechat/scanpayurl', {

                    })
                    .then(function (response) {
                        that.loading = false;
                        console.log(response);
                        if (response.status == 200 && response.data.code == 0) {
                            that.codeSrc = response.data.data.qrcode_url;
                        }
                        else {

                        }
                    })
                    .catch(function (error) {
                        that.loading = false;

                    });
                }
            }
        },
        mounted(){
            this.codeurl();
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
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .price-wrapper .inner .name{
        font-size: 0.14rem;
        display: inline;
    }
    .price-wrapper.active .inner .price{
        color: white;
    }
    .pay-code{
        margin-top: 0.3rem;
        padding: 0.15rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .payqrcode{
        width: 70%;
        display: block;
    }
</style>