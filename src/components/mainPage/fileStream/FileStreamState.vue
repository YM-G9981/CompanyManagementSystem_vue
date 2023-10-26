<template>
    <el-row>
        <el-col :span="4">
            <el-select v-model="selectState" placeholder="请选择内容" 
                @change="handleChange()">
                <el-option label="发起人员" value="personal" />
                <el-option label="主题" value="subject" />
                <el-option label="审核人员" value="bepersonal" />
            </el-select>
        </el-col>
        
        <el-col :span="18">
            <div 
                v-show="selectState !='subject'&&selectState!=''">
                <el-select 
                    v-model="value"
                    filterable
                    remote
                    reserve-keyword
                    remote-show-suffix
                    :remote-method="loadPersonals"
                    style="width:100%"
                    placeholder="请选择人员"
                    >
                    <el-option
                        v-for="personal in personals"
                        :key="personal.personalId"
                        :label="personal.name"
                        :value="personal.personalId"
                    />
                </el-select>
            </div>
            <div 
                v-show="selectState == 'subject'">
                <el-input
                    v-model="value"
                    placeholder="请输入主题"
                   >
                </el-input>
            </div>
        </el-col>
        <el-col :span="2" >
            <el-button type="primary" circle :disabled="disabled" @click="getStream()" v-if="selectState !=''">
                <el-icon>
                    <Search/>
                </el-icon>
            </el-button>
        </el-col>
</el-row>
</template>

<script>

import axios from 'axios'
import { watch } from '@vue/runtime-core'
export default {
props:{
},
data(){
    return {
        value : "",
        disabled : true,
        selectState :"",
        departments :[],
        positions:[],
        personals:[],
        signs:[],
        date :[new Date(),new Date()]
        }
    },
    created(){
        this.created()
    },
    methods :{
        saveValue(){
            if(this.value == ""){
                this.disabled = true
            }else{
                this.disabled = false
            }
        },
        created(){
            this.loadPersonals()
        }
        ,handleChange(){
            this.value = ""
        },
        loadPersonals(val){
            if(val == ""){
                axios.post("/getPersonal/getAllPersonals").then(
                    (res)=>{
                        this.personals =  res.data
                    }
                ).catch(e=>{
         alert("网络错误，请稍后重试")
      })
            }
            else{
                axios.post("/getPersonal/getPersonalLikeName/"+val).then(
                    (res)=>{
                        this.personals =  res.data
                    }
                ).catch(e=>{
         alert("网络错误，请稍后重试")
      })
            }
        },
        getStream(){
            var path = "/fileStream"
            switch(this.selectState){
                case "personal":{
                    path = path + "/getFileStreamsByPersonal/" + this.value
                    break
                }
                case "subject":{
                    path = path + "/getFileStreamsBySubject/" + this.value
                    break
                }
                case "bepersonal":{
                    path = path + "/getFileStreamsByPersonalList/"+ this.value
                    break
                }
            }
            axios.post(path).then(
                (res)=>{
                    this.$.emit("update:fileStreams",res.data)
                }
            ).catch(e=>{
         alert("网络错误，请稍后重试")
      })
        }
    },
    watch:{
        value :function(){
            if(this.value == "") {
                this.disabled= true
            }else{
                this.disabled = false
            }
        }
    }
}
</script>

<style>

</style>