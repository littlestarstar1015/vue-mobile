<template>
  <div class="login container-fluid" id="login">
    <div class="row">
      <div class="col-xs-4"></div>
      <div class="col-xs-4" id="login-box">
        <img src="../assets/logo.png" class="img-responsive" alt="">
        <h1>消防烟感与生化综合监测系统</h1>
        <div class="form-group">
          <input type="text" id="username" placeholder="请输入账号"  class="form-control input-login username" v-model="username">
        </div>
        <div class="form-group">
          <input type="password" id="password" placeholder="请输入密码"  class="form-control input-login password" v-model="password" v-on:keyup.enter="login()">
        </div>
        <div class="form-group">
          <input type="submit" value="登录" class="form-control btn btn-primary" v-on:click="login()">
        </div>
        <p class="text-error">{{ errmsg }}</p>
      </div>
      <div class="col-xs-4"></div>
    </div>
  </div>
</template>
<script>
  import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
  import $ from 'jquery'
  import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
  import {login} from '../data/dataurl';
  import {cacheStationData} from '../data/data-util';

  import polyfile from 'babel-polyfill'



  var loginData = {
    username:'',
    password:'',
    errmsg:''
  };

  export default {
    name: 'login',
    data () {
      return loginData;
    },
    methods: {
      login: function() {
        if (this.username == "" || this.password == "") {
          loginData.errmsg = "用户名或密码不能为空";
          return;
        }
        login(this.username, this.password, function(success, data) {
          if (success) {
            cacheStationData(data);
            location.href = "/mainPage";
          } else {
            loginData.errmsg = data.message;
          }
        });
      },
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSSq to this component only -->
<style scoped>
  .login{
    width: 100%;
    height: 100%;
  }
  .row{
    height: 100%;
  }
  .col-xs-4{
    width: 100%;
  }
  #login-box{
    text-align: center;
  }
  #login-box img{
    padding-bottom: 0;
    display: block;
    margin: auto;
  }
  h1{
    color: #fff;
    margin-bottom: 40px;
    text-align: center;
  }

  .input-login{
    width: 100%;
    height: 100%;
    margin-top: 10px;
    border-radius: 5px;
    border: none;
    background-color: #c0c1c3;
    padding: 8px 15px;
  }

  .text-error{
    color: #e90000;
  }

  @media  screen and (max-width: 360px) {
    h1{
      font-size: 1.5rem;
    }
  }
  @media screen and (min-width: 360px) and (max-width: 410px){
    h1{
      font-size: 2rem;
    }
  }
  @media screen and (min-width: 410px) and (max-width: 600px) {
    h1{
      font-size: 2.5rem;
    }
  }

  @media screen and (min-width: 600px) and (max-width: 1024px){
    h1{
      font-size: 3rem;
    }
    @media screen and (min-width: 1024px){
      h1{
        font-size: 3.5rem;
      }
    }
  }
  .text-error{
    color: #e90000;
    margin-top: 10px;
    display: inline-block;
  }
</style>
