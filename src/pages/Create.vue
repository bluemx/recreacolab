<template>
<div class="flex flex-col h-full w-full">
        <div class="oda-screen overflow-auto">
            <div class="min-h-fit m-auto overflow-auto max-h-full py-2 px-5 w-full">

    <div class="max-w-2xl mx-auto mt-4 p-4 bg-white shadow" v-if="!previewMode">
        <h1 class="text-2xl font-bold mb-4 text-neutral">Create Activity</h1>
        <div class="my-2 bg-slate-100 rounded p-2 flex justify-between items-center">
            <div class="text-xs text-neutral">
                Would you like to use a template?
            </div>
            <div class="text-xs"><button @click="useTemplate" class="bg-sky-400 hover:bg-sky-700 text-white font-bold py-1 px-2 rounded">Yes, use a template</button></div>
        </div>
        <form @submit.prevent="saveAndCreateActivity">
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" for="activityName">Activity Name:</label>
            <input class="w-full px-3 py-2 border border-gray-300 rounded-md" id="activityName" v-model="activity.name" required>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" for="description">Description:</label>
            <textarea class="w-full px-3 py-2 border border-gray-300 rounded-md" id="description" v-model="activity.description" required></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" for="questionTime">Time per question :</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md" id="questionTime" v-model="activity.time" required>
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
                <option value="15">15 seconds</option>
                <option value="20">20 seconds</option>
                <option value="25">25 seconds</option>
                <option value="30">30 seconds</option>
              </select>
          </div>
      
          <h2 class="text-lg font-bold mb-2 text-neutral">Questions:</h2>
          <div v-for="(question, index) in activity.questions" :key="index" class="mb-4 p-4 border border-gray-300 rounded">
            <div class="mb-4">
              <label class="block text-gray-700 font-bold mb-2" for="questionText">Question:</label>
              <textarea class="w-full px-3 py-2 border border-gray-300 rounded-md" id="questionText" v-model="question.text" required></textarea>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 font-bold mb-2">Options:</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="mb-2">
                  <input class="w-full px-3 py-2 border border-gray-300 rounded-md" v-model="question.options[optionIndex]" required>
                  <button class="text-red-500" @click="removeOption(index, optionIndex)" v-if="optionIndex > 1">Remove Option</button>
                </div>
              </div>
              <button class="bg-sky-500 hover:bg-sky-700 text-white font-bold py-1 px-2 rounded" @click="addOption(index)" v-if="question.options.length < 4">Add Option</button>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 font-bold mb-2">Select the right answer:</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md" id="questionAnswer" v-model="question.answer" required>
                    <option v-for="(answer, answerIndex) in question.options" :key="answerIndex" :value="answerIndex">{{answer}}</option>
                </select>
            </div>
          </div>
          
          <button class="bg-sky-500 hover:bg-sky-700 text-white font-bold py-1 px-2 rounded" @click="addQuestion" v-if="activity.questions.length < 10">Add Question</button>
          <div class="flex gap-2 justify-end mt-10 items-center" >
            <button class="bg-stone-400 hover:bg-sky-700 text-white font-bold py-0.5 px-1 text-xs rounded mr-auto" type="button" @click="clearActivity" >Clear activity</button>
            <button class="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded" type="button" @click="previewActivity" :disabled="activity.questions.length<2" :class="activity.questions.length<2?'opacity-20':''">Preview</button>
            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="submit" :disabled="activity.questions.length<2" :class="activity.questions.length<2?'opacity-20':''">Save and Create Activity</button>
          </div>
        </form>
      </div>


      <div v-if="previewMode" class="max-w-2xl mx-auto mt-4 p-4 bg-white shadow text-neutral text-center">

        <div class="bg-white rounded-lg p-4 shadow ">
          <h2 class="text-xl opacity-50  mb-4">Preview</h2>

          <h1 class="text-2xl mb-2 font-bold">{{activity.name}}</h1>
          <h1 class="text-xl mb-5">{{activity.description}}</h1>

          <div v-for="(question, index) in activity.questions" :key="index" class="mb-4 bg-slate-100 rounded p-3">
            <Question :time="10"  :quest="question" view="create" ></Question>
          </div>
          <button class="bg-rose-600 hover:bg-rose-800 text-white font-bold py-2 px-4 rounded" @click="closePreviewMode">Close</button>
        </div>
      </div>
      
      <div class="fixed inset-0 flex items-center justify-center z-50 bg-white/70" v-if="saved">
        <div class="bg-rose-600 text-white rounded-lg p-4 shadow-xl">
            <h2 class="text-2xl">Saving...</h2>
        </div>
      </div>

</div></div></div>
</template>
<script setup>


const activity = ref({
    name: '',
    description: '',
    time: 10,
    questions: [
    {
        text: '',
        options: ['', ''],
        answer: 0
    }
    ]
})
const previewMode = ref(false)
const saved = ref(false)



const indexcolor = (idx) => {
    switch(idx){
        case 0: return 'bg-rose-600'; break;
        case 1: return 'bg-sky-500'; break;
        case 2: return 'bg-orange-500'; break;
        case 3: return 'bg-lime-400'; break;
    }
}
const addOption = (questionIndex) => {
if (activity.value.questions[questionIndex].options.length < 4) {
    activity.value.questions[questionIndex].options.push('');
}
}
const removeOption = (questionIndex, optionIndex) => {
        if (activity.value.questions[questionIndex].options.length > 2) {
          activity.value.questions[questionIndex].options.splice(optionIndex, 1);
        }
}
const addQuestion = () => {
        if (activity.value.questions.length < 10) {
          activity.value.questions.push({
            text: '',
            options: ['', '', ''],
          });
        }
      }
const saveAndCreateActivity = () => {
        const message = {type:'saveActivity', data:JSON.parse(JSON.stringify(activity.value))}
        parent.window.postMessage(message, '*');
        console.log('%cpostMessage:', 'background: #ffdd00;', message)
        saved.value = true
        setTimeout(()=>{
            saved.value = false
        }, 3000)
    }
const previewActivity = () => {
        openPreviewMode()
      }
const openPreviewMode = () => {
        previewMode.value = true;
      }
      
const closePreviewMode = () => {
        previewMode.value = false;
}
const useTemplate = () => {
        activity.value = {"name":"CEFR Level A1","description":"This is an activity for Common European Framework of Reference for Languages (CEFR) Level A1", "time": 10,"questions":[{"text":"What is your name?","answer":0,"options":["My name is John.","I am 25 years old.","I like playing football."]},{"text":"Where are you from?","answer":0,"options":["I am from Spain.","I have two brothers.","I like pizza."]},{"text":"What is your favorite color?","answer":0,"options":["My favorite color is blue.","I have a dog.","I like reading books."]},{"text":"Do you like to sing?","answer":0,"options":["Yes, I like to sing.","I have a cat.","I like watching movies."]},{"text":"What time is it?","answer":0,"options":["It is 3 o'clock.","I have a sister.","I like swimming."]}]}
      }
const clearActivity = () => {
        activity.value = {"name":"","description":"","time":10,"questions":[{"text":"","options":["",""],"answer":0}]}
      }
</script>