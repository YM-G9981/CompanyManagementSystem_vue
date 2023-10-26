<template>
    <el-card class="box-card">
        <div class="mt-4" style="width :100%">
            <el-row >
                <NewsState v-model:news = "news" />
            </el-row>
        </div>
    </el-card>
    <el-card>
        <div>
            <el-alert :title="successAlert" type="success" v-show="successAlertShow"/>
            <el-alert :title="errorAlert" type="error" v-show="errorAlertShow"/>
        </div>
        <el-table :data="news" style="text-align: center;" max-height="500px" @selection-change="handleSelection">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column prop="newsId" label="新闻序列" width="150"/>
            <el-table-column prop="newsTitle" label="新闻标题" width="150" /> 
            <el-table-column prop="createTime" :formatter="switchTime"  label="创建时间" width="150" />
            <el-table-column prop="newsState" :formatter="switchState" label="新闻状态" width="150" />
            <el-table-column fixed="right"  #default="scope" label="新闻描述">
            <el-popover
                placement="left"
                :width="200"
                trigger="hover"
                :content="news[scope.$index].newsDescribe"
                >
                <template #reference>
                    <el-button class="m-2"  link type="primary">
                        <el-icon><Reading /></el-icon>
                    </el-button>
                </template>
            </el-popover>    
            </el-table-column> 



            <el-table-column fixed="right"  #default="scope"><el-button link type="primary"  :disabled="news[scope.$index].newsState==2" @click="modifyNews(scope.$index)"><el-icon><Edit /></el-icon></el-button></el-table-column> 
            <el-table-column fixed ="right" #default="scope"><el-button link type="primary" @click="showNews(scope.$index)"><el-icon><Search /></el-icon></el-button></el-table-column>
            <el-table-column fixed ="right" #default="scope"><el-button link type="primary" @click="deleteNews(scope.$index)"><el-icon><Delete /></el-icon></el-button></el-table-column>
            <el-table-column fixed ="right"  #default="scope"><el-button link type="primary" :disabled="news[scope.$index].newsState==2" @click="publishNews(scope.$index)"><el-icon><Tickets /></el-icon></el-button></el-table-column>  
        </el-table>
        <div id ="addDiv">
            <el-button circle id = "addButtton" @click="addNews"><el-icon><Plus /></el-icon></el-button>
        </div>
        <div id = "dangerDiv">
            <el-button type="danger" id = "dangerButton"  v-show ="display" @click="dialogVisible = true"><el-icon><Delete /></el-icon></el-button>
        </div>
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
            <el-button type="primary" @click="deleteSelection">确认</el-button>
        </span>
        </template>
    </el-dialog>
</template>
  <script>
import axios from 'axios';
import NewsState from './NewsState.vue';
  export default {
    data() {
        return {
            news:[],
            display :false,
            dialogVisible :false,
            delNewss:[],
            errorAlertShow:false,
            successAlertShow:false,
            successAlert:"",
            errorAlert:""
        }
    },
    created() {
        this.created();
    },
    methods: {
        handleSelection(val) {
            this.delNewss = val;
            this.display = this.delNewss.length > 0;
        },
        modifyNews(index) {
            var newsId  = this.news[index].newsId
            this.$emit("update:showPage", "showNews");
            this.$emit("update:mode", "modify");
            this.$emit("update:newsId", newsId);
        },
        publishNews(index){
           axios.post("/news/publishNews",this.news[index]).then(
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
        deleteNews(index) {
            this.delNewss = [this.news[index]]
            this.dialogVisible = true;
        },
        switchTime(row){
            return row.createTime.split("T")[0];
        },
        showNews(index) {
            var newsId  = this.news[index].newsId
            this.$emit("update:showPage", "showNews");
            this.$emit("update:newsId", newsId);
            this.$emit("update:mode", "show");
        },
        deleteSelection() {
            var data =[]
            for(var i =0;i<this.delNewss.length;i++){
                data.push(this.delNewss[i].newsId)
            }
            axios.post("/news/delNews", data).then((res) => {
                if (res.data) {
                    this.successAlert = "删除成功！";
                    this.successAlertShow = true;
                }
                else {
                    this.errorAlert = "删除失败";
                    this.errorAlertShow = true;
                }
            }).catch((e) => {
                this.errorAlert = "网络请求错误";
                this.errorAlertShow = true;
            });
            this.dialogVisible = false;
            this.getAllNewss();
            this.delNewsIds = [];
        },
        deleteSelectedSelection() {
            this.delNewsIds = [];
            for (var i = 0; i < this.delNewss.length; i++) {
                var news = this.delNewss[i];
                this.delNewsIds.push(news.newsId);
            }
            this.dialogVisible = true;
        },
        created() {
            this.getAllNewss();
        },
        getAllNewss() {
            this.news= []
            axios.post("/news/getAllNews").then((res) => this.news = res.data);
        },
        switchState(row) {
            switch (row.newsState) {
                case 1: {
                    return "未发布";
                }
                case 2: {
                    return "已发布";
                }
            }
        },
        addNews() {
            this.$emit("update:showPage", "addNews");
        }
    },
    components: { NewsState, NewsState }
}
  </script>
  
  <style>
  
  </style>