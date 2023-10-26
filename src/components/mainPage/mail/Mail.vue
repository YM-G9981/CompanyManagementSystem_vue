<template>
    <OuterMail v-if="mainPage=='mailOuter'"/>
    <InnerMail v-if="mainPage=='mailInner'"/>
</template>
<script>
import InnerMail from './InnerMail.vue';
import OuterMail from './OuterMail.vue';

export default {
  components: { OuterMail, InnerMail },
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