  let todos = [];
        let currentFilter = 'all';
        let editingId = null;
        let priorityMenuId = null;

        const todoInput = document.getElementById('todoInput');
        const addBtn = document.getElementById('addBtn');
        const todoList = document.getElementById('todoList');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const priorityMenu = document.getElementById('priorityMenu');

        function addTodo() {
            const text = todoInput.value.trim();
            if (text === '') return;

            const todo = {
                id: Date.now(),
                text: text,
                completed: false,
                priority: 'low',
                createdAt: new Date().toLocaleString()
            };

            todos.push(todo);
            todoInput.value = '';
            renderTodos();
        }

        function toggleTodo(id) {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                renderTodos();
            }
        }

        function deleteTodo(id) {
            todos = todos.filter(t => t.id !== id);
            renderTodos();
        }

        function startEdit(id) {
            editingId = id;
            renderTodos();
        }

        function saveEdit(id) {
            const input = document.querySelector(`#edit-input-${id}`);
            const todo = todos.find(t => t.id === id);
            if (todo && input) {
                const newText = input.value.trim();
                if (newText) {
                    todo.text = newText;
                }
            }
            editingId = null;
            renderTodos();
        }

        function cancelEdit() {
            editingId = null;
            renderTodos();
        }

        function showPriorityMenu(id, event) {
            event.stopPropagation();
            priorityMenuId = id;
            const rect = event.target.getBoundingClientRect();
            priorityMenu.style.left = rect.left + 'px';
            priorityMenu.style.top = (rect.bottom + 5) + 'px';
            priorityMenu.classList.add('show');
        }

        function setPriority(priority) {
            if (priorityMenuId) {
                const todo = todos.find(t => t.id === priorityMenuId);
                if (todo) {
                    todo.priority = priority;
                    renderTodos();
                }
            }
            priorityMenu.classList.remove('show');
            priorityMenuId = null;
        }

        function clearCompleted() {
            todos = todos.filter(t => !t.completed);
            renderTodos();
        }

        function renderTodos() {
            const filteredTodos = todos.filter(todo => {
                if (currentFilter === 'active') return !todo.completed;
                if (currentFilter === 'completed') return todo.completed;
                return true;
            });

            todoList.innerHTML = '';

            if (filteredTodos.length === 0) {
                todoList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📋</div>
                        <div>No tasks here!</div>
                    </div>
                `;
            } else {
                filteredTodos.forEach(todo => {
                    const li = document.createElement('li');
                    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                    
                    if (editingId === todo.id) {
                        li.innerHTML = `
                            <div class="priority-indicator priority-${todo.priority}"></div>
                            <input type="text" class="edit-input" id="edit-input-${todo.id}" value="${todo.text}" />
                            <div class="edit-actions">
                                <button class="save-btn" onclick="saveEdit(${todo.id})">Save</button>
                                <button class="cancel-btn" onclick="cancelEdit()">Cancel</button>
                            </div>
                        `;
                        setTimeout(() => {
                            const input = document.getElementById(`edit-input-${todo.id}`);
                            if (input) {
                                input.focus();
                                input.select();
                            }
                        }, 0);
                    } else {
                        li.innerHTML = `
                            <div class="priority-indicator priority-${todo.priority}"></div>
                            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${todo.id})">
                            <div class="todo-content">
                                <div class="todo-text">${todo.text}</div>
                                <div class="todo-date">${todo.createdAt}</div>
                            </div>
                            <div class="todo-actions">
                                <button class="action-btn priority-btn" onclick="showPriorityMenu(${todo.id}, event)" title="Set Priority">⭐</button>
                                <button class="action-btn edit-btn" onclick="startEdit(${todo.id})" title="Edit">✏️</button>
                                <button class="action-btn delete-btn" onclick="deleteTodo(${todo.id})" title="Delete">🗑️</button>
                            </div>
                        `;
                    }
                    todoList.appendChild(li);
                });
            }

            updateStats();
        }

        function updateStats() {
            const total = todos.length;
            const active = todos.filter(t => !t.completed).length;
            const completed = todos.filter(t => t.completed).length;
            
            document.getElementById('totalStat').textContent = total;
            document.getElementById('activeStat').textContent = active;
            document.getElementById('completedStat').textContent = completed;
        }

        function setFilter(filter) {
            currentFilter = filter;
            filterBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === filter);
            });
            renderTodos();
        }

        addBtn.addEventListener('click', addTodo);
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTodo();
        });

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => setFilter(btn.dataset.filter));
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.priority-btn') && !e.target.closest('.priority-menu')) {
                priorityMenu.classList.remove('show');
            }
        });

        renderTodos();