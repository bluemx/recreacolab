<template>
   
    
    <Loading v-if="loading"></Loading>
    

    <div class="flex flex-col h-full w-full"  v-if="!loading && activity">
        <div class="oda-screen overflow-auto">
            <div class="min-h-96 m-auto overflow-auto max-h-full py-2 px-5 w-full">
                <!-- activity info-->
                <div class="text-center text-3xl font-bold">{{ activity.name }}</div>
                <Transition name="custom-classes" enter-active-class="animate__animated animate__tada" leave-active-class="animate__animated animate__backOutUp animate__faster">
                        <template>
                        <div>
                            <div class="text-center text-lg max-w-xl mx-auto my-2">{{ activity.description }}</div>
                            <div class="mb-4 mx-auto bg-slate-200 p-1 rounded text-center my-1 text-sm text-neutral/50">Users have {{activity.time}} seconds to answer each of the {{activity?.questions?.length}} questions. </div>
                        </div>
                    </template>
                </Transition>
                

                <!-- activity -->
                <div v-for="(item, index) in activity.questions" :key="index" class="my-5">
                    <!-- question -->
                    <div>
                        <Question :time="0" :responders="responders[index]" :quest="item" view="teacher" :freezeuserid="freezeuserid"></Question>
                    </div>
                </div>
 

                <ScoreTable :data="score" :users="users" :end="ended" @score="setUserScore"></ScoreTable>
            </div>
        </div>

<!--

    <div class="text-center text-3xl font-bold py-5 text-white">{{ activity.name }} results:</div>
-->

        

    </div>
    
</template>

<script setup>

import soundStart from '../assets/uisound/state-change_confirm-up.mp3'
import { useRoute} from 'vue-router';

const loading = ref(true)
const activity = ref(null)
const users = ref([])
const responders = ref({})
const started = ref(false)
const ended = ref(false)
const currentQuestion = ref(0)
const visibleusers = ref(true)
const readyNext = ref(false)
const readyEnd = ref(false)
const score = ref({})
const scoreValue = ref(100)
const usersScore = ref(null)

const route = useRoute()
const freezeuserid = route.params?.studentId || false;


const setUserScore = ($ev) => {
    usersScore.value = JSON.parse(JSON.stringify($ev))
}
const scoreFN = () => {
    const rightanswer = activity.value.questions[currentQuestion.value].answer
    const rightResponders = responders.value[currentQuestion.value][rightanswer]
    for(var r in rightResponders){
        const responder = rightResponders[r]
        if(!score.value[responder.id]){
            score.value[responder.id] = 0
        }
        let bonus = 0
        let bonusValue = Math.round(scoreValue.value/100)
        if(r==0){ bonus = bonusValue*10 }
        if(r==1){ bonus = bonusValue*5 }
        if(r==2){ bonus = bonusValue*2 }
        score.value[responder.id] += 100 + bonus
    }
}


// MESSAGE HANDLER
const handleMessage = (event) => {
    const { type, data } = event.data;
    if(type=='loadInputs'){
        const datos = JSON.parse(data)
        activity.value = datos.activity
        users.value = datos.users
        responders.value = datos.responders
        score.value = datos.score
        usersScore.value = datos.usersScore
        ended.value = true
        loading.value = false

    }
    
}


onMounted(() => {
    window.addEventListener('message', handleMessage);

 
})


</script>