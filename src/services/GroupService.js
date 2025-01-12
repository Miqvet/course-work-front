import AuthService from './AuthService';

const API_URL = '/api/groups/';

class GroupService {
    async getUserGroups() {
        const user = AuthService.getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const response = await fetch(`${API_URL}user/${user.id}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user groups');
        }

        return response.json();
    }

    async createGroup(name, description) {
        const user = AuthService.getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                description,
                members: []
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create group');
        }

        return response.json();
    }

    async deleteGroup(groupId) {
        const user = AuthService.getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const response = await fetch(`${API_URL}${groupId}/delete`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete group');
        }

        return response.json();
    }

    async leaveGroup(groupId, userId) {
        const user = AuthService.getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const response = await fetch(`${API_URL}${groupId}/delete_member/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to leave group');
        }

        return response.json();
    }
}

export default new GroupService(); 