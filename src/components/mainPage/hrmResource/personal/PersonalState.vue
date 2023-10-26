<template>
    <el-col :span="8">
        <el-select v-model="selectState" placeholder="请选择内容" 
            @change="handleChange()">
            <el-option selected label="姓名" value="name" />
            <el-option label="工号" value="jobNumber" />
            <el-option label="性别" value="sex" />
            <el-option label="出生日期" value="birthday" />
            <el-option label="年龄" value="age" />
            <el-option label="电话" value="phone" />
            <el-option label="入职日期" value="hireDate" />
            <el-option label="身份证号" value="IDNumber" />
            <el-option label="人员状态" value="state" />
            <el-option label="部门" value="department" />
            <el-option label="职位" value="position" />
        </el-select>
    </el-col>
    <el-col :span="14">
        <div
            v-show="selectState == 'name'">
            <el-input
                v-model="value"
                placeholder="请输入姓名"
                @change="saveValue()">
            </el-input>
        </div>
        <div 
            v-show="selectState == 'jobNumber'">
            <el-input
                v-model="value"
                placeholder="请输入工号"
                @change="saveValue()">
            </el-input>
        </div>
        <div 
            v-show="selectState == 'sex'">
            <el-select v-model="value" placeholder="请选择性别" @change="saveValue()">
                <el-option label="男" value=1 />
                <el-option label="女" value=2 />
            </el-select>
        </div>
        
        <div
            v-show="selectState == 'birthday'">
            <el-date-picker
                v-model="value"
                type="datetimerange"
                range-separator="到"
                start-placeholder="生日开始时间"
                end-placeholder="生日结束时间"
                @change="saveValue()"
                />
        </div>
        <div
            v-show="selectState == 'age'" >
            <el-row>
                <el-col :span="11"><el-input-number v-model="minAge" :min="1" :max="maxAge" @change="saveValue()" /></el-col>
                <el-col :span="2">至</el-col>
                <el-col :span="11"><el-input-number v-model="maxAge" :min="minAge" :max="100" @change="saveValue()" /></el-col>
            </el-row>
            
            
        </div>
        <div 
            v-show="selectState == 'phone'">
            <el-input
                v-model="value"
                placeholder="请输入电话"
                @change="saveValue()">
            </el-input>
        </div>
        <div
            v-show="selectState == 'hireDate'">
            <el-date-picker
                v-model="value"
                type="datetimerange"
                range-separator="到"
                start-placeholder="入职开始时间"
                end-placeholder="入职结束时间"
                @change="saveValue"
                />
        </div>
        <div 
            v-show="selectState == 'IDNumber'">
            <el-input
                v-model="value"
                placeholder="请输入身份证"
                @change="saveValue()">
            </el-input>
        </div>
        <div 
            v-show="selectState == 'state'">
            <el-select v-model="value" placeholder="请选择人员状态" @change="saveValue()">
                <el-option label="在职" :value=1 />
                <el-option label="离职" :value=2 />
                <el-option label="实习生" :value=3 />
                <el-option label="临时工" :value=4 />
            </el-select>
        </div>
        <div 
            v-show="selectState == 'department'">
            <el-select
                v-model="value"
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
                        :value="department.departmentId"
                    />
                </el-select>
                </div>
        <div 
            v-show="selectState == 'position'">
            <el-select 
                class="input" 
                v-model="value"  
                clearable 
                placeholder="请选择职位">
                <el-option
                    v-for="position in positions"
                    :key="position.positionId"
                    :label="position.positionName"
                    :value="position.positionId"
                />
            </el-select>
        </div>
    </el-col>
    <el-col :span="2" v-show="selectState != ''">
        <el-button type="primary" :disabled="disabled" circle @click="getPersonals()  ">
            <el-icon>
                <Search/>
            </el-icon>
        </el-button>
    </el-col>
</template>

<script>
import axios from 'axios'
export default {
    data (){
        return{
            selectState :"",
            value :"",
            minAge:0,
            maxAge:100,
            disabled :true,
            departments:[],
            positions:[]
        }
    },
    created(){
        this.created()
    },
    methods :{
        created(){
            this.loadDepartments("")
            this.loadPositions("")
        }
        ,
        saveValue(){
            if(this.value == ""){
                this.disabled = true
            }else{
                this.disabled = false
            }
        },
        handleChange(){
            this.value = ""
            this.disabled = true
            if(this.selectState == "age"){
                this.disabled = false
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
        getPersonals(){
            var path  = "/getPersonal"
            switch(this.selectState){
                case "name":{
                    path = path + "/getPersonalLikeName/"+this.value
                    break
                }
                case "jobNumber":{
                    path = path + "/getPersonalLikeJobNumber/"+this.value 
                    break
                }
                case "sex":{
                    path = path + "/getPersonalBySex/"+this.value 
                    break
                }
                case "birthday":{
                    path = path + "/getPersonalByBirthday/"+this.value
                    break
                }
                case "phone":{
                    path = path + "/getPersonalLikePhone/"+this.value
                    break
                }
                case "hireDate":{
                    path = path + "/getPersonalByHireDate/"+this.value
                    break

                }
                case "age":{
                    path = path + "/getPersonalByAge/"+this.minAge+"/"+this.maxAge;
                    break
                }
                case "IDNumber":{
                    path = path + "/getPersonalLikeIDNumber/"+this.value
                    break

                }
                case "state":{
                    path = path + "/getPersonalByState/"+this.value
                    break
                }
                case "department":{
                    path = path + "/getPersonalByDepartmentId/"+this.value
                    break
                }
                case "position":{
                    path = path + "/getPersonalsByPositionId/"+this.value
                    break
                }
            }
            axios.post(path).then(
                (res)=>{
                    this.$emit("update:personals",res.data)
                }
            )

        }
    }
}
</script>

<style>

</style>