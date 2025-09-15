Vue.component('task-card', {
            props: ['task', 'columnId'],
            template: `
                <div class="task-card">
                    <div><strong>{{ task.title }}</strong></div>
                    <div v-if="task.description">Описание: {{ task.description }}</div>
                    <div>Создано: {{ formatDate(task.created) }}</div>
                    <div>Изменено: {{ formatDate(task.lastEdited) }}</div>
                    <div v-if="task.deadline">Дэдлайн: {{ formatDate(task.deadline) }}</div>
                    <div v-if="task.status">
                        Статус: {{ task.status === 'completed' ? 'Выполнено' : 'Просрочено' }}
                    </div>
                    <div v-if="task.returnReason">Причина: {{ task.returnReason }}</div>
                    <br>
                    <button v-if="columnId === 1" @click="$emit('delete', task.id)">Удалить</button>
                    <button @click="$emit('edit')">Редактировать</button>
                    <button v-if="columnId !== 4" @click="$emit('move', task.id)">Переместить</button>
                    <button v-if="columnId === 3" @click="$emit('return', task.id)">Вернуть</button>
                </div>
            `,
            methods: {
                formatDate(date) {
                    return new Date(date).toLocaleString();
                }
            }
        });

        Vue.component('kanban-column', {
            props: ['title', 'tasks', 'columnId'],
            template: `
                <div class="column">
                    <h3>{{ title }}</h3>
                    <button v-if="columnId === 1" @click="$emit('create-task')">Создать задачу</button>
                    <div class="task-list">
                        <task-card
                            v-for="task in tasks"
                            :key="task.id"
                            :task="task"
                            :column-id="columnId"
                            @edit="$emit('edit-task', task)"
                            @delete="$emit('delete-task', $event)"
                            @move="$emit('move-task', { taskId: $event, fromColumn: columnId, toColumn: columnId + 1 })"
                            @return="$emit('move-task', { taskId: $event, fromColumn: columnId, toColumn: 2 })"
                        ></task-card>
                    </div>
                </div>
            `
        });

        Vue.component('task-modal', {
            props: ['title', 'buttonText', 'initialTask'],
            data() {
                return {
                    task: this.initialTask ? { ...this.initialTask } : {
                        title: '',
                        description: '',
                        deadline: ''
                    }
                };
            },
            template: `
                <div class="modal" @click.self="$emit('close')">
                    <div class="modal-content">
                        <h3>{{ title }}</h3>
                        <label>Заголовок: <input type="text" v-model="task.title"></label><br>
                        <label>Описание: <textarea v-model="task.description"></textarea></label><br>
                        <label>Дэдлайн: <input type="datetime-local" v-model="task.deadline"></label><br>
                        <button @click="$emit('close')">Отмена</button>
                        <button @click="saveTask">{{ buttonText }}</button>
                    </div>
                </div>
            `,
            methods: {
                saveTask() {
                    if (this.task.title.trim() === '') {
                        alert('Заголовок не может быть пустым.');
                        return;
                    }
                    this.$emit('save', this.task);
                }
            }
        });

        new Vue({
            el: '#app',
            data: {
                columns: [
                    { id: 1, title: 'Запланированные задачи' },
                    { id: 2, title: 'Задачи в работе' },
                    { id: 3, title: 'Тестирование' },
                    { id: 4, title: 'Выполненные задачи' }
                ],
                tasks: [],
                showCreateModal: false,
                showEditModal: false,
                showReasonModal: false,
                currentTask: null,
                taskToReturnId: null
            },
            methods: {
                getTasksInColumn(columnId) {
                    return this.tasks.filter(task => task.columnId === columnId);
                },
                openCreateModal() {
                    this.showCreateModal = true;
                },
                openEditModal(task) {
                    this.currentTask = task;
                    this.showEditModal = true;
                },

