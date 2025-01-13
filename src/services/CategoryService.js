class CategoryService {
    static async getAllCategories() {
        const token = localStorage.getItem('user');
        const response = await fetch('/api/categories', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    }

    static async createCategory(category) {
        const token = localStorage.getItem('user');
        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(category)
        });
        return await response.json();
    }
}

export default CategoryService; 