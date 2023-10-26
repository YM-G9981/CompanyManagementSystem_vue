<template>
    <el-card>
          <div class="card-header"  >
                <el-descriptions :title="personal.name" v-if="showMode == 'show'">
                    <el-descriptions-item label="工号">{{ personal.jobNumber }}</el-descriptions-item>
                    <el-descriptions-item label="姓名" >{{ personal.name }}</el-descriptions-item>
                    <el-descriptions-item label="性别">{{ switchSex(personal.sex) }}</el-descriptions-item>
                    <el-descriptions-item label="出生日期" >{{ switchTime(personal.birthday) }}</el-descriptions-item>
                    <el-descriptions-item label="年龄">{{ personal.age}}</el-descriptions-item>
                    <el-descriptions-item label="电话" >{{ personal.phone }}</el-descriptions-item>
                    <el-descriptions-item label="入职日期">{{ switchTime(personal.hireDate) }}</el-descriptions-item>
                    <el-descriptions-item label="身份证号">{{ personal.idnumber }}</el-descriptions-item>
                    <el-descriptions-item label="人员状态">{{ switchState(personal.state) }}</el-descriptions-item>
                    <el-descriptions-item label="部门" >{{ personal.department.departmentName }}</el-descriptions-item>
                    <el-descriptions-item label="直接上级" v-if=" personal.superior!=null">{{ personal.superior.name }}</el-descriptions-item>
                    <el-descriptions-item label="职位">{{ personal.position.positionName }}</el-descriptions-item>
                </el-descriptions>
                <el-descriptions  v-if="showMode == 'modify'">
                <el-descriptions-item label="工号">
                    <el-input v-model="personal.jobNumber" placeholder="工号不为空" clearable />
                </el-descriptions-item>
                <el-descriptions-item label="姓名">
                    <el-input v-model=" personal.name" placeholder="姓名不为空"  clearable />
                </el-descriptions-item>
                <el-descriptions-item label="性别">
                    <el-select class="input" v-model="personal.sex" placeholder="人员性别不为空" >
                    <el-option label="男" value=1 />
                    <el-option label="女" value=2 />
                </el-select>
                </el-descriptions-item>
                <el-descriptions-item class="input" label="出生日期">
                    <el-date-picker
                        class="input" 
                        v-model="personal.birthday"
                        type="date"
                        style="width:100%"
                    />
                </el-descriptions-item>
                <el-descriptions-item label="年龄">
                    <el-input class="input" v-model="personal.age"  placeholder="年龄不为空" clearable disabled/>
                </el-descriptions-item>
                <el-descriptions-item label="电话">
                    <el-input class="input" v-model="personal.phone"  placeholder="电话不为空" clearable />
                </el-descriptions-item>

                <el-descriptions-item label="入职日期">
                <el-date-picker
                    v-model="personal.hireDate"
                    type="date"
                    class="input" 
                    clearable
                    style="width:100%"
                    />
                </el-descriptions-item> 
                <el-descriptions-item label="身份证号">
                    <el-input class="input" v-model="personal.idnumber"  placeholder="身份证不为空" clearable  />
                </el-descriptions-item> 
                <el-descriptions-item label="人员状态">
                    <el-select class="input" v-model="personal.state" >
                        <el-option label="在职" :value=1 />
                        <el-option label="离职" :value=2 />
                        <el-option label="实习生" :value=3 />
                        <el-option label="临时工" :value=4 />
                    </el-select>
                </el-descriptions-item>
            <el-descriptions-item label="部门">
                <el-select
                    v-model="personal.department"
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
                        :key="department"
                        :label="department.departmentName"
                        :value="department"
                    />
                </el-select>
            </el-descriptions-item>

            <el-descriptions-item label="直接上级">
                <el-select
                    v-model="personal.superior"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请选择人员"
                    remote-show-suffix
                    :remote-method="loadPersonals"
                    style="width:100%"
                    clearable
                    @clear="personal.superior=null"
                >
                    <el-option
                        v-for="person in superiors"
                        :key="person.personalId"
                        :label="person.name"
                        :value="person"
                        :disabled="person.personalId==personal.personalId"
                    />
                </el-select>
            </el-descriptions-item>

            <el-descriptions-item label="职位">
                <el-select class="input" v-model="personal.position"  clearable placeholder="请选择职位">
                        <el-option
                            v-for="position in positions"
                            :key="position.positionId"
                            :label="position.positionName"
                            :value="position"
                        />
                    </el-select>
            </el-descriptions-item>
            </el-descriptions>
          </div>
          <div> <el-button type="primary" round @click="confirm()">{{  text }}</el-button></div>
  </el-card> 
  
  </template>
  
  <script>
  import axios from 'axios';
  export default {
      props :{
          showPersonalId : String,
          mode :String,
      },
      data(){
            return{
                personal : {},
                showMode : this.mode,
                departments :[],
                superiors :[],
                positions :[],
                text : ""
          }
      },
      created(){
        this.created()
      },
      watch:{
        showMode:function(){
            if(this.showMode=="modify"){
                this.text= "提交"
            }else{
                this.text = "修改"
            }
        }
    },
      methods :{
        switchTime(time){
            return time.split("T")[0];
        },
        switchSex(sex){
            return sex ==1 ?"男":"女";
        },
        switchState(state){
            switch(state){
                case 1:{
                    return "在职";
                }
                case 2:{
                    return "离职";
                }
                case 3:{
                    return "实习生";
                }
                case 4:{
                    return "临时工";
                }
            }
        },
        getShowPersonal(){
            axios.post("/getPersonal/getPersonalById/"+this.showPersonalId).then(
                (res)=>{
                    this.personal =  res.data[0]
                    this.departments.push(this.personal.department)
                    this.positions.push(this.personal.position)
                    if(this.personal.superior!=null){
                        this.superiors.push(this.personal.superior)
                    }
                }
                )
            
        },
        confirm(){
            if(this.showMode == "show"){
                this.showMode = "modify"
            }else{
                this.personal.department = {"departmentId":this.personal.department.departmentId}
                this.personal.position = {"positionId":this.personal.position.positionId}
                this.personal.superior = {"personalId":this.personal.superior.personalId}
                this.personal
                axios.post("/modifyHrmResource/singleModifyPersonal",this.personal).then(
                (res)=>{
                    if(res.data){
                        alert("修改成功")
                        this.showMode = "show"
                        this.getShowPersonal();
                    }else{
                        alert("修改失败")
                    }
                }
            ).catch(e=>{
                alert("网络错误，请稍后再试")
            })
            }
        },
        created(){
            this.getShowPersonal()
            if(this.showMode=="modify"){
                this.text= "提交"
            }else{
                this.text = "修改"
            }
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
        loadPositions(){
            axios.post("/getPosition/getAllPositions").then(
                (res)=>{
                    this.positions = res.data
                }
            )
        },
        loadPersonals(val){
            if(val ==""){
                axios.post("/getPersonal/getAllPersonals").then(
                (res)=>{
                    this.superiors = res.data
                }
            )
            }else{
                axios.post("/getPersonal/getPersonalLikeName/"+val).then(
                (res)=>{
                    this.superiors =  res.data
                }
                )
            }
        }
    }
  }
  </script>
  <style>
  
  </style>