<template>
  <el-card>
    <el-table :data="innerMails" style="width: 100%" @selection-change="handleSelection">
    <el-table-column fixed type="selection" width="55"/>
    <el-table-column prop="mailId" label="序号" width="70" />
    <el-table-column prop="mailTitle" label="邮件主题" width="150" />
    <el-table-column prop="addresser.personal.name" label="邮件发送人" width="200" v-if="innerMails!=null" />
    <el-table-column prop="addressee.personal.name" label="邮件接收人" width="200" v-if="innerMails!=null"/>
    <el-table-column prop="mailState" label="邮件状态" :formatter="switchState" width="200" />
    <el-table-column prop="sendTime" :formatter="switchTime" label="邮件发送时间" width="200" />
    <el-table-column fixed ="right" #default="scope">
      <el-button link type="primary" @click="deleteInnerMail(scope.$index)">
        <el-icon><Delete /></el-icon>
      </el-button>
    </el-table-column>
    <el-table-column fixed ="right" #default="scope">
      <el-button link type="primary" @click="showInnerMail(scope.$index)">
        <el-icon><Search /></el-icon>
      </el-button>
    </el-table-column>  
</el-table>
<div id = "dangerDiv" v-if="display">
    <el-button type="danger" id = "dangerButton"  @click="deleteDialogVisible = true"><el-icon><Delete /></el-icon></el-button>
</div>
</el-card>
<el-dialog 
v-model="showInnerMailVisible"
width="80%"
:title="showInnerMail.subject"
close="showDailogVisiable = false"
>
<template #header>
<el-descriptions :title="innerMail.subject" column="2">
            <el-descriptions-item label="发送人" >{{ innerMail.addresser.personal.name }}</el-descriptions-item>
            <el-descriptions-item label="接收人" >{{ innerMail.addressee.personal.name }}</el-descriptions-item>
            <el-descriptions-item label="邮件状态" >{{ switchState(innerMail) }}</el-descriptions-item>
            <el-descriptions-item label="发送时间" >{{ switchTime(innerMail) }}</el-descriptions-item>
            <el-descriptions-item label="回复邮件" v-if="innerMail.replyFrom!=null" >{{ innerMail.replyFrom.mailTitle }}</el-descriptions-item>
</el-descriptions>
</template>
     <span> {{ innerMail.mailContext }}</span>
<el-row v-if="innerMail.appendixFiles!=null">
    <el-col  :span="4" v-for="file in innerMail.appendixFiles" :key="file">
    <div>
        <div>
        <el-button style="width: 100px; height: 100px;" @click="getFile(file.fileId,file.name)">
        <el-icon style="width: 100px; height: 100px;"><Folder /></el-icon>
        </el-button>
        </div>
        <div>
        <span>{{file.name}}</span>
        </div>
    </div>
    </el-col>
</el-row>    
</el-dialog>

<el-dialog
    v-model="deleteDialogVisible"
    title="删除"
    width="30%"
    :close="closeDailog"
>
<span>确认删除吗</span>
<template #footer>
<span class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="deleteSelection">确认</el-button>
    </span>
    </template>
</el-dialog>
</template>

<script>
import axios from 'axios'
export default {
data(){
    return {
      innerMails :[],
      deleteDialogVisible : false,
      deleteInnerMails: [],
      innerMail:{},
      showInnerMailVisible:false,
    //   display : false
    }
},
created(){
    this.created()
},
methods :{
    created(){
        this.getAllInnerMail()
    },
    showInnerMail(index){
      this.innerMail = this.innerMails[index] 
      this.showInnerMailVisible = true
    },
    getAllInnerMail(){
        axios.post("/innerMail/getAllMails").then(
            res=> this.innerMails = res.data
        )
    },
    switchState(row){
        switch(row.mailState){
            case 1: return "未发送"
            case 2: return "已发送"
        }
    },
    getFile(fileId,fileName){
        axios.post("/innerMail/getFile/"+fileId,{
          responseType: 'blob',
        }).then(
          (res)=>{
              fileDownload(res.data, fileName);
          }
        )
    },
    deleteInnerMail(index){
        this.deleteInnerMails.push(this.innerMails[index])
        this.deleteDialogVisible = true
    },
    handleSelection(val){
        this.deleteInnerMails = val
        this.display = this.deleteInnerMails.length>0
    },
    closeDailog(){
        this.deleteInnerMails = []
        this.deleteDialogVisible = false
    },
    switchTime(row){
        return row.sendTime.split("T")[0]
    },
    deleteSelection(){
        var dropIds = []
        for(var i = 0;i<this.deleteInnerMails.length;i++){
            dropIds.push(this.deleteInnerMails[i].mailId)
        }
        axios.post("/innerMail/dropMails",dropIds).then(
            (res)=>{
                if(res.data){
                    alert("删除成功")
                    this.deleteDialogVisible =false
                    this.created()
                }else{
                    alert("删除失败")
                }
            }
            
        )
        
        this.created()
    }
}
}
</script>

<style>

</style>