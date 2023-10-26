<template>
    <el-card style="width:60%;margin: auto;margin-top: 250px;">
        <template #header>
            <span style="font-size: 50dp; font-weight: 800; font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif ">公司OA系统登录页面</span>
        </template>
        <el-form
        :label-position="labelPosition"
        label-width="100px"
        style=" width: 80%;margin: auto;"
        >
        <el-form-item label="用户名">
            <el-input v-model="username" clearable />
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="password" type="password" clearable/>
        </el-form-item>
    </el-form>
    <el-button style="margin: auto; margin-top: 10px;" type="primary" round @click="login">登录</el-button>
  <el-alert title="登录失败，用户名或密码错误，请重新输入" type="error" show-icon v-show="alertVisiable" @close="alertVisiable = false"/>
  </el-card>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            username :"",
            password :"",
            alertVisiable:false
        }
    },
    methods:{
        loginIt(){
            this.$emit('update:isLogin',true)
        },
        login(){
            var data = {username:this.username,password:this.password}
            axios.post("/login",data,{headers: {'Content-type':'application/x-www-form-urlencoded'}}).then(
                res=>{
                    var login = res.data
                    if(login){
                        alert("登录成功！！")
                        this.$emit("update:isLogin",true)
                    }else{
                        this.alertVisiable = true
                    }
                }
            )
        }
    }

}
</script>

<style>

</style>