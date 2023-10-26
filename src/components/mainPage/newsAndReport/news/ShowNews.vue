<template>
  <el-card v-if="showMode=='show'">
      <template #header>
        <div class="card-header"  >
            <el-descriptions :title="showNews.newsTitle" >
                <el-descriptions-item label="新闻创建时间" v-if="showNews.createTime!=null">{{ switchTime(showNews.createTime) }}</el-descriptions-item>
                <el-descriptions-item label="新闻状态"   >{{ switchState(showNews.newsState) }}</el-descriptions-item>
            </el-descriptions>
            <span>{{ showNews.newsDescribe  }}</span>
        </div>
      </template>
        <div>
          <span>
              {{ showNews.newsInformation }}
          </span>
          <el-row v-if="showNews.newsAppendixFiles!=null">
              <el-col  :span="4" v-for="file in showNews.newsAppendixFiles" :key="file">
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
    <el-form-item label="新闻标题">
        <el-input class="input" v-model="showNews.newsTitle" placeholder="标题不为空" clearable />
      </el-form-item>
      <el-form-item label="新闻描述">
          <el-input class="input" v-model="showNews.newsDescribe"  placeholder="描述不为空"  clearable />
      </el-form-item>
      <el-form-item label="新闻主体">
          <el-input
              v-model="showNews.newsInformation"
              :rows="10"
              type="textarea"
              placeholder=""
          />
      </el-form-item>
    </template>
  </el-card>
  <el-card v-if="showMode=='files'">
    <el-card v-for="item in showNews.newsAppendixFiles" :key="item" class="text item" >
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
      multiple
      :on-change="getShowNews"
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
        <el-button type="primary" round @click="showMode = 'modify'"  :disabled="showNews.newsState==2">修改</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="danger" round :disabled="showMode=='files'"  @click="dialogVisible = true">删除</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" :disabled="showNews.newsState==2" @click="fablous()" round>发布</el-button>
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
        <el-button type="primary" :disabled="showNews.newsState==2" @click="showMode='files'" round>附件</el-button>
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
          newsId : String,
          mode :String,
      },
      data(){
          return{
             showNews : "",
             showMode:this.mode,
             dialogVisible :false,
             uploadPath :""
          }
      },
      methods :{
        beforeUpload(file){
          this.uploadPath = "/news/saveNewsAppendixFile/"+this.newsId+"/"+file.name
        },
        fablous(){
          axios.post("/news/publishNews",this.showNews).then(
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
          axios.post("/news/delNewsAppendixFiles/"+id).then(
            (res) => {
              if (res.data) {
                  alert("删除成功")
              }
              else {
                alert("删除失败")
              }
            }
          );
          this.getShowNews()
        },
        deleteNews(){
          var data = [this.showNews.newsId]
            axios.post("/news/delNews",data).then((res) => {
                if (res.data) {
                    alert("删除成功")
                    this.$emit("update:showPage", "newsList");
                }
                else {
                    alert("删除失败")
                }
            }).catch((e) => {
                alert("网络请求错误")
            });
        },
            publishNews(showNews){
            axios.post("/news/publishNews",showNews).then(
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
          getShowNews(){
              axios.post("/news/getNewsByNewsIds",[this.newsId]).then(
              (res) =>{
                  this.showNews = res.data[0]
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
            axios.post("/news/getFile/"+fileId,{
              responseType: 'blob',
            }).then(
              (res)=>{
                  fileDownload(res.data, fileName);
              }
            )
          },
          summit(){
            axios.post("/news/saveNews",this.showNews).then((res) => {
                if (res.data) {
                    alert("修改成功")
                    this.$emit("update:showPage", "newsList");
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
        this.getShowNews()
      },
      watch:{
      }
  }
  </script>
  <style>
  
  </style>  