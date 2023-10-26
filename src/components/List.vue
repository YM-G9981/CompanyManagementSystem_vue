<template >
    <el-card class="box-card"  style="width: fit-content">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo" 
      :collapse="isCollapse"
      @select="handleSelect"
      @mouseenter="isCollapse = false"
      @mouseleave="isCollapse = true"
      unique-opened
    >
      <el-sub-menu index="hrmResource">
        <template #title>
          <el-icon><UserFilled /></el-icon>
          <span>人力模块</span>
        </template>
        <el-menu-item-group  >
          <el-menu-item index="hrmDepartment">部门</el-menu-item>
          <el-menu-item index="hrmPersonal">人事</el-menu-item>
          <el-menu-item index="hrmPosition">职位</el-menu-item>
          <el-menu-item index="hrmUser">用户</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="attend">
        <template #title>
          <el-icon><Briefcase /></el-icon>
          <span>考勤模块</span>
        </template>
        <el-menu-item-group >
          <el-menu-item index="attendSign">签到考勤</el-menu-item>
          <el-menu-item index="attendSignRule">签到规则</el-menu-item>
          <el-menu-item index="attendLeave">请假考勤</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="newsAndReport">
        <template #title>
          <el-icon><HelpFilled /></el-icon>
          <span>通知新闻模块</span>
        </template>
        <el-menu-item-group >
          <el-menu-item index="newsOfAnnounance">通知</el-menu-item>
          <el-menu-item index="newsOfNews">新闻</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="mail">
        <template #title>
          <el-icon><Comment /></el-icon>
          <span>邮件模块</span>
        </template>
        <el-menu-item-group >
          <el-menu-item index="mailOuter">外部邮件</el-menu-item>
          <el-menu-item index="mailInner">内部邮件</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="mission">
        <template #title>
          <el-icon><Opportunity /></el-icon>
          <span>任务</span>
        </template>
        <el-menu-item-group >
          <el-menu-item index="mission">任务</el-menu-item>
          <el-menu-item index="missionType">任务类型</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="file">
        <template #title>
          <el-icon><Stamp /></el-icon>
          <span>工作流</span>
        </template>
        <el-menu-item-group >
          <el-menu-item index="fileStream">工作流</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-card>
  </template>
  
  <script lang="ts">
  import { ref } from 'vue'
  export default {
    name : "List",
    props : {
      item : String
    },
    data(){
      return{
        isCollapse: ref(false)
      }
    },
    methods:{
        handleSelect (key: string) {
          this.$emit("update:item",key)
          this.isCollapse = ref(true)   
        }
    },
    mounted() {
        
    },
  }
  </script>
  
  <style>
  /* .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 250px;
    min-height: 400px;
  } */
  </style>