(function () {
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

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

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return { form, input, button };
    }

    async function createTodoApp(container, title, owner) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        const handlers = {
            onDone: async ({ todoItem, element: item }) => {
                todoItem.done = !todoItem.done;
                try {
                    await fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ done: todoItem.done })
                    });
                } catch (error) {
                    console.error('Ошибка обновления задачи:', error);
                }
            },
            onDelete: async ({ todoItem, element: item }) => {
                if (!confirm('Вы уверены?')) return;
                try {
                    await fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                        method: 'DELETE'
                    });
                    item.remove();
                } catch (error) {
                    console.error('Ошибка удаления задачи:', error);
                }
            }
        };

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        // Загрузка списка дел
        try {
            const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
            const todoItemList = await response.json();
            todoItemList.forEach(todoItem => {
                const todoItemElement = createTodoItemElement(todoItem, handlers);
                todoList.append(todoItemElement);
            });
        } catch (error) {
            console.error('Ошибка загрузки списка:', error);
        }

        // Обработчик формы
        todoItemForm.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!todoItemForm.input.value.trim()) return;

            try {
                const response = await fetch('http://localhost:3000/api/todos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: todoItemForm.input.value.trim(),
                        owner
                    })
                });
                const todoItem = await response.json();
                const todoItemElement = createTodoItemElement(todoItem, handlers);
                todoList.append(todoItemElement);
                todoItemForm.input.value = '';
            } catch (error) {
                console.error('Ошибка создания задачи:', error);
            }
        });
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItemElement(todoItem, { onDone, onDelete }) {
        const doneClass = 'list-group-item-success';
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        if (todoItem.done) item.classList.add(doneClass);
        item.textContent = todoItem.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        doneButton.addEventListener('click', () => {
            onDone({ todoItem, element: item });
            item.classList.toggle(doneClass, todoItem.done);
        });
        deleteButton.addEventListener('click', () => {
            onDelete({ todoItem, element: item });
        });

        buttonGroup.append(doneButton, deleteButton);
        item.append(buttonGroup);
        return item;
    }

    window.createTodoApp = createTodoApp;
})();