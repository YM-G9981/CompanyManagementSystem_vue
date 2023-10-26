<template>
    <News v-if="mainPage=='newsOfNews'"/>
    <Announancement v-if="mainPage=='newsOfAnnounance'"/>
</template>
<script>
import News from './news/News.vue'
import Announancement from './announance/Announcement.vue'
export default {
  components: { News, Announancement },
    props:{
        mainPage:String
    },
    data(){
        return{
        
        }
    }
}
</script>

<style>

</style>