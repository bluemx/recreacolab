<template>
   
    
    <Loading v-if="loading"></Loading>
    
    <div class="flex flex-col h-full w-full"  v-if="!loading && activity">
        <div class="oda-screen overflow-auto" v-if="!ended">
            <div class="min-h-fit m-auto overflow-auto max-h-full py-2 px-5 w-full">
                <!-- activity info-->
                <div class="text-center text-3xl font-bold">{{ activity.name }}</div>
                <Transition name="custom-classes" enter-active-class="animate__animated animate__tada" leave-active-class="animate__animated animate__backOutUp animate__faster">
                        <template v-if="!started">
                        <div>
                            <div class="text-center text-lg max-w-xl mx-auto my-2">{{ activity.description }}</div>
                            <div class="mb-4 mx-auto bg-slate-200 p-1 rounded text-center my-1 text-sm text-neutral/50">Users have {{activity.time}} seconds to answer each of the {{activity?.questions?.length}} questions. </div>
                        </div>
                    </template>
                </Transition>
                <!-- connected users-->
                <div class="text-primary bg-slate-100 rounded-t w-fit mx-auto px-6 py-1 mt-4">Connected users: {{ users.length }}</div>
                
                <div class="p-2 bg-slate-100 rounded flex flex-wrap gap-0.5 justify-center overflow-hidden" >
                    <template v-for="(item, index) in users">
                    <Transition name="custom-classes" enter-active-class="animate__animated animate__backInDown animate__faster" leave-active-class="animate__animated animate__backOutUp animate__faster">
                            <div v-if="visibleusers" class="w-fit text-xs bg-accent text-neutral px-1 rounded">
                                {{ item.name }}
                            </div>
                    </Transition>
                </template>
                </div>
                <div class="text-primary bg-slate-100 rounded-b w-fit mx-auto px-4 py-0.5 cursor-pointer hover:bg-primary hover:text-white" @click="visibleusers=!visibleusers">
                    <iconify-icon v-if="visibleusers" icon="solar:double-alt-arrow-up-bold"></iconify-icon>
                    <iconify-icon v-else icon="solar:double-alt-arrow-down-bold"></iconify-icon>
                </div>
                <!-- start activity -->
                <div class="text-center my-6" v-if="!started && users.length>0" >
                    <button class="button animate__animated animate__tada" @click="startActivity">Start activity</button>
                </div>
                
                <!-- activity -->
                <div v-for="(item, index) in activity.questions" :key="index" class="my-5" v-if="started">
                    <!-- question -->
                    <div   v-if="index <= currentQuestion">
                        
                        <Question :time="activity.time" :responders="responders[index]" :quest="item" view="teacher" @end="endFn"></Question>
                        
                        <div class="text-center mx-auto max-w-xl p-5 animate__animated animate__tada" v-if="index == currentQuestion && readyNext">
                            <button class="btn " @click="nextQuestion">Next question</button>
                        </div>
                    </div>
                </div>

                <!-- start activity -->
                <div class="text-center my-6" v-if="readyEnd">
                    <button class="button animate__animated animate__tada" @click="endActivity">End activity</button>
                </div>

                

            </div>
        </div>
        <template v-if="ended">
            <div class="text-center text-3xl font-bold py-5 text-white">{{ activity.name }} results:</div>
        </template>
        <ScoreTable :data="score" :users="users" :end="ended" @score="setUserScore"></ScoreTable>


        <template v-if="ended">
            <div class="w-full mx-auto text-center my-2">
                <button class="button animate__animated animate__tada" @click="exitActivity">Exit from activity</button>
            </div>
        </template>
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

const endActivity = () => {
    ended.value = true
    
    /* Add Scores at 0 */
    for(var i in users.value){
        if(!users.value[i].score){
            users.value[i].score = 0
            usersScore.value.push(users.value[i])
        }
    }
    
    const finalScores = JSON.parse(JSON.stringify(usersScore.value))

    const message = { type: 'endActivity', from: 'teacher', data: finalScores,
        inputs: JSON.stringify({
            activity: JSON.parse(JSON.stringify(activity.value)),
            responders: JSON.parse(JSON.stringify(responders.value)),
            users: JSON.parse(JSON.stringify(users.value)),
            score: JSON.parse(JSON.stringify(score.value)),
            usersScore: JSON.parse(JSON.stringify(usersScore.value))
        })
     }
    window.parent.postMessage(message, '*');
    console.log('endActivity', message)
}

const exitActivity = () => {
    const message = { type: 'exitActivity', from: 'teacher'}
    window.parent.postMessage(message, '*');
    console.log('exitActivity', message)
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

const nextQuestion = () => {
    readyNext.value = false
    currentQuestion.value++
    const message = { type: "nextQuestion", from: 'teacher', data: { index: currentQuestion.value } }
    window.parent.postMessage(message, "*")
    //console.log('nextQuestion', message)
}

const startActivity = () => {
    
    new Howl({ src: [soundStart], volume: 0.6, autoplay:true })
    started.value = true
    visibleusers.value = false
    const message = { type: 'startActivity', from: 'teacher', data: {} }
    window.parent.postMessage(message, '*');
    //console.log('startActivity', message)
}

const addActivity = (data) => {
    //console.log('addActivity', data)
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
const userConnected = (data) => {
    //console.log('userConnected', data)
    users.value = data
}
const addResponder = (data) => {

    const user = users.value.filter(user=>user.id === data.id)
    if(user.length){
        responders.value[currentQuestion.value][data.index].push(user[0])
    }
}

// MESSAGE HANDLER
const handleMessage = (event) => {
    const { type, data } = event.data;
    if(type=='addActivity'){
        addActivity(data)
    }
    if(type=='userConnected'){
        userConnected(data)
    }
    if(type=='addResponder'){
        addResponder(data)
    }
    if(type=='currentQuestion'){
        
    }
}
const delay = async(ms) => {
    await new Promise(resolve => setTimeout(resolve, ms));
}
const debugFn = async () => {
    const activityData = {"name":"CEFR Level A1","description":"This is an activity for Common European Framework of Reference for Languages (CEFR) Level A1", "time": 3,"questions":[{"text":"What is your name?","answer":2,"options":["I am 25 years old.","I like playing football.", "My name is John."]},{"text":"Where are you from?","answer":0,"options":["I am from Spain.","I have two brothers.","I like pizza."]},{"text":"What is your favorite color?","answer":1,"options":["I have a dog.","My favorite color is blue.","I like reading books."]}]}
    const studentsList = [ { id: 'abc1', name: 'Martin1 Ramon' }, { id: 'abc2', name: 'Roman2 Ramirez' }, { id: 'abc3', name: 'Mónica3 Reyes' }, { id: 'abc4', name: 'Lourdes4 Pérez' },{ id: 'abc5', name: 'Jose5 Sanchez' },{ id: 'abc6', name: 'Maria6 Rodriguez' },{ id: 'abc7', name: 'Pedro7 Morales' },{ id: 'abc8', name: 'Juana8 Garcia' }, { id: 'abc9', name: 'Miguel9 Torres' }]
    window.postMessage({type:'addActivity',  data:activityData}, '*')

    await delay(500)
    window.postMessage({type:'userConnected',  data:studentsList}, '*')
}

onMounted(() => {
    window.addEventListener('message', handleMessage);

    // DEBUGG

    setTimeout(() => {
        //debugFn()
    }, 1000);


})


</script>