<template>
  <el-card v-if="showMode=='show'">
      <template #header>
        <div class="card-header"  >
            <el-descriptions :title="showAnnouncement.announcementTitle" >
                <el-descriptions-item label="通知创建时间" v-if="showAnnouncement.announcementDate!=null">{{ switchTime(showAnnouncement.announcementDate) }}</el-descriptions-item>
                <el-descriptions-item label="通知状态"   >{{ switchState(showAnnouncement.announcementState) }}</el-descriptions-item>
                <el-descriptions-item label="被通知部门"  v-if="showAnnouncement.announcementDepartment!=null" >{{ showAnnouncement.announcementDepartment.departmentName }}</el-descriptions-item>
            </el-descriptions>
        </div>
      </template>
        <div>
          <span>
              {{ showAnnouncement.announcementContext }}
          </span>
          <el-row v-if="showAnnouncement.announcementAppendixFiles!=null">
              <el-col  :span="4" v-for="file in showAnnouncement.announcementAppendixFiles" :key="file">
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
        </div>
  </el-card>

  <el-card v-if="showMode=='modify'">
    <template  #header >
    <el-form-item label="通知标题">
                <el-input class="input" v-model="showAnnouncement.announcementTitle" placeholder="通知标题不为空" clearable />
            </el-form-item>
            <el-form-item label="被通知部门">
                <el-select
                  v-model="showAnnouncement.announcementDepartment"
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
                    v-model="showAnnouncement.announcementContext"
                    :rows="10"
                    type="textarea"
                />
            </el-form-item>
    </template>
  </el-card> 
  <el-card v-if="showMode=='files'">
    <el-card v-for="item in showAnnouncement.announcementAppendixFiles" :key="item" class="text item" >
      <el-row>
        <el-col :span="2">
          <el-icon>
            <Folder/>
          </el-icon>
        </el-col>
        <el-col :span="16">
          <span>{{ item.name }}</span>
        </el-col>
        <el-col :span="6">
      <el-button type="danger" round @click="deleteFiles(item.fileId)" >删除</el-button></el-col>
      </el-row>
    </el-card>
    <el-upload
      class="upload-demo"
      drag
      :before-upload="beforeUpload"
      :action="uploadPath"
      :on-change="getShowAnnouncement"
      multiple
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        拖拽上传或<em>点击上传</em>
      </div>
    </el-upload>
  </el-card>
  <el-card style="margin-top: 15px;" >
    <el-row v-show="showMode!='modify'">
      <el-col :span="6">
        <el-button type="primary" round @click="showMode = 'modify'"  :disabled="showAnnouncement.announcementState==2">修改</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="danger" round :disabled="showMode=='files'"  @click="dialogVisible = true">删除</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" :disabled="showAnnouncement.announcementState==2" @click="fablous()" round>发布</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="showMode='files'" round>附件</el-button>
      </el-col>
    </el-row>
    <el-row v-show="showMode=='modify'">
      <el-col :span="12">
        <el-button type="primary" round @click="summit()">提交</el-button>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" @click="showMode='files'" round>附件</el-button>
      </el-col>
    </el-row>
  </el-card>
  <el-dialog
        v-model="dialogVisible"
        title="Tips"
        width="30%"
    >
    <span>确认删除吗</span>
    <template #footer>
    <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="deleteNews()">确认</el-button>
        </span>
        </template>
    </el-dialog>
  </template>
  
  <script>
  import axios from 'axios';

import fileDownload from 'js-file-download';
  export default {
      props :{
          announcementId : String,
          mode :String,
      },
      data(){
          return{
             showAnnouncement : "",
             showMode:this.mode,
             dialogVisible :false,
             uploadPath :"",
             departments:[]
          }
      },
      methods :{
        beforeUpload(file){
          this.uploadPath = "/announcement/saveAnnouncementAppendixFile/"+this.announcementId+"/"+file.name
        },
        fablous(){
          axios.post("/announcement/publishAnnounance",this.showAnnouncement).then(
                (res) => {
                if (res.data) {
                    alert("发布成功")
                }
                else {
                  alert("发布失败")
                }
            }).catch((e) => {
                alert("网络请求错误")
            }); 

        },
        deleteFiles(id){
          axios.post("/announcement/delAnnouncementAppendixFile/"+id).then(
            (res) => {
              if (res.data) {
                  alert("删除成功")
              }
              else {
                alert("删除失败")
              }
            }
          );
          this.getShowAnnouncement()
        },
        deleteNews(){
          var data = [this.showAnnouncement.announcementId]
            axios.post("/announcement/delAnnouncements",data).then((res) => {
                if (res.data) {
                    alert("删除成功")
                    this.$emit("update:showPage", "announcementList");
                }
                else {
                    alert("删除失败")
                }
            }).catch((e) => {
                alert("网络请求错误")
            });
        },
            publishNews(showAnnouncement){
            axios.post("/announcement/publishAnnouncement",showAnnouncement).then(
                (res) => {
                if (res.data) {
                    this.successAlert = "发布成功！";
                    this.successAlertShow = true;
                }
                else {
                    this.errorAlert = "发布失败";
                    this.errorAlertShow = true;
                }
            }).catch((e) => {
                this.errorAlert = "网络请求错误";
                this.errorAlertShow = true;
            });
            this.created()
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
          getShowAnnouncement(){
              axios.post("/announcement/getAnnouncementsByAnnouncementIds",[this.announcementId]).then(
              (res) =>{
                  this.showAnnouncement = res.data[0]
              })
          }
          ,switchState (row){
              switch(row){
                  case 1: return "未发布"
                  case 2: return "已发布"
                  
              }
          }
          ,switchTime(time){
              return time.split("T")[0];
          },
          getFile(fileId,fileName){
            axios.post("/announcement/getFile/"+fileId,{
              responseType: 'blob',
            }).then(
              (res)=>{
                  fileDownload(res.data, fileName);
              }
            )
          },
          summit(){
            axios.post("/announcement/saveAnnouncement",this.showAnnouncement).then((res) => {
                if (res.data) {
                    alert("修改成功")
                    this.$emit("update:showPage", "announcementList");
                }
                else {
                    alert("删除失败")
                }
            }).catch((e) => {
                alert("网络请求错误")
            });
          }
        },
      created(){
        this.getShowAnnouncement()
        this.loadDepartments("")
      },
      watch:{
      }
  }
  </script>
  <style>
  
  </style>  