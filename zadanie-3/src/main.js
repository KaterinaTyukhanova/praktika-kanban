Vue.component('board', {
    template:`
      <div class="product">
        <div>
          <div>
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
          </div>

          <div class="column">
            <h2 class="title-column">Задачи в работе</h2>
          </div>

          <div class="column">
            <h2 class="title-column">Тестирование</h2>
          </div>

          <div class="column">
            <h2 class="title-column">Выполненные задачи</h2>
          </div>
          
        </div>
        
      </div>
    `,
    data(){
        return {
            name: null,
            desc: null,
            deadline: null,
            errors: []
        }
    },
    methods: {}
})

new Vue({
    el: '#app',
    data(){
        return {}
    }
})
