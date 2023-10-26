<template>
    <el-card id="search_div" class="box-card" v-if="search" >
    <span class="text-large font-600 mr-1 search" id = "search_span" > 
        <el-button  circle type="danger" @click="$emit('modifySearch')" > <el-icon><CloseBold /></el-icon></el-button>
            <el-autocomplete
                v-model="state"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                @select="handleSelect"
                fit-input-width:true
            />
            <el-button  circle type="primary" > <el-icon ><Search /></el-icon></el-button>
        </span>
    </el-card>
</template>

<script>
export default {
    props :{
        search :Boolean
    }
}
</script>

<style>
#search_div{
    width: 100%;
}
</style>
<!-- 

const links = ref<LinkItem[]>([])

const loadAll = () => {
  return [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' },
  ]
}

let timeout: NodeJS.Timeout
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  const results = queryString
    ? links.value.filter(createFilter(queryString))
    : links.value

  clearTimeout(timeout)
  timeout = setTimeout(() => {
    cb(results)
  }, 3000 * Math.random())
}
const createFilter = (queryString: string) => {
  return (restaurant: LinkItem) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

const handleSelect = (item: LinkItem) => {
  console.log(item)
}

onMounted(() => {
  links.value = loadAll()
}) -->