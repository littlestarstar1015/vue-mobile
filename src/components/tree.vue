<template>
  <div class="tree-box">
    <ul>
      <li>
        <a>{{list.name}}</a>
        <ul>
          <li v-if="item.children.length>0" v-for="item in list.children">
            <h1>{{item.name}}</h1>
            <ul>
              <li v-for="meun in item.children">
                <h3><button class="btn btn-info" v-on:click="onclickNode(meun)">{{meun.name}}</button></h3>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
  import {initData} from "../data/data-util"
  var data = initData()
  var $vm;
  var nodeSelected;
  export default({
      name:'tree',
    data(){
      return {
        list:[],
      }
    },
    watch: {

    },
    methods:{
      onclickNode: function(node) {
        nodeSelected = node;
        console.log(node);
        this.$emit("nodeselect", nodeSelected);
        },
    },
    mounted:function () {
      var self = this;
      self.list = data.line;
      //console.log(data)
    },
  })
</script>

<style scoped>
  .tree-box{
    width: 80%;
    margin: 20px auto;
  }
  .tree-box a{
    color: #fff;
    text-decoration: none;
  }
  .tree-box li:first-child{
    font-size: 3rem;
  }
  ul li:first-child{
    margin-top:5%;
  }

</style>
