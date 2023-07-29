<template>
<div class="w-full overflow-x-auto p-1  v-auto-animate">

    <div class="flex gap-1 " v-auto-animate v-if="!end">
        <div v-auto-animate class="animate__animated animate__bounceIn w-40 shrink-0 grow-0 bg-slate-100  text-neutral rounded p-1 tex-center text-xs flex justify-center items-center flex-col" v-for="(item, index) in sorter" :key="item.id+index+item.score" :class="[]">
            <div class="w-6 h-6 bg-accent flex justify-center items-center rounded-full">{{ index+1 }}</div>
            <div>{{ item.name }}</div>
            <div class="font-extrabold text-lg">{{ item.score }}</div>
        </div>
    </div>

    <div class="flex flex-col gap-1 justify-center items-center flex-wrap py-10"  v-auto-animate v-else>
        <div v-auto-animate class="animate__animated animate__bounceIn w-40 shrink-0 grow-0 bg-slate-100/60 text-neutral rounded p-1 tex-center text-xs flex justify-center items-center flex-col" v-for="(item, index) in sorter" :key="item.id+index+item.score" :class="[index==0?'!w-96 !bg-success text-white':'', index==1?'!w-80 !bg-success/90 text-white':'', , index==2?'!w-60 !bg-success/80 text-white':'']">
            <div class="w-6 h-6 bg-accent flex justify-center items-center rounded-full" :class="[index==0?'shadow-accent shadow-xl animate-bounce':'']">{{ index+1 }}</div>
            <div :class="['font-extrabold', index==0?'text-3xl':'', index==1?'text-xl':'', index==2?'text-lg':'' ]">{{ item.name }}</div>
            <div class="font-extrabold text-lg">{{ item.score }}</div>
        </div>
    </div>

</div>
</template>
<script setup>
const props = defineProps({
    data: Object,
    users: Object,
    end: Boolean,
    finalscores: Object
})
const emits = defineEmits(['score'])

const sorter = computed(()=>{
    let userscores = []
    for(var i in Object.keys(props.users)) {
        let us = props.users[i]
        us.score = props.data[us.id]
        if(us.score){
            userscores.push(us)
        }
    }

    if(!props?.finalscores){
        const res = userscores.sort((a,b) => b.score - a.score)
        emits('score', res)
        return res
    } else {
        return props.finalscores
    }
})

</script>