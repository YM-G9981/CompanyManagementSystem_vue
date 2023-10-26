<template>
    <Leave v-if="attendanceMainPage == 'attendLeave'"/>
    <Sign v-if="attendanceMainPage == 'attendSign'"/>
    <SignRule v-if="attendanceMainPage == 'attendSignRule'"/>
</template>
<script>
import Leave from './leave/Leave.vue';
import Sign from './sign/Sign.vue';
import SignRule from './sign/SignRule.vue';

export default {
    props:{
        mainPage:String
    },
    components: {
        Leave,
        Sign,
        SignRule
},
    data(){
        return {
        attendanceMainPage : this.mainPage
        }
    }
    ,watch:{
        mainPage:function(){
            this.attendanceMainPage = this.mainPage
        }
    }
    ,methods:{
    }
}
    
</script>

<style>

</style>