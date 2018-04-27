<template>
  <div class="device">
    <ul>
      <li>
        <p class="name" >西单一号线-b1口</p>
        <p class="status">未连接</p>
        <p>化学有毒有害物质检测仪</p>
        <p class="contact">asdasd<br>123123123</p>
      </li>
    </ul>
    <button class="backBtn btn btn-danger"><router-link to="./" style="color:#fff"><span>返回前一页</span></router-link></button>
  </div>
</template>

<script>
  import {POINT_STATE} from '../data/const'


  export default ({
    props: ['monitorPoints','activePoint'],
    name:'device',
    data(){
      return {
        pointStates: POINT_STATE
      }
    },
    methods:{
      deviceSelect: function(device) {
        this.$emit('deviceselect', device)
      }
    },
    mounted:function () {
      console.log(this.$props.monitorPoints);
    },
  })


</script>

<style scoped>
.device{
  width: 100%;
}
.place{
  color: #fff;
}
ul{
  max-width:1200px;
  margin: 40px auto;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  list-style: none;
}
li{
  height: 195px;
  flex-grow: 1;
  flex-basis: 130px;
  text-align: center;
  padding: 10px;
  border: 1px solid #000;
  margin: 10px;
  background-color: #757A7E;
  border-radius: 5px;
  position: relative;
}
@media  screen and (max-width: 360px) {
  .place{
    font-size: 1rem;
  }
}
@media screen and (min-width: 360px) and (max-width: 410px){
  .place{
    font-size: 1.5rem;
  }
}
@media screen and (min-width: 410px) and (max-width: 600px) {
  .place{
    font-size: 2rem;
  }
}

@media screen and (min-width: 600px) and (max-width: 1024px){
  .place{
    font-size: 2.5rem;
  }
  @media screen and (min-width: 1024px){
    .place{
      font-size: 3rem;
    }
  }
}
  .backBtn{
    width: 100%;
    height: 7%;
    border-radius: 10px;
    color: #000;
    position: absolute;
    bottom: 0;
  }
  .name{
    width: 70%;
    margin: 0 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .status{
    color: #3d4042;
    font-size: 2rem;
    height: 20%;
    padding-top: 5%;
  }
  .contact{
    line-height: 32px;
    font-size: 20px;
    color: #fff;
  }
</style>
