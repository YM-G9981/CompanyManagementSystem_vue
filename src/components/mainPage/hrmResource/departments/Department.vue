<template>
  <AddNewDepartment v-if="departmentPage == 'addNewDepartment'" :mode="departmentMode"/>
  <DepartmentList v-if="departmentPage == 'departmentList'" v-model:showPage= "departmentPage"
   v-model:departmentId="showDepartmentId" v-model:mode="departmentMode" />
  <ShowDepartment v-if="departmentPage == 'showDepartment'" v-model:showDepartmentId="showDepartmentId" v-model:mode="departmentMode"/>
</template>

<script>
import DepartmentList from './DepartmentList.vue';
import ShowDepartment from './ShowDepartment.vue';
import AddNewDepartment from './AddNewDepartment.vue';
export default {
    components: { DepartmentList, ShowDepartment,AddNewDepartment}
    ,data(){
      return {
        departmentPage:"departmentList",
        showDepartmentId :0,
        departmentSummitButtonText :"",
        departmentMode:""
      }
      
    }
}
</script>

<style>

</style>

