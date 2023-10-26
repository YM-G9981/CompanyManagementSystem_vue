<template>
    <el-card>
        <el-form :model="newAnnouncement" label-width="120px" style="width: 70%; margin: auto; margin-top: 30px;" > 
            <el-form-item label="通知标题">
                <el-input class="input" v-model="newAnnouncement.announcementTitle" placeholder="通知标题不为空" clearable />
            </el-form-item>
            <el-form-item label="被通知部门">
                <el-select
                v-model="newAnnouncement.announcementDepartment"
                filterable
                remote
                reserve-keyword
                placeholder="请选择部门"
                remote-show-suffix
                :remote-method="loadDepartments"
                style="width:100%"
                >
                    <el-option
                        v-for="department in departments"
                        :key="department.departmentId"
                        :label="department.departmentName"
                        :value="department"
                    />
            </el-select>

            </el-form-item>
            <el-form-item label="通知内容">
                <el-input
                    v-model="newAnnouncement.announcementContext"
                    :rows="10"
                    type="textarea"
                />
            </el-form-item>
        </el-form>
        <div>
        <el-row>
                <el-col :span="12"><el-button type="primary" round @click="saveAnnouncement">保存</el-button></el-col>
                <el-col :span="12"><el-button type="primary" round @click="publishAnnouncement">发布</el-button></el-col>
            </el-row>
            </div>
        <span>需要附件请保存再修改添加图片</span>
    </el-card>
</template>
<script>
import axios from 'axios'
export default {
    data(){
        return{
            newAnnouncement:{"announcementTitle":"","announcementDepartment":"","announcementContext":"","announcementDate":new Date()},
            departments:[]
        }
    },
    created(){
        this.created()
    },
    methods:{
        created() {
            this.loadDepartments("")
        },
        loadDepartments(val){
            if(val ==""){
                axios.post("/getDepartment/getAllDepartments").then(
                (res)=>{
                    this.departments =  res.data
                }
            )
            }else{
                axios.post("/getDepartment/getDepartmentsByDepartmentNameLike/"+val).then(
                (res)=>{
                    this.departments =  res.data
                }
            )
            }
        },
        publishAnnouncement(){
            axios.post("/announcement/publishAnnouncement",this.newAnnouncement).then(
                res=>{
                    if(res.data){
                        alert("发布成功")
                    }else{
                        alert("发布失败")
                    }
                }
            )
        },
        saveAnnouncement(){
            axios.post("/announcement/saveAnnouncement",this.newAnnouncement).then(
                res=>{
                    if(res.data){
                        alert("保存成功")
                    }else{
                        alert("保存失败")
                    }
                }
            )
        },
    }
}
</script>

<style>

</style>