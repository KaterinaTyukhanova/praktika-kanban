Vue.component('board', {
    template:`
      <div class="product">
        
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
        return {}
    },
    methods: {}
})

new Vue({
    el: '#app',
    data(){
        return {}
    }
})
