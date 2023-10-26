<template>
  <NewsList v-if="newsMainPage=='newsList'" v-model:showPage="newsMainPage" v-model:newsId="showNewsId" v-model:mode="showMode" />
  <ShowNews v-if="newsMainPage=='showNews'" v-model:showPage="newsMainPage" v-model:newsId="showNewsId" v-model:mode="showMode"/>
  <AddNews v-if="newsMainPage=='addNews'" v-model:showPage="newsMainPage"/>
</template>

<script>
import AddNews from "./AddNews.vue";
import NewsList from "./NewsList.vue"
import ShowNews from "./ShowNews.vue";
export default {
  data(){
    return {
      newsMainPage : "newsList",
      showNewsId :"",
      showMode : ""
    }
  },
  components:{
    NewsList,
    ShowNews,
    AddNews
}
}
</script>

<style>

</style>