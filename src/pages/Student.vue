<template>
   
    <Loading v-if="loading"></Loading>
    
    <div class="flex flex-col h-full w-full"  v-if="!loading && activity">
        <div class="oda-screen overflow-auto" v-if="!ended">
            <div class="min-h-fit m-auto overflow-auto max-h-full py-2 px-5 w-full">
                <!-- activity info-->
                <div class="text-center text-3xl font-bold">{{ activity.name }}</div>
                <template v-if="!started">
                    <div>
                        <div class="text-center text-lg max-w-xl mx-auto my-2">{{ activity.description }}</div>
                        <div class="mb-4 mx-auto bg-slate-200 p-1 rounded text-center my-1 text-sm text-neutral/50">You will have {{activity.time}} seconds to answer each of the {{activity?.questions?.length}} questions. </div>
                        <div class="opacity-40 p-5 rounded text-center">Waiting for the teacher to start the activity...</div>
                    </div>
                </template>

                
                <!-- activity -->
                <div v-for="(item, index) in activity.questions" :key="index" class="my-5" v-if="started">
                    <!-- question -->
                    <div   v-if="index == currentQuestion">
                        <Question :time="activity.time" :responders="responders[index]" :quest="item" view="student" @end="endFn" @response="newResponder"></Question>
                    </div>
                </div>

            </div>
        </div>
        <template v-if="ended">
            <div class="text-center text-3xl font-bold py-5 text-white">{{ activity.name }} results:</div>
        </template>
        <ScoreTable :data="score" :users="users" :finalscores="finalscores" :end="ended" ></ScoreTable>

    </div>
    
</template>

<script setup>

import soundStart from '../assets/uisound/state-change_confirm-up.mp3'

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
const finalscores = ref(null)

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

const endActivity = (data) => {
    ended.value = true
    console.log('endActivity', data)
    finalscores.value = data
}

const endFn = () => {
    if(currentQuestion.value < activity.value.questions.length-1){
        readyNext.value = true
    } else {
        //ENDING
        readyEnd.value = true
    }
    scoreFN()
}

const nextQuestion = (data) => {
    currentQuestion.value = data.index
}

const startActivity = () => {
    
    new Howl({ src: [soundStart], volume: 0.6, autoplay:true })
    setTimeout(()=>{
        started.value = true
        console.log('startActivity')
    }, 500)

    

}

const addActivity = (data) => {
    console.log('addActivity', data)
    activity.value = data
    loading.value = false

    //Create responders object
    for(var qs in activity.value.questions){
        responders.value[qs] = {}
        for(var op in activity.value.questions[qs].options){
            responders.value[qs][op] = []
        }
    }
}

const newResponder = ($ev) => {
    const message = {
        type: 'newResponder',
        from: 'student',
        data:{
        currentQuestionIndex: currentQuestion.value,
        index: $ev
        }
    }
    window.parent.postMessage(message, '*');
    console.log('newResponder', message)
}

// MESSAGE HANDLER
const handleMessage = (event) => {
    const { type, data } = event.data;
    if(type=='addActivity'){
        addActivity(data)
    }
    if(type=='startActivity'){
        startActivity()
    }
    if(type=='endActivity'){
        endActivity(data)
    }
    if(type=='nextQuestion'){
        nextQuestion(data)
    }
}
const delay = async(ms) => {
    await new Promise(resolve => setTimeout(resolve, ms));
}
const debugFn = async () => {
    const activityData = {"name":"CEFR Level A1","description":"This is an activity for Common European Framework of Reference for Languages (CEFR) Level A1", "time": 2,"questions":[{"text":"What is your name?","answer":2,"options":["I am 25 years old.","I like playing football.", "My name is John."]},{"text":"Where are you from?","answer":0,"options":["I am from Spain.","I have two brothers.","I like pizza."]},{"text":"What is your favorite color?","answer":1,"options":["I have a dog.","My favorite color is blue.","I like reading books."]}]}
    const studentsList = [ { id: 'abc1', name: 'Martin1 Ramon' }, { id: 'abc2', name: 'Roman2 Ramirez' }, { id: 'abc3', name: 'Mónica3 Reyes' }, { id: 'abc4', name: 'Lourdes4 Pérez' },{ id: 'abc5', name: 'Jose5 Sanchez' },{ id: 'abc6', name: 'Maria6 Rodriguez' },{ id: 'abc7', name: 'Pedro7 Morales' },{ id: 'abc8', name: 'Juana8 Garcia' }, { id: 'abc9', name: 'Miguel9 Torres' }]
    window.postMessage({type:'addActivity',  data:activityData}, '*')

    await delay(500)
    window.postMessage({type:'startActivity',  data:{}}, '*')
}

onMounted(() => {
    window.addEventListener('message', handleMessage);

    // DEBUGG

    setTimeout(() => {
        //debugFn()
    }, 1000);


})


</script>