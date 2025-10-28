(function(){
    let listArray = []
    //создаём и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    //создаём и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;
        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        input.addEventListener('input', function(){
            if(input.value !=="") {button.disabled = false} else {button.disabled = true}
        })

        //<form class="input-group mb-3"
        //  <input class ="form-control" placeholder="Введите название нового дела">
        //  <div class="input-group-append">
        //  <button class="btn btn-primary">Добавить дело</button>
        //  <div>
        //  </form>

        return {
            form,
            input,
            button,
        };
    }

    //создаём и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(obj) {
         let item = document.createElement('li');
         //кнопки помещаем в элемент, который красиво покажет их в одной группе
         let buttonGroup = document.createElement('div');
         let doneButton = document.createElement('button');
         let deleteButton = document.createElement('button');
 
         //устанавлваем стили для элементов списка, а также для размещения кнопок
         //в его правой части с помощью flex
         item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
         item.textContent = obj.name;
 
         buttonGroup.classList.add('btn-group', 'btn-group-sm');
         doneButton.classList.add('btn', 'btn-success');
         doneButton.textContent='Готово';
         deleteButton.classList.add('btn', 'btn-danger');
         deleteButton.textContent='Удалить';

         if(obj.done==true) item.classList.add('list-group-item-success')

         doneButton.addEventListener('click',function(){
            item.classList.toggle('list-group-item-success')
            for (const listItem of listArray){
                if(listItem.id == obj.id) listItem.done = !listItem.done;
            }
         });
         deleteButton.addEventListener('click',function(){
             if(confirm('Вы уверены?')){
                 item.remove();
             }
            for (let i=0; i<listArray.length; i++){
                if(listItem.id == obj.id) listArray.splice(i,1)
            }
            console.log(listArray)
         });
 
        //вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
         buttonGroup.append(doneButton);
         buttonGroup.append(deleteButton);
         item.append(buttonGroup);
 
         //приложению нужен доступ к самому элементу и кнопкам, чтобы обработать события нажатия
         return {
             item,
             doneButton,
             deleteButton,
         };
    };

    function getNewID(arr){
        let max = 0;
        for (const item of arr) {
            if(item.id>max) max = item.id
        };
        return max+1;
    }

    function createTodoApp(container,title = 'Список дел'){
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        //браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function(e) {
            //эта строчка необходима , чтобы предотвратить стандартные действия браузера
            //в данном случае мы не хотим, чтобы страница перезагрузилась при отправке формы
            e.preventDefault();

            //игнорируем создание элемента, если пользователь ничего не ввёл в поле
            if (!todoItemForm.input.value) {
                return;
            };
            
            //создаём и добавляем в список новое дело с названием из поля для ввода
                let newItem = {
                id: getNewID(listArray),
                name: todoItemForm.input.value,
                done: false
            }

            let todoItem = createTodoItem(newItem);

          

            listArray.push(newItem);

            console.log(listArray);

            todoList.append(todoItem.item);

            todoItemForm.button.disabled=true;

            //обнуляем значение в поле, чтобы не пришлось стирать его вручную
            todoItemForm.input.value = '';

        });
    }
    window.createTodoApp = createTodoApp;
})();