<template>
  <el-card>
    <el-table :data="users" style="width: 100%" @selection-change="handleSelection">
        <el-table-column fixed type="selection" width="55"/>
        <el-table-column prop="username" label="用户名" width="200" />
        <el-table-column prop="email" label="电子邮箱" width="200" />
        <el-table-column prop="createTime" label="创建时间"  :formatter="switchTime" width="200" />
        <el-table-column prop="personal.name" label="人员"   width="200" />
        <el-table-column fixed ="right" #default="scope">
            <el-button link type="primary" @click="modifyUser(scope.$index)">
                <el-icon><Edit /></el-icon>
            </el-button>
        </el-table-column>
        <el-table-column fixed ="right" #default="scope">
            <el-button link type="primary" @click="deleteUser(scope.$index)">
                <el-icon><Delete /></el-icon></el-button>
            </el-table-column> 
    </el-table>
    <div id = "dangerDiv">
        <el-button type="danger" id = "dangerButton"  v-show ="display" @click="deleteDialogVisible = true"><el-icon><Delete /></el-icon></el-button>
    </div>
  </el-card> 
  
  <el-dialog 
    v-model="modifyVisible"
    width="30%"
    title="修改用户"
   >
    <el-descriptions 
        direction="vertical"
        :column="1">
        <el-descriptions-item label="用户名"><el-input v-model="selectedUser.username" placeholder="用户名不为空" clearable /></el-descriptions-item>
        <el-descriptions-item label="电子邮箱" ><el-input v-model="selectedUser.email" placeholder="电子邮箱不为空" clearable /></el-descriptions-item>
        <el-descriptions-item label="密码" ><el-input v-model="selectedUser.password" type="password" placeholder="密码不为空" clearable /></el-descriptions-item>
    </el-descriptions>
    <template #footer>
        <span class="dialog-footer">
            <el-button type="primary" @click="summitModify">
            提交
            </el-button>
        </span>
    </template>
  </el-dialog>

  <el-dialog
        v-model="deleteDialogVisible"
        width="30%"
    >
    <span>确认删除吗</span>
    <template #footer>
    <span class="dialog-footer">
            <el-button @click="closeDailog">取消</el-button>
            <el-button type="primary" @click="deleteSelection">确认</el-button>
        </span>
        </template>
    </el-dialog>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return {
            users :[],
            selectedUser :{},
            deleteDialogVisible: false,
            dropUsers:[],
            display : false,
            modifyVisible : false
        }
    },
    methods :{
        modifyUser(index){
            var user = this.users[index]
            Object.assign(this.selectedUser,user)
            this.modifyVisible = true
        },
        switchTime(row){
            return row.createTime.split("T")[0];
        },
        deleteUser(index){
            var user = this.users[index]
            this.dropUsers.push(user)
            this.deleteDialogVisible = true
        },
        handleSelection(val){
            this.dropUsers = val
            this.display = this.dropUsers.length>0
        },
        getAllUsers(){
            this.users =[]
            axios.post("/getUser/getAllUsers").then(
                (res)=>{
                    this.users = res.data
                }
            )
        },
        summitModify(){
            var path = "/resignUser/resignFromAdministrator"
            this.selectedUser.personal = {"personalId":this.selectedUser.personal.personalId}
            axios.post(path,this.selectedUser).then(
                (res)=>{
                    if(res.data){
                        alert("提交成功")
                        this.getAllUsers()
                    }else{
                        alert("提交失败")
                    }
                }
            )
            this.selectedUser = []
        },
        deleteSelection(){
            var dropIds = []
            for(var i = 0;i<this.dropUsers.length;i++){
                dropIds.push(this.dropUsers[i].userId)
            }

            axios.post("/dropHrmResource/dropUsers",dropIds).then(
                (res)=>{
                    if(res.data){
                        alert("删除成功")
                        this.getAllUsers()
                    }else{
                        alert("删除失败")
                    }
                }
                
            )
            dropIds = []
            this.deleteDialogVisible = false
        },
        created(){
           this.getAllUsers()
        },
        closeDailog(){
            this.deleteDialogVisible = false
        }
        
    },
    created (){
        this.created()
    }
}
</script>

<style>

#addCol{
    margin-top: 50px ;
}
</style>