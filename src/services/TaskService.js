const API_URL = '/api/tasks';

class TaskService {
    async getUserTasks() {
        const response = await fetch(`${API_URL}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('user')}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user tasks');
        }

        const data = await response.json();
        const formattedData = data.map(userTask => ({
            id: userTask.id,
            taskId: userTask.taskId,
            group: userTask.group || 'Без группы',
            title: userTask.title,
            description: userTask.description,
            priority: userTask.priority,
            deadline: userTask.deadline ? new Date(userTask.deadline).toISOString().split('T')[0] : '',
            completed: userTask.completed,
        }));
        return formattedData;
    }
}

export default new TaskService();