<template>
    <div>
        <div class="num">在线人数： <span id="number">{{count}}</span></div>
        <div class="num">在线用户列表：</div>
        <ul id="online">
            <li v-for="(val, key) in onlineUsers" :class="val.selected ? 'active': ''" @click="select(key)">{{ val.username }}</li>
        </ul>

        <div class="num">聊天内容：</div>
        <ul id="messages">
            <li v-for="(val, key) in messages" :class="val.type == 'login' || val.type == 'logout' ? 'center' : val.type == 'isay' ? 'isay right' : val.type == 'private' ? 'left private' : val.type == 'public' ? 'left public' : 'center'">
                <p>{{val.msg}}</p>
            </li>
        </ul>
        <div id="tip" style="position:absolute; left: 10px; bottom: 55px;">{{tip}}</div>
        <div class="form">
            <input id="m" autocomplete="off" v-model="msg" @focus="focus" @blur="blur"/><button @click="say">Send</button>
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
    import socket from 'socket.io-client';
    import lodash from "lodash";

    Vue.use(Loading);
    Vue.use(Button);
    Vue.use(Toast);
    Vue.use(Style);

    export default {
        data () {
            return {
                loading: false,
                io: '',
                count: 0,
                selectedUser: {},
                onlineUsers: {},
                messages: [],
                tip: '',
                msg: '',
                userObj: null
            }
        },
        methods:{
            init(){
                this.io = socket('https://maoxy.com/ai');
                this.io.on('connect', () => {
                    console.log('connect');

                    this.userObj = {
                        userid: Math.random(),
                        username: 'NAME' + lodash.random(1, 100) + 'HB'
                    };
                    this.io.emit('login', this.userObj);
                });

                this.io.on('disconnect', () => {
                    console.log('disconnect')
                });

                this.io.on('login', (msg) =>{
                    console.log('login: ' + JSON.stringify(msg));
                    for(let k in msg.onlineUsers){
                        msg.onlineUsers[k].selected = false;
                    }
                    this.onlineUsers = msg.onlineUsers;
                    this.count = msg.number;

                    let msgs = this.messages;
                    msgs.push({
                        type: 'login',
                        msg: msg.user.username + '加入了聊天室'
                    });
                    this.messages = msgs;
                });

                this.io.on('logout', (msg) =>{
                    console.log('logout: ' + JSON.stringify(msg));
                    if(msg.number > 0) {
                        for(let k in msg.onlineUsers){
                            msg.onlineUsers[k].selected = false;
                        }
                        this.onlineUsers = msg.onlineUsers;
                    }
                    else{
                        this.onlineUsers = {};
                    }

                    let msgs = this.messages;
                    msgs.push({
                        type: 'logout',
                        msg: msg.user.username + '退出了聊天室'
                    });
                    this.messages = msgs;
                });

                this.io.on('typing', (msg) =>{
                    console.log('对方正在输入');
                    this.tip = msg.from.username + '正在输入……';
                });

                this.io.on('blur', (msg) =>{
                    this.tip = '';
                });

                this.io.on('message', (msg) =>{
                    console.log('message: ' + JSON.stringify(msg));
                    let info = {};
                    if(msg.type && msg.type == 'system'){
                        info.type = 'system';
                        info.msg = '系统消息：' + msg.content;
                    }
                    else {
                        let isme = (this.userObj.userid == msg.from.userid) ? true : false;
                        if (isme) {
                            info.type = 'isay';
                            info.msg = '我说：' + msg.content;
                        }
                        else {
                            if (msg.to.userid != '') {
                                info.type = 'private';
                                info.msg = msg.from.username + '私下对你说：' + msg.content;
                            }
                            else {
                                info.type = 'public';
                                info.msg = msg.from.username + '说：' + msg.content;
                            }
                        }
                    }

                    let msgs = this.messages;
                    msgs.push(info);
                    this.messages = msgs;
                });
            },
            say(){
                if(this.msg) {
                    let msg = {};
                    msg.from = this.userObj;
                    msg.content = this.msg;
                    msg.to = {};
                    if (this.selectedUser && this.selectedUser.hasOwnProperty('userid')) {
                        msg.to.userid = this.selectedUser.userid;
                        msg.to.username = this.selectedUser.username;
                    }
                    else {
                        msg.to.userid = '';
                        msg.to.username = '';
                    }

                    this.io.emit('message', msg);
                    this.msg = '';
                }
            },
            focus(){
                if(this.selectedUser && this.selectedUser.hasOwnProperty('userid')) {
                    var msg = {};
                    msg.from = this.userObj;
                    msg.to = {};
                    msg.to.userid = this.selectedUser.userid;
                    msg.to.username = this.selectedUser.username;

                    this.io.emit('typing', msg);
                }
            },
            blur(){
                if(this.selectedUser && this.selectedUser.hasOwnProperty('userid')) {
                    var msg = {};
                    msg.from = this.userObj;
                    msg.to = {};
                    msg.to.userid = this.selectedUser.userid;
                    msg.to.username = this.selectedUser.username;
                    this.io.emit('blur', msg);
                }
            },
            select(key){
                for(let i in this.onlineUsers){
                    if(i != key){
                        this.onlineUsers[i].selected = false;
                    }
                    else{
                        this.onlineUsers[key].selected = !this.onlineUsers[key].selected;
                        if(this.onlineUsers[key].selected){
                            this.selectedUser = this.onlineUsers[key];
                        }
                        else{
                            this.selectedUser = null;
                        }
                    }
                }
            }
        },
        mounted(){
            this.init();
        }
    }
</script>
<style scoped="scoped">
    * { margin: 0; padding: 0; box-sizing: border-box; font-size: 0.14rem; }
    .form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; display: flex; justify-content: center; align-items: center;}
    .form input { border: 0; height: 0.4rem; line-height: 0.4rem; width: 85%; margin-right: .5%; }
    .form button { width: 14%; background: rgb(130, 224, 255); border: none; height: 0.4rem; line-height: 0.4rem; outline: 0;}
    .form button:active { background: rgba(130, 224, 255, 0.8);}
    #messages { list-style-type: none; margin: 0; padding: 0; padding-bottom: 0.1rem;}
    #messages li { padding: 0.02rem 0.1rem;}
    #messages li:nth-child(odd) { background: #fff; }
    #messages li.left{
        text-align: left;
    }
    #messages li.right{
        text-align: right;
    }
    #messages li.center{
        text-align: center;
    }
    #messages li p{
        padding: 0.05rem 0.15rem;
        display: inline-block;
        white-space: normal;
    }
    #messages li.private p{
        background-color: red;
    }
    #messages li.public p{
        background: deepskyblue;
    }
    #messages li.isay p{
        background: greenyellow;
    }
    #online{
        height: 1rem;
        overflow: auto;
        background: #bcbcbc;
    }
    #messages{
        height: calc( 100% - 2.3rem );
        overflow: auto;
        background: white;
    }
    #online li { padding: 0.02rem 0.15rem; background: transparent;}
    #online li.active{
        background: red;
        color: white;
    }
    .num{
        height: 0.3rem;
        line-height: 0.3rem;
        padding-left: 0.15rem;
        font-size: 0.14rem;
        border-bottom: 0.01rem solid #7e8c8d;
    }
</style>