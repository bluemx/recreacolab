<template>
<div ref="counter" class="relative">
    <div class="bg-primary  mx-auto rounded-xl py-2 px-5 text-white font-extrabold text-xl" :class="!end?'w-fit':''" >
        <div :class="countclass" v-if="!end">{{ count }}</div>
        <div class="animate__animated animate__shakeX" v-if="end">Time's up!</div>
    </div>
</div>
</template>
<script setup>
import soundAlert from '../assets/uisound/alert_error-03.mp3'

import ShapesAnimation from './all/ShapesAnimation.js'
const props = defineProps({
    time: Number
})
const emits = defineEmits(['start', 'end'])
const counter = ref(null)
const count = ref(props.time)
const countclass = ref('')
const end = ref(false)
const start = () => {
    if(count.value==3){
        new Howl({ src: [soundAlert], rate: 0.7, volume: 0.4, autoplay:true })
    }
    if(count.value==2){
        new Howl({ src: [soundAlert], rate: 0.9, volume: 0.4, autoplay:true })
    }
    if(count.value==1){
        new Howl({ src: [soundAlert], rate: 1.2, volume: 0.4, autoplay:true })
    }
    if(count.value>0){
        setTimeout(()=>{
            count.value--
            start()
            countclass.value = 'animate__animated animate__flip animate__faster'
            setTimeout(()=>{ countclass.value = '' }, 900)

            //DEBUG
            /*
            if(count.value==1){
                window.postMessage({ type: 'addResponder', data: { id: 'abc4', index: Math.round(Math.random()*2)}}, '*')
                window.postMessage({ type: 'addResponder', data: { id: 'abc9', index: Math.round(Math.random()*2)}}, '*')
                window.postMessage({ type: 'addResponder', data: { id: 'abc1', index: Math.round(Math.random()*2) }}, '*')
                window.postMessage({ type: 'addResponder', data: { id: 'abc2', index: Math.round(Math.random()*2)}}, '*')
                window.postMessage({ type: 'addResponder', data: { id: 'abc5', index: Math.round(Math.random()*2)}}, '*')
                window.postMessage({ type: 'addResponder', data: { id: 'abc6', index: Math.round(Math.random()*2)}}, '*')
                window.postMessage({ type: 'addResponder', data: { id: 'abc8', index: Math.round(Math.random()*2)}}, '*')
                window.postMessage({ type: 'addResponder', data: { id: 'abc3', index: Math.round(Math.random()*2)}}, '*')
                window.postMessage({ type: 'addResponder', data: { id: 'abc7', index: Math.round(Math.random()*2)}}, '*')
            }*/

        }, 1000)
    } else {
        //finish
        setTimeout(()=>{
            countclass.value = ''
            end.value = true
            emits('end', true)

            new Howl({ src: [soundAlert], rate: 0.4, volume: 0.4, autoplay:true })

        }, 1000)
    }
}

onMounted(() => {
    start()  
    ShapesAnimation.play(counter.value)


})

</script>