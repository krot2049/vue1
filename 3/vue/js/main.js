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
