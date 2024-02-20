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

              <div class="card-btn">
                <button @click="from_plan_to_work(task)" class="btn">Переместить в "Задачи в работе"</button>
                <button @click="delete_from_plan(index)" class="btn">Удалить</button>
              </div>
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
              <p class="completed" v-if="task.reason_of_return !== null">Причина возврата: {{ task.reason_of_return }}</p>

              <div class="card-btn">
                <button class="btn" @click="from_work_to_test(task)">Переместить в "Тестирование"</button>
              </div>
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
              
              <div class="card-btn">
                <button class="btn" @click="from_test_to_completed(task)">Переместить в "Выполненные задачи"</button>
                <button class="btn" @click="return_to_work(task, index)">Вернуть в "Задачи в работе"</button>
              </div>

              <label for="return"><br>Причина возврата:</label>
              <input id="return" type="text" v-model="task.reason_of_return">
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

                <p v-if="task.Overdue">Задача просрочена</p>
                <p class="completed" v-else>Задача выполнена в срок</p>
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
                    date_of_create: new Date().toLocaleString(),
                    Overdue: false,
                    reason_of_return: null
                });
                this.name = null;
                this.desc = null;
                this.deadline = null;
            }else{
                if(!this.name) this.errors.push("Заголовок не может быть пустым!");
                if(!this.desc) this.errors.push("Описание не может быть пустым!");
            }

            this.form_show = false;
        },
        showForm() {
            this.form_show = true
        },
        from_plan_to_work(task) {
            const index_column1 = this.plan_tasks.indexOf(task)
            this.plan_tasks.splice(index_column1, 1);
            this.tasks_in_work.push(task);
        },
        delete_from_plan(taskIndex) {
            this.plan_tasks.splice(taskIndex, 1);
        },
        from_work_to_test(task) {
            const index_column2 = this.tasks_in_work.indexOf(task)
            this.tasks_in_work.splice(index_column2, 1);
            this.testing.push(task);
        },
        return_to_work(task, taskIndex) {
            if (!this.testing[taskIndex].reason_of_return) {
                alert('Укажите причину возврата!');
                return;
            }
            const index_return = this.testing.indexOf(task)
            this.testing.splice(index_return, 1);
            this.tasks_in_work.push(task);
        },
        from_test_to_completed(task) {
            const index_column3 = this.testing.indexOf(task)
            this.testing.splice(index_column3, 1);
            if(new Date(task.deadline) < new Date()){
                task.Overdue = true;
            }
            this.completed_tasks.push(task);
        }
    }
})

new Vue({
    el: '#app',
    data(){
        return {}
    }
})
