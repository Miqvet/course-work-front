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
            group: userTask.group,
            title: userTask.title,
            description: userTask.description,
            priority: userTask.priority,
            deadline: userTask.deadline ? new Date(userTask.deadline).toISOString().split('T')[0] : '',
            completed: userTask.completed,
        }));
        return formattedData;
    }

    async deleteTask(taskId) {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('user')}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
    }

    async completeUserTask(taskId) {
        const response = await fetch(`${API_URL}/${taskId}/complete`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('user')}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to complete task');
        }

    }

    async createTask(groupId, taskData) {
        const deadline = taskData.deadline ? new Date(taskData.deadline).toISOString() : null;
        
        const requestBody = {
            title: taskData.title,
            description: taskData.description,
            currentPriority: parseInt(taskData.priority) || 1,
            deadline: deadline,
            isCompleted: false,
            isRepeated: taskData.is_repeated || false,
            repeatedPeriod: parseInt(taskData.repeated_period) || null,
            category: taskData.category || null,
            assignedUserId: null,
            groupId: groupId
        };

        const response = await fetch(`${API_URL}/group/${groupId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('user')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create task');
        }

        return await response.json();
    }
}

export default new TaskService();