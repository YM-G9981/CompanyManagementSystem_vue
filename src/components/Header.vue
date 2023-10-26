<template>
    <el-page-header>
        <template #content>
            <span class="text-large font-600 mr-3"> OA管理系统 </span>
        </template>
        <template #extra  >
                <el-button :circle="cricle" :round="round" :type="type"  @mouseover="mouseover()" @mouseleave="mouseleave()" @click="$emit('modifySearch')" > <el-icon ><Search /></el-icon>{{ searchHtml }}</el-button>
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
        </template>
    </el-page-header>
</template>
  
<script>
  export default {
    methods :{
        mouseover(){
            this.searchHtml = "搜索"
            this.round = true
            this.cricle =false
            this.type = "primary"
        },
        mouseleave(){
            this.searchHtml = ""
            this.round = false
            this.cricle =true
            this.type = ""
        }
    },
    data(){
        return{
            cricle : false,
            round : true,
            type : "primary",
            searchHtml :""
         }
    }
  }
</script>
<style>
    .search >.el-autocomplete{
        margin: 5px;
        width: 80%;
    }
    
</style>