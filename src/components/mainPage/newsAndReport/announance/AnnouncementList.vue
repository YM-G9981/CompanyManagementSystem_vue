<template>
    <el-card class="box-card">
        <div class="mt-4" style="width :100%">
            <el-row >
                <AnnouncementState v-model:announcements = "announcements" />
            </el-row>
        </div>
    </el-card>
    <el-card>
        <div>
            <el-alert :title="successAlert" type="success" v-show="successAlertShow"/>
            <el-alert :title="errorAlert" type="error" v-show="errorAlertShow"/>
        </div>
        <el-table :data="announcements" style="text-align: center;" max-height="500px" @selection-change="handleSelection">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column prop="announcementId" label="通知序列" width="150"/>
            <el-table-column prop="announcementTitle" label="通知标题" width="150" /> 
            <el-table-column prop="announcementDepartment.departmentName" label="被通知部门" width="150" /> 
            <el-table-column prop="announcementDate" :formatter="switchTime"  label="创建时间" width="150" />
            <el-table-column prop="announcementState" :formatter="switchState" label="通知状态" width="150" />
            <el-table-column fixed="right"  #default="scope"><el-button link type="primary"  :disabled="announcements[scope.$index].announcementState==2" @click="modifyAnnouncement(scope.$index)"><el-icon><Edit /></el-icon></el-button></el-table-column> 
            <el-table-column fixed ="right" #default="scope"><el-button link type="primary" @click="showAnnouncement(scope.$index)"><el-icon><Search /></el-icon></el-button></el-table-column>
            <el-table-column fixed ="right" #default="scope"><el-button link type="primary" @click="deleteAnnouncement(scope.$index)"><el-icon><Delete /></el-icon></el-button></el-table-column>
            <el-table-column fixed ="right"  #default="scope"><el-button link type="primary" :disabled="announcements[scope.$index].announcementState==2" @click="publishAnnouncement(scope.$index)"><el-icon><Tickets /></el-icon></el-button></el-table-column>  
        </el-table>
        <div id ="addDiv">
            <el-button circle id = "addButtton" @click="addAnnouncement"><el-icon><Plus /></el-icon></el-button>
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
import AnnouncementState from './AnnouncementState.vue';
  export default {
    data() {
        return {
            announcements:[],
            display :false,
            dialogVisible :false,
            delAnnouncements:[],
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
            this.delAnnouncements = val;
            this.display = this.delAnnouncements.length > 0;
        },
        modifyAnnouncement(index) {
            var announcementId  = this.announcements[index].announcementId
            this.$emit("update:showPage", "showAnnouncement");
            this.$emit("update:mode", "modify");
            this.$emit("update:announcementId", announcementId);
        },
        publishAnnouncement(index){
           axios.post("/announcement/publishAnnouncement",this.announcements[index]).then(
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
        deleteAnnouncement(index) {
            this.delAnnouncements = this.announcements[index]
            this.dialogVisible = true;
        },
        switchTime(row){
            return row.announcementDate.split("T")[0];
        },
        showAnnouncement(index) {
            var announcementId  = this.announcements[index].announcementId
            this.$emit("update:showPage", "showAnnouncement");
            this.$emit("update:announcementId", announcementId);
            this.$emit("update:mode", "show");
        },
        deleteSelection() {
            var data =[]
            for(var i =0;i<this.delAnnouncements.length;i++){
                data.push(this.delAnnouncements[i].announcementId)
            }
            axios.post("/announcement/delAnnouncements", data).then((res) => {
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
            this.getAllAnnouncements();
            this.delAnnouncementIds = [];
        },
        deleteSelectedSelection() {
            this.delAnnouncementIds = [];
            for (var i = 0; i < this.delAnnouncements.length; i++) {
                var announcement = this.delAnnouncements[i];
                this.delAnnouncementIds.push(announcement.announcementId);
            }
            this.dialogVisible = true;
        },
        created() {
            this.getAllAnnouncements();
        },
        getAllAnnouncements() {
            this.announcements= []
            axios.post("/announcement/getAllAnnouncement").then((res) => this.announcements = res.data);
        },
        switchState(row) {
            switch (row.announcementState) {
                case 1: {
                    return "未发布";
                }
                case 2: {
                    return "已发布";
                }
            }
        },
        addAnnouncement() {
            this.$emit("update:showPage", "addAnnouncement");
        }
    },
    components: { AnnouncementState, AnnouncementState }
}
  </script>
  
  <style>
  
  </style>