import{ createRouter, createWebHistory, createMemoryHistory, createWebHashHistory } from 'vue-router'


// Pages
import Teacher from './pages/Teacher.vue'
import Student from './pages/Student.vue'
import Create from './pages/Create.vue'
import Freeze from './pages/Freeze.vue'

const routes = [

    {path:'/', component: Student },
    {path:'/student', component: Student },
    {path:'/teacher', component: Teacher },
    {path:'/create', component: Create },
    {path:'/freeze', component: Freeze },
    {path:'/freeze/:studentId', component: Freeze }
    
];



const router = createRouter({
    //history: createMemoryHistory(),
    //history: createWebHistory('/riodas'),
    history: createWebHashHistory(),
    routes
})




export default router;