const API_URL = '/api/public/auth/';

class AuthService {
    async login(email, password) {
        const response = await fetch(API_URL + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) {
            throw new Error('Authentication failed');
        }
        
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('user', data.token);
        }
        return data;
    }

    async register(firstName, lastName, email, password) {
        const response = await fetch(API_URL + 'register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password,
            }),
        });
        
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        
        return response.json();
    }

    logout() {
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        return localStorage.getItem('user');
    }

    isAuthenticated() {
        const token = this.getCurrentUser();
        return !!token;
    }
}

export default new AuthService(); 