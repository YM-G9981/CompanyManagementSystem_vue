<template>
      <el-card>
        <el-table :data="outerMails" style="width: 100%" @selection-change="handleSelection">
        <el-table-column fixed type="selection" width="55"/>
        <el-table-column prop="mailId" label="序号" width="70" />
        <el-table-column prop="subject" label="邮件主题" width="150" />
        <el-table-column prop="sendTo" label="邮件收件邮箱" width="150" />
        <el-table-column prop="user.personal.name" label="邮件发送人" width="200" />
        <el-table-column prop="state" label="邮件状态" :formatter="switchState" width="200" />
        <el-table-column prop="sendTime" :formatter="switchTime" label="邮件发送时间" width="200" />
        <el-table-column fixed ="right" #default="scope">
          <el-button link type="primary" @click="deleteOuterMail(scope.$index)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </el-table-column>
        <el-table-column fixed ="right" #default="scope">
          <el-button link type="primary" @click="showOuterMail(scope.$index)">
            <el-icon><Search /></el-icon>
          </el-button>
        </el-table-column>  
    </el-table>
    <div id = "dangerDiv" v-if="display">
        <el-button type="danger" id = "dangerButton"  @click="deleteDialogVisible = true"><el-icon><Delete /></el-icon></el-button>
    </div>
  </el-card>
  <el-dialog 
    v-model="showOuterMailVisible"
    width="80%"
    :title="showOuterMail.subject"
    close="showDailogVisiable = false"
   >
   <template #header>
    <el-descriptions :title="outerMail.subject" column="2">
                <el-descriptions-item label="发送人" v-if="outerMail!=null">{{ outerMail.user.personal.name }}</el-descriptions-item>
                <el-descriptions-item label="接收人"   >{{ outerMail.sendTo }}</el-descriptions-item>
                <el-descriptions-item label="邮件状态"   >{{ switchState(outerMail) }}</el-descriptions-item>
                <el-descriptions-item label="发送时间"   >{{ switchTime(outerMail) }}</el-descriptions-item>
    </el-descriptions>
    </template>
         <span> {{ outerMail.text }}</span>
    <el-row v-if="outerMail.appendixFiles!=null">
        <el-col  :span="4" v-for="file in outerMail.appendixFiles" :key="file">
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
          outerMails :[],
          deleteDialogVisible : false,
          deleteOuterMails: [],
          outerMail:{},
          showOuterMailVisible:false,
          display:false
        }
    },
    created(){
        this.created()
    },
    methods :{
        created(){
            this.getAllOuterMail()
        },
        showOuterMail(index){
          this.outerMail = this.outerMails[index] 
          this.showOuterMailVisible = true
        },
        getAllOuterMail(){
            axios.post("/outerMail/getAllMails").then(
                res=> this.outerMails = res.data
            )
        },
        switchState(row){
            switch(row.mailState){
                case 1: return "未发送"
                case 2: return "已发送"
            }
        },
        getFile(fileId,fileName){
            axios.post("/outerMail/getFile/"+fileId,{
              responseType: 'blob',
            }).then(
              (res)=>{
                  fileDownload(res.data, fileName);
              }
            )
        },
        deleteOuterMail(index){
            this.deleteOuterMails.push(this.outerMails[index])
            this.deleteDialogVisible = true
        },
        handleSelection(val){
            this.deleteOuterMails = val
            this.display = this.deleteOuterMails.length>0
        },
        closeDailog(){
            this.deleteOuterMails = []
            this.deleteDialogVisible = false
        },
        switchTime(row){
            return row.sendTime.split("T")[0]
        },
        deleteSelection(){
            var dropIds = []
            for(var i = 0;i<this.deleteOuterMails.length;i++){
                dropIds.push(this.deleteOuterMails[i].mailId)
            }
            axios.post("/outerMail/delMail",dropIds).then(
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