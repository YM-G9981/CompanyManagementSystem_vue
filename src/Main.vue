<template>
    <div class="common-layout" >
      <el-container >
        <el-header style="height :fit-content"><el-card class="box-card"><Header @modify-search="searchTrue"/></el-card></el-header>
        <SearchInput @modify-search="searchFalse" :search="search" id="searchinput"/>
      
        <el-container >
          <el-aside style="width: fit-content"><List v-model:item = "mainPage" /></el-aside>
          <el-main>
            <HrmResource v-model:mainPage="mainPage" v-if="showpage=='hrmResource'"/>
            <Attendance v-model:mainPage="mainPage" v-if="showpage == 'attendance'"/>
            <NewsAndReport v-model:mainPage="mainPage" v-if="showpage=='newsAndReport'"/>
            <Mail v-model:mainPage="mainPage" v-if="showpage=='mail'"/>
            <MissionMainPage v-model:mainPage="mainPage" v-if="showpage=='mission'"/>
            <FileStream v-model:mainPage="mainPage" v-if="mainPage=='fileStream'"/>
           </el-main>
        </el-container>
      </el-container>
    </div>
  </template>
<script>
import List from './components/List.vue';
import Header from './components/Header.vue';
import SearchInput from './components/SearchInput.vue'
import HrmResource from './components/mainPage/hrmResource/HrmResource.vue';
import Attendance from './components/mainPage/attendance/Attendance.vue';
import NewsAndReport from './components/mainPage/newsAndReport/NewsAndReport.vue';
import Mail from './components/mainPage/mail/Mail.vue';
import MissionMainPage from './components/mainPage/mission/MissionMainPage.vue';
import FileStream from './components/mainPage/fileStream/FileStream.vue'
export default {
  name: 'App',
  props:{
  },
  components: {
    List,
    Header,
    SearchInput,
    HrmResource,
    Attendance,
    NewsAndReport,
    Mail,
    MissionMainPage,
    FileStream
},
  data(){
    return {    search: false,
      mainPage : "",
      showpage : ""
    }
  }
  ,methods:{
    searchTrue(){
      this.search = true
    },
    searchFalse(){
      this.search = false
    }
  },
  watch : {
    mainPage:function(){
      if(this.mainPage.includes("hrm")){
        this.showpage = "hrmResource"
      }
      else if(this.mainPage.includes('attend')){
        this.showpage = "attendance"
      }
      else if(this.mainPage.includes('newsOf')){
        this.showpage = "newsAndReport"
      }
      else if(this.mainPage.includes('mail')){
        this.showpage = "mail" 
      }
      else if(this.mainPage.includes('mission')){
        this.showpage = "mission"
      }
    }
  }
  ,setup(){
  }
    
  
}
</script>
<style>
#searchinput{
  position: absolute;
  top: 60px;
  width: 60%;
  
  left: 20%;
  z-index: 999;
  border-radius: 20px;
}
#el-container{
  margin: auto;
}
</style>
  