<template>
  <el-card>
    <el-table :data="positions" style="width: 100%" @selection-change="handleSelection">
        <el-table-column fixed type="selection" width="55"/>
        <el-table-column prop="positionName" label="职位名称" width="550" />
        <el-table-column prop="positionDescribe" label="职位描述" width="550" />
        <el-table-column fixed ="right" #default="scope">
            <el-button link type="primary" @click="modifyPosition(scope.$index)">
                <el-icon><Edit /></el-icon>
            </el-button>
        </el-table-column>
        <el-table-column fixed ="right" #default="scope">
            <el-button link type="primary" @click="deletePosition(scope.$index)">
                <el-icon><Delete /></el-icon></el-button>
            </el-table-column> 
    </el-table>
    <div id = "dangerDiv">
        <el-button type="danger" id = "dangerButton"  v-show ="display" @click="deleteDialogVisible = true"><el-icon><Delete /></el-icon></el-button>
    </div>

    <el-row>
        <el-col :span="24" id="addCol" >
            <el-button circle id = "addButtton"   @click="selctAddNewPositionMode"><el-icon><Plus /></el-icon></el-button>
        </el-col>
    </el-row>
  </el-card> 
  <el-dialog 
    v-model="positionDialogVisible"
    width="30%"
    :title="dailogTitle"
    :close="closeDailog"
   >
    <el-descriptions 
        direction="vertical"
        :column="1">
        <el-descriptions-item label="职位名称"><el-input v-model="selectedPosition.positionName" placeholder="职位名称不为空" clearable /></el-descriptions-item>
        <el-descriptions-item label="职位描述" ><el-input v-model="selectedPosition.positionDescribe" placeholder="职位描述不为空" clearable /></el-descriptions-item>
    </el-descriptions>
    <template #footer>
        <span class="dialog-footer">
            <el-button type="primary" @click="summitModify">
            提交
            </el-button>
        </span>
    </template>
  </el-dialog>
  <el-dialog
        v-model="deleteDialogVisible"
        title="Tips"
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

    <el-dialog
        v-model="importVisible"
        width="30%"
        :close="closeDailog"
        center
    >
    <span>请选择添加职位的方式</span>
        <template #footer>
            <el-row>
               <el-col :span="12"><el-button type="primary" @click="addNewPosition">单个导入</el-button></el-col> 
               <el-col :span="12"><el-button type="primary" @click="batchImportVisible =true">全部导入</el-button></el-col> 
            </el-row>
        </template>
    </el-dialog>

    <el-dialog
        v-model="batchImportVisible"
        title="批量导入"
        width="30%"
        :close="closeDailog"
    >
            <el-row>
               <el-col :span="24"><el-button type="primary" @click="download">下载导入模板</el-button></el-col> 
            </el-row>
            <el-upload
                v-model:file-list="fileList"
                class="upload-demo"
                action="/importHrmResource/batchImportDepartments"
                multiple
                :limit="1"
                style="margin-top: 30px"
                accept=".xlsx"
                :auto-upload="false"
                drag 
            >
            <el-button type="primary" >选择文件</el-button>
            <template #tip>
                <div class="el-upload__tip">
                请上传xlsx文件或拖拽上传
                </div>
            </template>
            </el-upload>
            <el-button class="ml-3" type="success" @click="submitUpload">
                    上传至服务器
                    </el-button>
    </el-dialog>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return {
            positions :[],
            selectedPosition :{},
            positionDialogVisible : false,
            selectMode : "",
            deleteDialogVisible: false,
            dropPositions:[],
            display : false,
            importVisible : false,
            batchImportVisible :false,
            dailogTitle :""
        }
    },
    methods :{
        modifyPosition(index){
            var position = this.positions[index]
            Object.assign(this.selectedPosition,position)
            this.positionDialogVisible = true
            this.selectMode= "modify"
            this.dailogTitle = "修改职位"
        },
        deletePosition(index){
            
            var position = this.positions[index]
            this.dropPositions.push(position.positionId)
            this.positionDialogVisible = true
        },
        handleSelection(val){
            this.dropPositions = val
            this.display = this.dropPositions.length>0
        },
        getAllPositions(){
            this.positions =[]
            axios.post("/getPosition/getAllPositions").then(
                (res)=>{
                    this.positions = res.data
                }
            )
        },
        summitModify(){
            var path ="";
            if(this.selectMode=="modify"){
                path = "/modifyHrmResource/singleModifyPosition"
            }else{
                path = "/importHrmResource/singleImportPosition"
            }
            axios.post(path,this.selectedPosition).then(
                (res)=>{
                    if(res.data){
                        alert("提交成功")
                        this.getAllPositions()
                    }else{
                        alert("提交失败")
                    }
                }
            )
            this.created()
        },
        deleteSelection(){
            var dropIds = []
            for(var i = 0;i<this.dropPositions.length;i++){
                dropIds.push(this.dropPositions[i].positionId)
            }
            axios.post("/dropHrmResource/dropPositions",dropIds).then(
                (res)=>{
                    if(res.data){
                        alert("删除成功")
                        this.getAllPositions()
                    }else{
                        alert("删除失败")
                    }
                }
                
            )
            this.created()
        },
        closeDailog(){
            this.positionDialogVisible = false;
            this.deleteDialogVisible = false;
        },
        selctAddNewPositionMode(){
            this.importVisible = true
        },
        batchImportPosition(){
            this.importVisible = false
            this.batchImportVisible = true
        },
        addNewPosition(){
            this.selectedPosition = {'positionName': '', 'positionDescribe': '' }
            this.positionDialogVisible = true
            this.selectMode = "add"
            this.dailogTitle ="单个导入"
        },
        created(){
           this.getAllPositions()
        this.dropPositions = []
        this.deleteDialogVisible = false
        this.positionDialogVisible = false 
        },
        download(){
            axios.get("/importHrmResource/batchImportPositionsTemple",{
                responseType: 'blob',
            }).then(
                (res)=>{
                    fileDownload(res.data, '职位导入模板.xlsx');
                }
            )
        }
    },
    created (){
        this.created()
    }
}
</script>

<style>

#addCol{
    margin-top: 50px ;
}
</style>