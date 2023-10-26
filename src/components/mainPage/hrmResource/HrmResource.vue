<template>
    <Department v-if="hrmResourceMainPage =='hrmDepartment'"/>
    <Personal v-if="hrmResourceMainPage =='hrmPersonal'"/>
    <Position v-if="hrmResourceMainPage == 'hrmPosition'"/>
    <User v-if="hrmResourceMainPage == 'hrmUser'"/>
</template>

<script>
import Department from './departments/Department.vue';
import Personal from './personal/Personal.vue';
import Position from './position/Position.vue';
import User from './user/User.vue';
export default {
    props:{
        mainPage:String
    },
    components: {
        Department,
        Personal,
        Position,
        User
        },
    data(){
        return {
        hrmResourceMainPage : this.mainPage
        }
    }
    ,watch:{
        mainPage:function(){
            this.hrmResourceMainPage = this.mainPage
        }
    }
    ,methods:{
    }
}
    
</script>

<style>

</style>