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
            localStorage.setItem('user', JSON.stringify(data));
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
        return JSON.parse(localStorage.getItem('user'));
    }

    isAuthenticated() {
        const user = this.getCurrentUser();
        return !!user?.token;
    }
}

export default new AuthService(); 