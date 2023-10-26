<template>
    <el-card class="box-card">
        <div class="mt-4" style="width :100%">
            <el-row >
                <PersonalState v-model:personals = "personals" />
            </el-row>
        </div>
    </el-card>
    <el-card>
        <div>
            <el-alert :title="successAlert" type="success" v-show="successAlertShow"/>
            <el-alert :title="errorAlert" type="error" v-show="errorAlertShow"/>
        </div>
        <el-table :data="personals" style="text-align: center;" max-height="500px" @selection-change="handleSelection">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column prop="jobNumber" label="工号" width="150"/>
            <el-table-column prop="name" label="姓名" width="150" /> 
            <el-table-column prop="department.departmentName"  label="部门" width="150" />
            <el-table-column prop="state" :formatter="switchState" label="人员状态" width="150" /> 
            <el-table-column prop="user.username"  label="用户名" width="150" /> 
            <el-table-column fixed="right"  #default="scope"><el-button link type="primary" ><el-icon @click="modifyPersonal(scope.$index)"><Edit /></el-icon></el-button></el-table-column> 
            <el-table-column fixed ="right" #default="scope"><el-button link type="primary" @click="showPersonal(scope.$index)"><el-icon><Search /></el-icon></el-button></el-table-column>
            <el-table-column fixed ="right" #default="scope"><el-button link type="primary" @click="deletePersonal(scope.$index)"><el-icon><Delete /></el-icon></el-button></el-table-column> 
            <el-table-column fixed ="right" #default="scope"><el-button link type="primary" @click="addNewUser(scope.$index)"><el-icon><Plus /></el-icon></el-button></el-table-column> 
        </el-table>
        <div id ="addDiv">
            <el-button circle id = "addButtton"   @click="addDailogVisiable = true"><el-icon><Plus /></el-icon></el-button>
        </div>
        <div id ="export" style="margin-top: 30px;">
            <el-button circle id = "exportButtton"   @click="exportPersonal"><el-icon><Folder /></el-icon></el-button>
        </div>
        <div id = "dangerDiv">
            <el-button type="danger" id = "dangerButton"  v-show ="display" @click="deleteSelectedSelection"><el-icon><Delete /></el-icon></el-button>
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
    <el-dialog 
        width="70%"
        v-model="addNewUserDailogVisiable" 
        :before-close="closeDailog"
        center>
        <el-descriptions :column="1">
            <el-descriptions-item label="用户名">
                    <el-input class="input" v-model="addUser.username" placeholder="用户名不为空" clearable />
                </el-descriptions-item>
                <el-descriptions-item label="密码">
                    <el-input class="input" v-model="addUser.password" :rows="3" type="password" placeholder="密码不为空"  clearable />
                </el-descriptions-item>
                <el-descriptions-item label="邮箱">
                    <el-input class="input" v-model="addUser.email" placeholder="邮箱不为空" clearable />
                </el-descriptions-item>
            </el-descriptions>
        <template #footer>
            <span class="dialog-footer">
                <el-row>
                    <el-col :span="12"><el-button type="primary" @click="created()">取消添加</el-button></el-col>
                    <el-col :span="12"><el-button type="primary" @click="confirmAdd()">确认添加</el-button></el-col>
                </el-row>
            </span>
        </template>
    </el-dialog>

    <el-dialog 
        width="30%"
        v-model="addDailogVisiable" 
        :before-close="closeDailog"
        center>
        <span>请选择添加新人员的方式</span>
        <template #footer>
            <span class="dialog-footer">
                <el-row>
                    <el-col :span="12"><el-button type="primary" @click="addNewPersonal(true)">单个添加</el-button></el-col>
                    <el-col :span="12"><el-button type="primary" @click="addNewPersonal(false)">批量添加</el-button></el-col>
                </el-row>
            </span>
        </template>
    </el-dialog>
  </template>
  <script>
  var newUser = {"username":"","password":"","email":"","personal":{}}
import axios from 'axios';
import PersonalState from './PersonalState.vue';

import fileDownload from 'js-file-download';
  export default {
    data() {
        return {
            personals: [],
            display: false,
            delPersonalIds: [],
            delPersonals: [],
            dialogVisible: false,
            successAlertShow: "",
            errorAlertShow: "",
            showAddDailog: false,
            addDailogVisiable: false,
            addNewUserDailogVisiable : false,
            addUser : {}
        }
    },
    created() {
        this.created();
    },
    methods: {
        handleSelection(val) {
            this.delPersonals = val;
            this.display = this.delPersonals.length > 0;
        },
        modifyPersonal(index) {
            var personalId = this.personals[index].personalId;
            this.$emit("update:showPage", "showPersonal");
            this.$emit("update:mode", "modify");
            this.$emit("update:personalId", personalId);
        },
        exportPersonal(){
            axios.get("/exportHrmResource/getPersonalsExcel",{
        responseType: 'blob',
      }).then(
                (res)=>{
                    fileDownload(res.data, '人员导出.xlsx');
                }
            )
        },
        deletePersonal(index) {
            this.delPersonalIds = [this.personals[index].personalId];
            this.dialogVisible = true;
        },
        showPersonal(index) {
            this.$emit("update:showPage", "showPersonal");
            this.$emit("update:personalId", this.personals[index].personalId);
            this.$emit("update:mode", "show");
        },
        deleteSelection() {
            var data = JSON.stringify(this.delPersonalIds);
            axios.post("/dropHrmResource/dropPersonals", data).then((res) => {
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
            this.getAllPersonals();
            this.delPersonalIds = [];
        },
        deleteSelectedSelection() {
            this.delPersonalIds = [];
            for (var i = 0; i < this.delPersonals.length; i++) {
                var personal = this.delPersonals[i];
                this.delPersonalIds.push(personal.personalId);
            }
            this.dialogVisible = true;
        },
        created() {
            this.personals = [];
            this.display = false;
            this.delPersonalIds = [],
                this.delPersonals = [],
                this.dialogVisible = false;
            this.addNewUserDailogVisiable = false;

            this.getAllPersonals();
        },
        getAllPersonals() {
            this.personals=[]
            axios.post("/getPersonal/getAllPersonals").then((res) => this.personals = res.data);
        },
        switchState(row) {
            switch (row.state) {
                case 1: {
                    return "在职";
                }
                case 2: {
                    return "离职";
                }
                case 3: {
                    return "实习生";
                }
                case 4: {
                    return "临时工";
                }
            }
        },
        addNewPersonal(b) {
            this.$emit("update:showPage", "addPersonal");
            if (b) {
                this.$emit("update:mode", "single");
            }
            else {
                this.$emit("update:mode", "batch");
            }
        },
        addNewUser(index){
            Object.assign(newUser,this.addUser)
            this.addNewUserDailogVisiable = true
            this.addUser.personal = {"personalId":this.personals[index].personalId}
        },
        confirmAdd(){
            axios.post("/resignUser/resignFromAdministrator", this.addUser).then((res) => {
                if (res.data) {
                    this.successAlert = "添加成功！";
                    this.successAlertShow = true;
                }
                else {
                    this.errorAlert = "添加失败";
                    this.errorAlertShow = true;
                }
            }).catch((e) => {
                this.errorAlert = "网络请求错误";
                this.errorAlertShow = true;
            });
            this.created()
        }
    },
    components: { PersonalState }
}
  </script>
  
  <style>
  
  </style>