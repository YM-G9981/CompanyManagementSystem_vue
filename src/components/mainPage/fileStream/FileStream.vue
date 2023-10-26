<template>
    <el-card>
        <FileStreamState v-model:fileStreams="fileStreams"/>
      <el-table :data="fileStreams" style="width: 100%" @selection-change="handleSelection">
      <el-table-column fixed type="selection" width="55"/>
      <el-table-column prop="fileStreamSubject" label="工作流主题" width="150" />
        <el-table-column prop="personal.name" label="发起人" width="150" />
        <el-table-column prop="fileTime" v-if="fileStreams.length!=0" label="发起时间" :formatter="switchTime" width="150" />
      <el-table-column prop="fileContext" label="工作流内容" width="750" />
      <el-table-column prop="index"  :formatter="getIndex" width="150" />
      <el-table-column fixed ="right" #default="scope">
        <el-button link type="primary" @click="deleteFileStream(scope.$index)">
          <el-icon><Delete /></el-icon>
        </el-button>
      </el-table-column>
      <el-table-column fixed ="right" #default="scope">
        <el-button link type="primary" @click="showThisFileStream(scope.$index)">
          <el-icon><Search /></el-icon>
        </el-button>
      </el-table-column>  
  </el-table>
  <div id = "dangerDiv" v-if="display">
      <el-button type="danger" id = "dangerButton"  @click="deleteDialogVisible = true"><el-icon><Delete /></el-icon></el-button>
  </div>
  </el-card>
  <el-dialog 
  v-model="showFileStreamVisible"
  width="800"
  close="showDailogVisiable = false"
  >
    <el-descriptions :title="showFileStream.fileStreamSubject" column="1">
        <el-descriptions-item label="审批内容" >{{ showFileStream.fileContext }}</el-descriptions-item>
        <el-descriptions-item label="发起人" >{{ showFileStream.personal.name }}</el-descriptions-item>
        <el-descriptions-item label="发起时间" >{{ switchTime( showFileStream) }}</el-descriptions-item>
        <el-descriptions-item label="审批状态" >
            <el-table :data="showFileStream.filePersonals" style="width: 100%" >
                <el-table-column prop="index" label="顺序" width="70" />
                <el-table-column prop="personal.name" label="审批人" width="70" />
                <el-table-column prop="pass" label="是否通过" width="150" />
                <el-table-column prop="passDate" label="通过日期" :formatter="switchFileTime" width="150" />
                <el-table-column prop="remarks" label="备注" width="150" />
            </el-table>
        </el-descriptions-item>
        <el-descriptions-item label="附件" >
            <el-row v-if="showFileStream.appendixFiles!=null">
                <el-col  :span="4" v-for="file in showFileStream.appendixFiles" :key="file">
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
        </el-descriptions-item>
    </el-descriptions> 
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
import FileStreamState from './FileStreamState.vue'
  export default {
  components: { FileStreamState },
  data(){
      return {
        fileStreams :[],
        deleteDialogVisible : false,
        deleteFileStreams: [],
        showFileStream:{},
        showFileStreamVisible:false,
        display:false
      }
  },
  created(){
      this.created()
  },
  methods :{
      created(){
          this.getAllFileStream()
      },
      showThisFileStream(index){
        this.showFileStream = this.fileStreams[index] 
        this.showFileStreamVisible = true
      },
      getAllFileStream(){
          axios.post("/fileStream/getAllFileStream").then(
              res=> this.fileStreams = res.data
          ).catch(e=>{
         alert("网络错误，请稍后重试")
      })
      },
      getIndex(row){
         for(var i = 0;i<row.filePersonals.length;i++){
            if(row.index==row.filePersonals[i].index) return row.filePersonals[i].name;
         }
      },
      getFile(fileId,fileName){
          axios.post("/fileStream/getFile/"+fileId,{
            responseType: 'blob',
          }).then(
            (res)=>{
                fileDownload(res.data, fileName);
            }
          ).catch(e=>{
         alert("网络错误，请稍后重试")
      })
      },
      switchFileTime(row){
        return row.passDate.split("T")[0];
      },
      deleteFileStream(index){
          this.deleteFileStreams.push(this.fileStreams[index])
          this.deleteDialogVisible = true
      },
      handleSelection(val){
          this.deleteFileStreams = val
          this.display = this.deleteFileStreams.length>0
      },
      closeDailog(){
          this.deleteFileStreams = []
          this.deleteDialogVisible = false
      },
      switchTime(row){
          return row.fileTime.split("T")[0]
      },
      deleteSelection(){
          var dropIds = []
          for(var i = 0;i<this.deleteFileStreams.length;i++){
              dropIds.push(this.deleteFileStreams[i].mailId)
          }
          axios.post("/fileStream/delFileStream",dropIds).then(
              (res)=>{
                  if(res.data){
                      alert("删除成功")
                      this.deleteDialogVisible =false
                      this.created()
                  }else{
                      alert("删除失败")
                  }
              }
          ).catch(e=>{
         alert("网络错误，请稍后重试")
      })
          
          this.created()
      }
  }
  }
  </script>
  
  <style>
  
  </style>