<template>
    <el-card>
        <el-form :model="news" label-width="120px" style="width: 70%; margin: auto; margin-top: 30px;" > 
            <el-form-item label="新闻标题">
                <el-input class="input" v-model="news.newsTitle" placeholder="标题不为空" clearable />
            </el-form-item>
            <el-form-item label="新闻描述">
                <el-input class="input" v-model="news.newsDescribe"  placeholder="描述不为空"  clearable />
            </el-form-item>
            <el-form-item label="新闻主体">
                <el-input
                    v-model="news.newsInformation"
                    :rows="10"
                    type="textarea"
                    placeholder=""
                />
            </el-form-item>
        </el-form>
        <div>
        <el-row>
                <el-col :span="12"><el-button type="primary" round @click="saveNews">保存</el-button></el-col>
                <el-col :span="12"><el-button type="primary" round @click="publishNews">发布</el-button></el-col>
            </el-row>
            </div>
        <span>需要附件请保存再修改添加图片</span>
    </el-card>
</template>
<script>
import axios from 'axios'
export default {
    data(){
        return{
            news:{"newsTitle":"","newsDescribe":"","newsInformation":"","createTime":new Date()}
        }
    },
    methods:{
        publishNews(){
            axios.post("/news/publishNews",this.news).then(
                res=>{
                    if(res.data){
                        alert("发布成功")
                    }else{
                        alert("发布失败")
                    }
                }
            )
        },
        saveNews(){
            axios.post("/news/saveNews",this.news).then(
                res=>{
                    if(res.data){
                        alert("保存成功")
                    }else{
                        alert("保存失败")
                    }
                }
            )
        },
    }
}
</script>

<style>

</style>