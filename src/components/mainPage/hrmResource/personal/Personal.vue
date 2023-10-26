<template>
   <PersonalList v-if="personalPage =='personalList'" v-model:mode="personalMode" v-model:showPage="personalPage" v-model:personalId="showPersonalId" />
   <AddNewPersonal v-if="personalPage == 'addPersonal'" v-model:mode="personalMode" />
   <ShowPersonal v-if="personalPage == 'showPersonal'" v-model:showPersonalId="showPersonalId" v-model:mode="personalMode" />
</template>
<script>
import AddNewPersonal from './AddNewPersonal.vue';
import PersonalList from './PersonalList.vue';
import ShowPersonal from './ShowPersonal.vue';
export default {
  components:{
    PersonalList,
    AddNewPersonal,
    ShowPersonal
  },
  data(){
    return{
      personalPage:"personalList",
      personalMode:"",
      showPersonalId:"",
    }
  }
}
</script>

<style>

</style>