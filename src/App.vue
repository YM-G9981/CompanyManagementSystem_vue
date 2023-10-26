<template>
  <Main v-if="isLogin" />
  <Login v-if="!isLogin" v-model:isLogin="isLogin"/>
</template>

<script>
import Login from './Login.vue';
import Main from './Main.vue';

export default {
    components: { Main, Login },
    data(){
      return {
        isLogin: false
      }
    }
}
</script>

<style>

</style>