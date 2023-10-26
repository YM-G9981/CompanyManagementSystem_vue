<template>
    <el-card>
        <el-table :data="signRules" style="width: 100%" @selection-change="handleSelection">
        <el-table-column fixed type="selection" width="55"/>
        <el-table-column prop="signRuleId" label="序号" width="70" />
        <el-table-column prop="signLongitude" label="签到经度" width="150" />
        <el-table-column prop="signLatitude" label="签到纬度" width="150" />
        <el-table-column prop="signOnTime" label="签到开始时间" width="200" />
        <el-table-column prop="signOffTime" label="签到结束时间" width="200" />
        <el-table-column prop="signRadius" label="签到半径" width="120" />
        <el-table-column fixed ="right" #default="scope">
            <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
                <el-button link type="primary" >
                    <el-icon><Search /></el-icon>
                </el-button>
            </template>
            <el-table :data="signRules[scope.$index].signPersonals" title="规则人员">
                <el-table-column width="150" property="name" label="姓名" />
                <el-table-column width="150" property="jobNumber" label="工号" />
                <el-table-column width="150" property="department.departmentName" label="部门名" />
            </el-table>
      </el-popover>
        </el-table-column>
        <el-table-column fixed ="right" #default="scope">
            <el-button link type="primary" @click="deleteSignRule(scope.$index)">
                <el-icon><Delete /></el-icon></el-button>
            </el-table-column> 
    </el-table>
    <div id = "dangerDiv" v-if="display">
        <el-button type="danger" id = "dangerButton"  @click="deleteDialogVisible = true"><el-icon><Delete /></el-icon></el-button>
    </div>

    <el-row>
        <el-col :span="24" id="addCol" >
            <el-button circle id = "addButtton" @click="addNewSignRule()" ><el-icon><Plus /></el-icon></el-button>
        </el-col>
    </el-row>

  </el-card>
  <el-dialog 
    v-model="addDailogVisiable"
    width="60%"
    title="添加规则"
    close="addDailogVisiable = false"
   >
   <el-descriptions 
        direction="vertical"
        :column="2">
        <el-descriptions-item label="签到开始时间"><el-time-picker v-model="newSignRule.signOnTime" value-format="HH:mm:ss" placeholder="签到开始时间" /></el-descriptions-item>
        <el-descriptions-item label="签到结束时间" ><el-time-picker v-model="newSignRule.signOffTime" value-format="HH:mm:ss" placeholder="签到结束时间" /></el-descriptions-item>
        <el-descriptions-item label="签到经度"><el-input-number v-model="newSignRule.signLongitude" placeholder="签到精度" :precision="6" :step="0.000001" :max="180" :min="-180" /></el-descriptions-item>
        <el-descriptions-item label="签到纬度" ><el-input-number v-model="newSignRule.signLatitude" placeholder="签到纬度" :precision="6" :step="0.000001" :max="90" :min="-90" /></el-descriptions-item>
        <el-descriptions-item label="签到半径" ><el-input-number v-model="newSignRule.signRadius" placeholder="签到半径" :precision="6" :step="0.000001" :max="90" :min="0" /></el-descriptions-item>
    </el-descriptions>
    <el-transfer v-model="newSignRule.signPersonals" :data="personalItems" />
    <template #footer>
        <div >
            <el-button type="primary" @click="summitAdd">
            提交
            </el-button>
        </div>
    </template>
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
            <el-button @click="closeDailog">取消</el-button>
            <el-button type="primary" @click="deleteSelection">确认</el-button>
        </span>
        </template>
    </el-dialog>

</template>

<script>
import axios from 'axios';
var newSignRuleTemple = {"signLatitude":0.000000,"signLongitude":0.000000,"signRadius":0,"signPersonals":[],"signOnTime":"","signOffTime":""}
export default {
    data(){
        return {
            signRules :[],
            deleteDialogVisible : false,
            deleteSignRules: [],
            display : false,
            addDailogVisiable : false,
            newSignRule :{},
            personalItems:[]
        }
    },
    created(){
        this.created()
    },
    methods :{
        created(){
            this.getAllSignRule()
        },
        getAllSignRule(){
            axios.post("/signRule/getAllSignRule").then(
                res=> this.signRules = res.data
            ).catch(e=>{
         alert("网络错误，请稍后重试")
      })
        },
        deleteSignRule(index){
            this.deleteSignRules.push(this.signRules[index])
            this.deleteDialogVisible = true
        },
        handleSelection(val){
            this.deleteSignRules = val
            this.display = this.deleteSignRules.length>0
        },
        closeDailog(){
            this.deleteSignRules = []
            this.deleteDialogVisible = false
        },
        getAllPersonals(){
            var personals = []
            this.personalItems = []
            axios.post("/getPersonal/getAllPersonals").then( (res) => {
               personals = res.data
               for(var i = 0;i<personals.length;i++){
                delete personals[i].department
                this.personalItems.push({
                    key:personals[i],
                    label:personals[i].name,
                    disabled:personals[i].signRule != null
                })
            }
            }).catch(e=>{
         alert("网络错误，请稍后重试")
      });
            
        }
        ,
        summitAdd(){
            axios.post("/signRule/addSignRule",this.newSignRule).then(
                (res)=>{
                    if(res.data){
                        alert("添加成功")
                        this.addDailogVisiable = false
                        this.created()
                    }else{
                        alert("添加失败")
                    }
                    
                }).catch((e)=>{alert("系统发生错误或资料不按要求填写")})

        },
        addNewSignRule(){
            Object.assign(this.newSignRule,newSignRuleTemple)
            this.addDailogVisiable= true
            this.getAllPersonals()
        },
        deleteSelection(){
            var dropIds = []
            for(var i = 0;i<this.deleteSignRules.length;i++){
                dropIds.push(this.deleteSignRules[i].signRuleId)
            }
            axios.post("/signRule/dropSignRules",dropIds).then(
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