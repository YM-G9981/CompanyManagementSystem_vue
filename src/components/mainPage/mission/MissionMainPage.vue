<template>
  <Mission v-model:mainPage="missionMainPage" v-if="missionMainPage=='mission'"/>
  <MissionType v-model:mainPage="missionMainPage" v-if="missionMainPage=='missionType'"/>
  <AddNewMission v-model:mainPage="missionMainPage" v-if="missionMainPage=='addNewMission'"/>
</template>

<script>
import MissionType from './MissionType.vue';
import AddNewMission from './AddNewMission.vue';

export default {
    props: {
        mainPage: String
    },
    data() {
        return {
            missionMainPage: this.mainPage
        };
    },
    components: { MissionType, AddNewMission },
    watch:{
        mainPage : function(){
            this.missionMainPage = this.mainPage
        }
    }
}
</script>

<style>

</style>