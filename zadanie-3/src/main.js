Vue.component('board', {
    template:`
      <div class="product">
        <div>
          <div v-if="form_show">
            <form class="addForm" @submit.prevent="onSubmit">
              <p v-if="errors.length">
                <b>Возникли следующие ошибки, пожалуйста, исправьте их!</b>
              <ul>
                <li v-for="error in errors">{{ error }}</li>
              </ul>
              </p>

              <p>
                <label for="name">Заголовок</label>
                <input id="name" v-model="name" type="text">
              </p>

              <p>
                <label for="desc">Описание задачи</label>
                <textarea id="desc" v-model="desc"></textarea>
              </p>

              <p>
                <label for="deadline">Дэдлайн</label>
                <input id="deadline" type="date" v-model="deadline">
              </p>

              <p>
                <input type="submit" value="Создать карточку" class="btn-create-card">
              </p>
            </form>
          </div>
        </div>
        
        <div class="columns-on-page">
          <div class="column">
            <h2 class="title-column">Запланированные задачи</h2>
            <div class="add_btn"><button class="btn" @click="showForm()">Создать</button></div>
            <div class="card" v-for="(task, index) in plan_tasks" :key="index">
              <h3>Заголовок: {{ task.name_card }}</h3>
              <div class="line"></div>
              <p>Описание: {{ task.description }}</p>
              <p>Дата создания: {{ task.date_of_create }}</p>
              <p>Дэдлайн: {{ task.data_line }}</p>
            </div>
          </div>

          <div class="column">
            <h2 class="title-column">Задачи в работе</h2>
            <div class="card" v-for="(task, index) in tasks_in_work" :key="index">
              <h3>Заголовок: {{ task.name_card }}</h3>
              <div class="line"></div>
              <p>Описание: {{ task.description }}</p>
              <p>Дата создания: {{ task.date_of_create }}</p>
              <p>Дэдлайн: {{ task.data_line }}</p>
            </div>
          </div>

          <div class="column">
            <h2 class="title-column">Тестирование</h2>
            <div class="card" v-for="(task, index) in testing" :key="index">
              <h3>Заголовок: {{ task.name_card }}</h3>
              <div class="line"></div>
              <p>Описание: {{ task.description }}</p>
              <p>Дата создания: {{ task.date_of_create }}</p>
              <p>Дэдлайн: {{ task.data_line }}</p>
            </div>
          </div>

          <div class="column">
            <h2 class="title-column">Выполненные задачи</h2>
            <div class="card" v-for="(task, index) in completed_tasks" :key="index">
              <div>
                <h3>Заголовок: {{ task.name_card }}</h3>
                <div class="line"></div>
                <p>Описание: {{ task.description }}</p>
                <p>Дата создания: {{ task.date_of_create }}</p>
                <p>Дэдлайн: {{ task.data_line }}</p>
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
    `,
    data(){
        return {
            name: null,
            desc: null,
            deadline: null,
            errors: [],
            plan_tasks: [],
            tasks_in_work: [],
            testing: [],
            completed_tasks: [],
            form_show: false
        }
    },
    methods: {
        onSubmit() {
            this.errors = [];

            if (new Date(this.deadline) <= new Date(new Date().setDate(new Date().getDate()))) {
                alert('Некорректная дата дэдлайна!');
                return;
            }

            if(this.name && this.desc && this.deadline){
                this.plan_tasks.push({
                    name_card: this.name,
                    description: this.desc,
                    data_line: this.deadline,
                    date_of_create: new Date().toLocaleString()
                });
                this.name = null;
                this.desc = null;
                this.deadline = null;
            }else{
                if(!this.name) this.errors.push("Заголовок не может быть пустым!");
                if(!this.desc) this.errors.push("Описание не может быть пустым!");
            }
        },
        showForm() {
            this.form_show = true
        }
    }
})

new Vue({
    el: '#app',
    data(){
        return {}
    }
})
