<template>
    <div class="grid-cols-4"></div>
<div class="bg-slate-100 p-5 rounded shadow-xl animate__animated animate__zoomIn text-neutral">
    <div class="my-1 text-center" v-if="view!='create' && time>0"><Counter :time="time" @end="endFn"></Counter></div>
    <div class="text-center text-xl my-4">
        {{ quest.text }}
    </div>
    <div :class="['grid grid-cols-1 gap-1 my-6', 'md:grid-cols-'+quest.options.length]">
        <div  v-for="(item, index) in quest.options" :key="index">
            <div class="relative h-full p-4 text-center rounded " :class="[(choosed==index?'outline-8 outline-dashed outline-info mx-4':''),  !end ? opcolor(index): opcorrect(index) , (!end && view=='student' && choosed==null) ? 'hover:bg-primary hover:text-white cursor-pointer':'' ]" @click="selected(index)">
                <img :src="shape[index]" class="w-6 mx-auto my-2">
                {{ item }}
            </div>
            <div v-if="view=='teacher'" class="flex flex-wrap justify-between gap-0.5 my-1 bg-slate-300 p-1 rounded max-h-16 overflow-y-auto">
                <template v-for="(Ritem, Rindex) in responders[index]">
                    <div  :key="Rindex" class="text-xs bg-white rounded-full px-1" v-if="visible(Ritem?.id)">
                        {{ getInitials(Ritem.name) }}
                    </div>
                </template>
            </div>
        </div>
    </div>
    <div class="text-xs mt-5 opacity-50 text-center animate__animated animate__bounceInDown" v-if="!end && choosed">Waiting for the countdown...</div>
</div>
</template>
<script setup>

import sh1 from '../assets/sh1.svg'
import sh2 from '../assets/sh2.svg'
import sh3 from '../assets/sh3.svg'
import sh4 from '../assets/sh4.svg'

const props = defineProps ({
    quest: Object,
    view: String,
    time: Number,
    responders: Object,
    freezeuserid: [Boolean, String]
})

const visible = (theid) => {
    if(!theid){ return false }
    if(props.freezeuserid) {
        if(theid == props.freezeuserid){
            return true
        } else {
            return false
        }
    } else {
        return true
    }
}

const emits = defineEmits(['response', 'end'])

const end = ref(false)
const shape = [sh1, sh2, sh3, sh4]

const choosed = ref(null)

const endFn = () => {
    end.value = true
    emits('end', true)
}

if(props.time==0){ end.value = true }


function getInitials(name) {
  const words = name.split(" ");
  if (words.length === 1) {
    return name; // Return the input name if there is only one word
  } else {
    const firstName = words[0];
    const secondName = words[1];
    const initials = `${firstName} ${secondName.charAt(0).toUpperCase()}.`;
    return initials;
  }
}

const opcolor = (ind) => {
    if(ind==0){ return 'bg-accent'}
    if(ind==1){ return 'bg-secondary'}
    if(ind==2){ return 'bg-success'}
    if(ind==3){ return 'bg-slate-400'}
}

const opcorrect = (ind) => {
    if(ind == props.quest.answer){
        if(ind==0){ return 'bg-accent'}
        if(ind==1){ return 'bg-secondary'}
        if(ind==2){ return 'bg-success'}
        if(ind==3){ return 'bg-slate-400'}
    } else {
        return 'bg-slate-300 opacity-60'
    }
}



const selected = (index) => {
    if(props.view=='teacher'){return false}
    if(props.view=='create'){return false}
    if(end.value){return false}
    if(choosed.value!=null){return false}
    choosed.value = index

    emits('response', index)

}

</script>