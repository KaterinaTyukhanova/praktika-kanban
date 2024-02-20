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
              <div v-if="edit_index !== index || edit_column !== 'plan_tasks'">
                <h3>Заголовок: {{ task.name_card }}</h3>
                <div class="line"></div>
                <p>Описание: {{ task.description }}</p>
                <p>Дата создания: {{ task.date_of_create }}</p>
                <p>Дэдлайн: {{ task.data_line }}</p>
                <p v-if="task.lastEdit !== null">Последнее редактирование: {{ task.lastEdit }}</p>

                <div class="card-btn">
                  <button @click="from_plan_to_work(task)" class="btn">Переместить в "Задачи в работе"</button>
                  <button @click="edit_start(index, 'plan_tasks')" class="btn">Редактировать</button>
                  <button @click="delete_from_plan(index)" class="btn">Удалить</button>
                </div>
              </div>
              <div v-if="edit_column === 'plan_tasks' && edit_index === index">
                <h3>Редактировать карточку</h3>
                <form @submit.prevent="edit_end(edit_index)">
                  <p><label for="editTitle">Заголовок</label>
                    <input id="editTitle" type="text" v-model="edit_task.name"></p>
                  
                  <p><label for="editDesc">Описание задачи</label>
                    <textarea id="editDesc" v-model="edit_task.desc"></textarea></p>
                  
                  <p><label for="editDeadline">Дэдлайн</label>
                    <input id="editDeadline" type="date" v-model="edit_task.deadline"></p>
                  <button type="submit" class="btn edit_btn">Сохранить</button>
                </form>
              </div>
            </div>
          </div>

          <div class="column">
            <h2 class="title-column">Задачи в работе</h2>
            <div class="card" v-for="(task, index) in tasks_in_work" :key="index" :class="{'disabled': task.isBlock}">
              <div v-if="edit_index !== index || edit_column !== 'tasks_in_work'">
                <h3>Заголовок: {{ task.name_card }}</h3>
                <div class="line"></div>
                <p>Описание: {{ task.description }}</p>
                <p>Дата создания: {{ task.date_of_create }}</p>
                <p>Дэдлайн: {{ task.data_line }}</p>
                <p v-if="task.lastEdit !== null">Последнее редактирование: {{ task.lastEdit }}</p>
                <p class="completed" v-if="task.reason_of_return !== null">Причина возврата: {{ task.reason_of_return }}</p>

                <div class="card-btn">
                  <button class="btn" @click="from_work_to_test(task)" :disabled="task.isBlock">Переместить в "Тестирование"</button>
                  <button @click="edit_start(index, 'tasks_in_work')" class="btn" :disabled="task.isBlock">Редактировать</button>
                  <button class="btn" @click="priority_task(task)" :disabled="task.isBlock">Сделать приоритетной</button>
                </div>
              </div>
              <div v-if="edit_column === 'tasks_in_work' && edit_index === index">
                <h3>Редактировать карточку</h3>
                <form @submit.prevent="edit_end(edit_index)">
                  <p><label for="editTitle">Заголовок</label>
                    <input id="editTitle" type="text" v-model="edit_task.name"></p>

                  <p><label for="editDesc">Описание задачи</label>
                    <textarea id="editDesc" v-model="edit_task.desc"></textarea></p>

                  <p><label for="editDeadline">Дэдлайн</label>
                    <input id="editDeadline" type="date" v-model="edit_task.deadline"></p>
                  <button type="submit" class="btn edit_btn">Сохранить</button>
                </form>
              </div>
            </div>
          </div>

          <div class="column">
            <h2 class="title-column">Тестирование</h2>
            <div class="card" v-for="(task, index) in testing" :key="index">
              <div v-if="edit_index !== index || edit_column !== 'testing'">
                <h3>Заголовок: {{ task.name_card }}</h3>
                <div class="line"></div>
                <p>Описание: {{ task.description }}</p>
                <p>Дата создания: {{ task.date_of_create }}</p>
                <p>Дэдлайн: {{ task.data_line }}</p>
                <p v-if="task.lastEdit !== null">Последнее редактирование: {{ task.lastEdit }}</p>

                <div class="card-btn">
                  <button class="btn" @click="from_test_to_completed(task)">Переместить в "Выполненные задачи"</button>
                  <button class="btn" @click="return_to_work(task, index)">Вернуть в "Задачи в работе"</button>
                  <button @click="edit_start(index, 'testing')" class="btn">Редактировать</button>
                </div>

                <label for="return"><br>Причина возврата:</label>
                <input id="return" type="text" v-model="task.reason_of_return">
              </div>
              <div v-if="edit_column === 'testing' && edit_index === index">
                <h3>Редактировать карточку</h3>
                <form @submit.prevent="edit_end(edit_index)">
                  <p><label for="editTitle">Заголовок</label>
                    <input id="editTitle" type="text" v-model="edit_task.name"></p>

                  <p><label for="editDesc">Описание задачи</label>
                    <textarea id="editDesc" v-model="edit_task.desc"></textarea></p>

                  <p><label for="editDeadline">Дэдлайн</label>
                    <input id="editDeadline" type="date" v-model="edit_task.deadline"></p>
                  <button type="submit" class="btn edit_btn">Сохранить</button>
                </form>
              </div>
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
            form_show: false,
            edit_task: null,
            edit_index: null,
            edit_column: null
        }
    },
    mounted() {
        if (localStorage.getItem('cards')) {
            const savedData = JSON.parse(localStorage.getItem('cards'));
            this.plan_tasks = savedData.plan_tasks;
            this.tasks_in_work = savedData.tasks_in_work;
            this.testing = savedData.testing;
            this.completed_tasks = savedData.completed_tasks;
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
                    reason_of_return: null,
                    lastEdit: null,
                    isBlock: false
                });
                this.name = null;
                this.desc = null;
                this.deadline = null;
            }else{
                if(!this.name) this.errors.push("Заголовок не может быть пустым!");
                if(!this.desc) this.errors.push("Описание не может быть пустым!");
            }

            this.form_show = false;

            localStorage.setItem('cards', JSON.stringify({
                plan_tasks: this.plan_tasks,
                tasks_in_work: this.tasks_in_work,
                testing: this.testing,
                completed_tasks: this.completed_tasks
            }));
        },
        showForm() {
            this.form_show = true
        },
        from_plan_to_work(task) {
            const index_column1 = this.plan_tasks.indexOf(task)
            this.plan_tasks.splice(index_column1, 1);
            this.tasks_in_work.push(task);

            localStorage.setItem('cards', JSON.stringify({
                plan_tasks: this.plan_tasks,
                tasks_in_work: this.tasks_in_work,
                testing: this.testing,
                completed_tasks: this.completed_tasks
            }));
        },
        delete_from_plan(taskIndex) {
            this.plan_tasks.splice(taskIndex, 1);

            localStorage.setItem('cards', JSON.stringify({
                plan_tasks: this.plan_tasks,
                tasks_in_work: this.tasks_in_work,
                testing: this.testing,
                completed_tasks: this.completed_tasks
            }));
        },
        from_work_to_test(task) {
            const index_column2 = this.tasks_in_work.indexOf(task)
            this.tasks_in_work.splice(index_column2, 1);
            this.testing.push(task);

            localStorage.setItem('cards', JSON.stringify({
                plan_tasks: this.plan_tasks,
                tasks_in_work: this.tasks_in_work,
                testing: this.testing,
                completed_tasks: this.completed_tasks
            }));
        },
        return_to_work(task, taskIndex) {
            if (!this.testing[taskIndex].reason_of_return) {
                alert('Укажите причину возврата!');
                return;
            }
            const index_return = this.testing.indexOf(task)
            this.testing.splice(index_return, 1);
            this.tasks_in_work.push(task);

            localStorage.setItem('cards', JSON.stringify({
                plan_tasks: this.plan_tasks,
                tasks_in_work: this.tasks_in_work,
                testing: this.testing,
                completed_tasks: this.completed_tasks
            }));
        },
        from_test_to_completed(task) {
            const index_column3 = this.testing.indexOf(task)
            this.testing.splice(index_column3, 1);
            if(new Date(task.deadline) < new Date()){
                task.Overdue = true;
            }
            this.completed_tasks.push(task);
            this.unlock();

            localStorage.setItem('cards', JSON.stringify({
                plan_tasks: this.plan_tasks,
                tasks_in_work: this.tasks_in_work,
                testing: this.testing,
                completed_tasks: this.completed_tasks
            }));
        },
        edit_start(index, column) {
            this.edit_index = index;
            this.edit_column = column;

            if(this.edit_column === 'plan_tasks'){
                this.edit_task = {
                    name: this.plan_tasks[index].name_card,
                    desc: this.plan_tasks[index].description,
                    deadline: this.plan_tasks[index].data_line,
                    date_of_create: this.plan_tasks[index].date_of_create
                };
            }
            else if(this.edit_column === 'tasks_in_work'){
                this.edit_task = {
                    name: this.tasks_in_work[index].name_card,
                    desc: this.tasks_in_work[index].description,
                    deadline: this.tasks_in_work[index].data_line,
                    date_of_create: this.tasks_in_work[index].date_of_create,
                    reason_of_return: this.tasks_in_work[index].reason_of_return
                };
            }
            else if(this.edit_column === 'testing'){
                this.edit_task = {
                    name: this.testing[index].name_card,
                    desc: this.testing[index].description,
                    deadline: this.testing[index].data_line,
                    date_of_create: this.testing[index].date_of_create,
                    reason_of_return: this.testing[index].reason_of_return
                };
            }
        },
        edit_end(index) {
            if (this.edit_column === 'plan_tasks') {
                this.plan_tasks[this.edit_index] = {
                    name_card: this.edit_task.name,
                    description: this.edit_task.desc,
                    data_line: this.edit_task.deadline,
                    date_of_create: this.edit_task.date_of_create,
                    lastEdit: new Date().toLocaleString()
                };
            }
            else if (this.edit_column === 'tasks_in_work') {
                this.tasks_in_work[this.edit_index] = {
                    name_card: this.edit_task.name,
                    description: this.edit_task.desc,
                    data_line: this.edit_task.deadline,
                    date_of_create: this.edit_task.date_of_create,
                    reason_of_return: this.edit_task.reason_of_return,
                    lastEdit: new Date().toLocaleString()
                };
            }
            else if (this.edit_column === 'testing') {
                this.testing[this.edit_index] = {
                    name_card: this.edit_task.name,
                    description: this.edit_task.desc,
                    data_line: this.edit_task.deadline,
                    date_of_create: this.edit_task.date_of_create,
                    reason_of_return: this.edit_task.reason_of_return,
                    lastEdit: new Date().toLocaleString()
                };
            }

            this.edit_task = null;
            this.edit_index = null;
            this.edit_column = null;

            localStorage.setItem('cards', JSON.stringify({
                plan_tasks: this.plan_tasks,
                tasks_in_work: this.tasks_in_work,
                testing: this.testing,
                completed_tasks: this.completed_tasks
            }));
        },
        unlock() {
            this.tasks_in_work.forEach(t => t.isBlock = false);
        },
        priority_task(task) {
            this.tasks_in_work.forEach(t => t.isBlock = true);
            task.isBlock = false;

            localStorage.setItem('cards', JSON.stringify({
                plan_tasks: this.plan_tasks,
                tasks_in_work: this.tasks_in_work,
                testing: this.testing,
                completed_tasks: this.completed_tasks
            }));
        },
    }
})

new Vue({
    el: '#app',
    data(){
        return {}
    }
})
