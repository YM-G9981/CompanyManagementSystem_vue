<template>
  <AnnouncementList v-if="announcementMainPage=='announcementList'" v-model:showPage="announcementMainPage" v-model:announcementId="showAnnouncementId" v-model:mode="showMode" />
  <ShowAnnouncement v-if="announcementMainPage=='showAnnouncement'" v-model:showPage="announcementMainPage" v-model:announcementId="showAnnouncementId" v-model:mode="showMode"/>
  <AddAnnouncement v-if="announcementMainPage=='addAnnouncement'" v-model:showPage="announcementMainPage"/>
</template>

<script>
import AddAnnouncement from "./AddAnnouncement.vue";
import AnnouncementList from "./AnnouncementList.vue"
import ShowAnnouncement from "./ShowAnnouncement.vue";
export default {
  data(){
    return {
      announcementMainPage : "announcementList",
      showAnnouncementId :"",
      showMode : ""
    }
  },
  components:{
    AnnouncementList,
    ShowAnnouncement,
    AddAnnouncement
}
}
</script>

<style>

</style>