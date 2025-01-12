const API_URL = '/api/public/comments';

class CommentService {
    async createComment(commentData) {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('user')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentData),
        });

        if (!response.ok) {
            throw new Error('Failed to create comment');
        }

        return await response.json();
    }

    async getTaskComments(taskId) {
        const response = await fetch(`${API_URL}/task/${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('user')}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }

        return await response.json();
    }

    async updateComment(commentId, newComment) {
        const response = await fetch(`${API_URL}/${commentId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('user')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newComment),
        });

        if (!response.ok) {
            throw new Error('Failed to update comment');
        }

        return await response.json();
    }

    async deleteComment(commentId) {
        const response = await fetch(`${API_URL}/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('user')}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete comment');
        }
    }
}

export default new CommentService();