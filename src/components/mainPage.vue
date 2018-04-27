<template>
  <div class="container-fluid">
      <div class="row">
        <header>
            <span>登录用户：{{name}}</span>
          <span style="display: inline-block;float: right">{{date}}</span>
        </header>
        <section>
          <tree v-if="usertype == 3" v-on:roomselect="roomSelect"    v-on:nodeselect="nodeSelect"></tree>
          <device v-if="usertype == 2 && room.monitorPoints && room.monitorPoints.length > 0" v-bind:monitor-points="room.monitorPoints" v-bind:active-point="activePoint" v-on:deviceselect="deviceSelect"></device>
        </section>
        <footer>
          <span>技术支持：{{serverPhone}}</span>
          <router-link to="/"><button class="btn btn-dark" v-on:click="quit()">退出</button></router-link>
        </footer>
      </div>
  </div>
</template>

<script>
  import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
  import $ from 'jquery'
  import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
  import tree from './tree'
  import device from './device'

  import {formatTimestamp} from '../data/date-utils'
  import {initData,getServicePhone} from "../data/data-util";
  import {startWS, registerData, bus} from '../data/websocket'
  import {POINT_STATE_FAULT, POINT_STATE_UNCONNECT} from '../data/const'
  import {loadConfig} from '../data/dataurl'

  var userinfo = {
    name:'',
    date:'',
    serverPhone:null,
    usertype:null,
  };
  var data = initData();
  export default ({
      name:'mainPage',
      data (){
        return userinfo;data;
      },

    methods:{
      deviceSelect: function(point) {
        if ( (""+point.state) === POINT_STATE_UNCONNECT) {
          return;
        }
        data.activePoint = point;
      },
      roomSelect: function(roomData) {
        // 初始化为未连接状态
        for (var i = 0; i < roomData.monitorPoints.length; i++) {
          roomData.monitorPoints[i].state = POINT_STATE_UNCONNECT;
          roomData.monitorPoints[i].condition = [];
        }
        data.room = roomData;
        data.activePoint = null;
        registerData(roomData.monitorPoints);
      },
      nodeSelect: function(node) {
        //console.log("node select:" + node.name);
        var list = [], $this = this, i;
        if (!!node.roomId) {
          loadConfig(node.roomId, function(roomData) {
            if (roomData.monitorPoints.length != 0) {
              alert(roomData.roomName + "没有配置任何监测设备");
              console.log(roomData);
              return;
            }
            $this.roomselect = roomData;
            for (i = 0; i < roomData.monitorPoints.length; i++) {
              list.push({
                "id": roomData.monitorPoints[i].pointId,
                "name": roomData.monitorPoints[i].pointName,
                "type": "point",
                "device": roomData.monitorPoints[i],
                "gisdata": roomData.monitorPoints[i].pointCoordinate
              });
            }
            //location.href = "/mainPage/device";
          });

        } else {
          this.collectRoomPositions(node, list);

        }
      },
      collectRoomPositions: function(node, list) {
        if (!!node.roomId) {
          list.push({
            "id": node.roomId,
            "name": node.roomName,
            "type": "room",
            "node": node,
            "gisdata": node.pointCoordinate
          });
        } else {
          for (var i = 0; i < node.children.length; i++) {
            this.collectRoomPositions(node.children[i], list);
          }
        }
      },
    },

    components:{
      tree,device,
    },
    mounted:function () {
        userinfo.name = data.user.name;
        userinfo.serverPhone = getServicePhone();
        userinfo.usertype = data.user.userType
      //this.roomData = data.room
        //console.log(this.node);
    }
  })
  setInterval(function() {
    var now = new Date();
    var dt = formatTimestamp(now.getTime());
    userinfo.date = dt;
  }, 1000);

  startWS();

  bus.$on("monitor-data", (serverRealtimeData) => {
    var points = data.room.monitorPoints;
    var now = new Date().getTime();
    for (var i = 0; i < points.length; i++) {
      var mypoint = points[i];

      if (mypoint.pointId === serverRealtimeData.monitorPoint) {
        mypoint.updateTime = now;

        if (serverRealtimeData.runstate === 0) {
          // 断线
          mypoint.state = POINT_STATE_UNCONNECT;
        } else if (serverRealtimeData.state > 0) {
          // 报警
          mypoint.state = serverRealtimeData.state;
        } else if (serverRealtimeData.runstate === 3) {
          // 故障
          mypoint.state = POINT_STATE_FAULT;
        } else {
          mypoint.state = serverRealtimeData.state;
        }
      }
    }
  });
  /*
 * 定期任务
 * 1. 检查监测点更新，如果90秒中未更新，则设置为未更新状态
 * 2. 凌晨3点，刷新一下页面，防止内存泄露
 */
  setInterval(function() {
    var points = data.room.monitorPoints;
    var now = new Date();

    if (!points) {
      return;
    }

    for (var i = 0; i < points.length; i++) {
      var mypoint = points[i];
      // 如果设备超过10秒钟，没有更新，就认为连接断了
      if (mypoint.updateTime && (now.getTime() - mypoint.updateTime) > 90000) {
        mypoint.state = POINT_STATE_UNCONNECT;
      }
    }

    reloadAt3AM(now);
  }, 5000);

  function reloadAt3AM(now) {
    var dog;
    if (now.getHours() === 3 && now.getMinutes() === 0 && now.getSeconds() < 10) {
      dog = sessionStorage.getItem("reloadDog") || 0;
      if ((+dog) < now.getTime()) {
        sessionStorage.setItem("reloadDog", now + 10000);
        location.reload(true);
      }
    }
  }
</script>


<style scoped>
  .container-fluid{
    width: 100%;
    height: 100%;
    color: #fff;
  }
  header{
    width: 100%;
    position: fixed;
    top: 0;
  }
  header span{
    line-height: 100%;
  }
  section{
    width: 100%;
    margin-top: 10%;
    text-align: center;
  }
  footer{
    width: 100%;
    position: fixed;
    bottom: 0;
  }
  footer button{
    float:right;
    width: 25%;
    border: none;
    ontlien:none
  }
  @media  screen and (max-width: 360px) {
    span{
      font-size: 1rem;
    }
  }
  @media screen and (min-width: 360px) and (max-width: 410px){
    span{
      font-size: 1.5rem;
    }
  }
  @media screen and (min-width: 410px) and (max-width: 600px) {
    span{
      font-size: 2rem;
    }
  }

  @media screen and (min-width: 600px) and (max-width: 1024px){
    span{
      font-size: 2.5rem;
    }
    @media screen and (min-width: 1024px){
      span{
        font-size: 3rem;
      }
    }
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
</style>
