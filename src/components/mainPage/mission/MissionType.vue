<template>
    <el-card>
        <el-table :data="missionTypes" style="width: 100%" @selection-change="handleSelection">
        <el-table-column fixed type="selection" width="55"/>
        <el-table-column prop="missionTypeId" label="序号" width="70" />
        <el-table-column prop="missionTypeTitle" label="标题" width="150" />
        <el-table-column prop="missionTypeContext" label="描述" width="850" />
        <el-table-column fixed ="right" #default="scope">
            <el-button link type="primary" @click="modifyMissionType(scope.$index)">
                <el-icon><Edit /></el-icon>
            </el-button>
        </el-table-column>

        <el-table-column fixed ="right" #default="scope">
            <el-button link type="primary" @click="deleteMissionType(scope.$index)">
                <el-icon><Delete /></el-icon></el-button>
            </el-table-column> 
    </el-table>
    <div id = "dangerDiv" v-if="display">
        <el-button type="danger" id = "dangerButton"  @click="deleteDialogVisible = true"><el-icon><Delete /></el-icon></el-button>
    </div>

    <el-row>
        <el-col :span="24" id="addCol" >
            <el-button circle id = "addButtton" @click="addNewMissionType()" ><el-icon><Plus /></el-icon></el-button>
        </el-col>
    </el-row>

  </el-card>
  <el-dialog 
    v-model="addDailogVisiable"
    width="30%"
    :title="addTitle"
    close="addDailogVisiable = false"
   >
   <el-descriptions 
        direction="vertical"
        :column="1">
        <el-descriptions-item label="标题">
            <el-input v-model="newMissionType.missionTypeTitle" placeholder="标题不为空" clearable />
        </el-descriptions-item>
        <el-descriptions-item label="描述" >
            <el-input v-model="newMissionType.missionTypeContext" placeholder="内容不为空" clearable />
        </el-descriptions-item>
    </el-descriptions>
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
var newMissionTypeTemple = {"missionTypeTitle":"","missionTypeContext":""}
export default {
    data(){
        return {
            missionTypes :[],
            deleteDialogVisible : false,
            deleteMissionTypes: [],
            display : false,
            addDailogVisiable : false,
            newMissionType :{},
            thisMissionType:{},
            addTitle:"",
            modifyMode :false
        }
    },
    created(){
        this.created()
    },
    watch:{
        modifyMode:function(){
            if(this.modifyMode) this.addTitle = this.thisMissionType.missionTypeTitle
            else this.addTitle = "添加"
        }
    },
    methods :{
        created(){
            this.getAllMissionType()
            this.modifyMode = false
        },
        getAllMissionType(){
            axios.post("/missionType/getAllMissionType").then(
                res=> this.missionTypes = res.data
            )
        },
        deleteMissionType(index){
            this.deleteMissionTypes.push(this.missionTypes[index])
            this.deleteDialogVisible = true
        },
        handleSelection(val){
            this.deleteMissionTypes = val
            this.display = this.deleteMissionTypes.length>0
        },
        closeDailog(){
            this.deleteMissionTypes = []
            this.deleteDialogVisible = false
        }
        ,
        summitAdd(){
            axios.post("/missionType/saveMissionType",this.newMissionType).then(
                (res)=>{
                    if(res.data){
                        alert("成功！")
                        this.addDailogVisiable = false
                        this.created()
                    }else{
                        alert("失败")
                    }
                    
                }).catch((e)=>{alert("系统发生错误或资料不按要求填写")})

        },
        addNewMissionType(){
            Object.assign(this.newMissionType,newMissionTypeTemple)
            this.addDailogVisiable= true
        },
        modifyMissionType(index){
            Object.assign(this.newMissionType,this.missionTypes[index])
            this.addDailogVisiable= true
            this.modifyMode = true
        },
        deleteSelection(){
            var dropIds = []
            for(var i = 0;i<this.deleteMissionTypes.length;i++){
                dropIds.push(this.deleteMissionTypes[i].missionTypeId)
            }
            axios.post("/missionType/delMissionTypesByMissionTypeIds",dropIds).then(
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
        }
    }
}
</script>

<style>

</style>