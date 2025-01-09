import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Menubar } from 'primereact/menubar';

import './Group.css'; // Подключаем CSS для стилей
import TasksPage from "./TaskPage";

const UsersList = ({ users }) => {
    // Подсчет статистики
    const totalUsers = users.length;
    const totalAdmins = users.filter(user => user.role === 'Администратор').length;
    const totalParticipants = users.filter(user => user.role === 'Участник').length;

    const getRoleStyle = (role) => {
        switch (role) {
            case 'Администратор':
                return { backgroundColor: '#007bff', color: '#fff' }; // Синий для администратора
            case 'Участник':
                return { backgroundColor: '#28a745', color: '#fff' }; // Зеленый для участника
            case 'Гость':
                return { backgroundColor: '#ffc107', color: '#fff' }; // Желтый для гостя
            default:
                return { backgroundColor: '#6c757d', color: '#fff' }; // Серый для остальных
        }
    };

    return (
        <div className="users-list-container">
            <h3>Участники</h3>
            <div className="users-stats">
                <p>Всего участников: {totalUsers}</p>
                <p>Администраторов: {totalAdmins}</p>
                <p>Участников: {totalParticipants}</p>
            </div>
            <ul className="users-list">
                {users.map((user) => (
                    <li key={user.id} className="user-item">
                        <div className="user-avatar">{user.name[0]}</div>
                        <div className="user-details">
                            <div className="user-name">{user.name}</div>
                            <div
                                className="user-role"
                                style={getRoleStyle(user.role)}
                            >
                                {user.role}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};



const Group = () => {
    const users = [
        { name: 'Пользователь 1', role: 'Администратор' },
        { name: 'Пользователь 2', role: 'Участник' },
        { name: 'Пользователь 3', role: 'Участник' },
        { name: 'Пользователь 1', role: 'Администратор' },
        { name: 'Пользователь 2', role: 'Участник' },
        { name: 'Пользователь 3', role: 'Участник' },
        { name: 'Пользователь 1', role: 'Администратор' },
        { name: 'Пользователь 2', role: 'Участник' },
        { name: 'Пользователь 3', role: 'Участник' },
        { name: 'Пользователь 1', role: 'Администратор' },
        { name: 'Пользователь 2', role: 'Участник' },
        { name: 'Пользователь 3', role: 'Участник' },
    ];

    const [activeView, setActiveView] = useState('tasks');
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Задача 1', description: 'Описание задачи 1', deadline: '2025-01-15', completed: false },
        { id: 2, title: 'Задача 2', description: 'Описание задачи 2', deadline: '2025-01-20', completed: true },
        { id: 3, title: 'Задача 1', description: 'Описание задачи 1', deadline: '2025-01-15', completed: false },
        { id: 4, title: 'Задача 2', description: 'Описание задачи 2', deadline: '2025-01-20', completed: true },
        { id: 5, title: 'Задача 1', description: 'Описание задачи 1', deadline: '2025-01-15', completed: false },
        { id: 6, title: 'Задача 2', description: 'Описание задачи 2', deadline: '2025-01-20', completed: true },
        { id: 7, title: 'Задача 1', description: 'Описание задачи 1', deadline: '2025-01-15', completed: false },
        { id: 8, title: 'Задача 2', description: 'Описание задачи 2', deadline: '2025-01-20', completed: true },
        { id: 9, title: 'Задача 1', description: 'Описание задачи 1', deadline: '2025-01-15', completed: false },
        { id: 10, title: 'Задача 2', description: 'Описание задачи 2', deadline: '2025-01-20', completed: true }

    ]);
    const [showTaskDialog, setShowTaskDialog] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', deadline: '' });

    const menuItems = [
        { label: 'Главная', icon: 'pi pi-briefcase', command: () => setActiveView('tasks') },
        { label: 'Календарь', icon: 'pi pi-calendar', command: () => setActiveView('calendar') }
    ];

    const addTask = () => {
        if (newTask.title && newTask.deadline) {
            setTasks([
                ...tasks,
                { id: tasks.length + 1, ...newTask, completed: false }
            ]);
            setNewTask({ title: '', description: '', deadline: '' });
            setShowTaskDialog(false);
        }
    };

    const toggleTaskCompletion = (taskId) => {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    const renderTaskDialog = () => (
        <Dialog
            header="Создать новую задачу"
            visible={showTaskDialog}
            style={{ width: '400px' }}
            modal
            onHide={() => setShowTaskDialog(false)}
        >
            <div className="p-field">
                <label htmlFor="title">Название задачи</label>
                <InputText
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Введите название задачи"
                />
            </div>
            <div className="p-field">
                <label htmlFor="description">Описание задачи</label>
                <InputText
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Введите описание задачи"
                />
            </div>
            <div className="p-field">
                <label htmlFor="deadline">Дедлайн</label>
                <InputText
                    id="deadline"
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                />
            </div>
            <Button label="Создать задачу" icon="pi pi-check" className="p-button-success" onClick={addTask} />
        </Dialog>
    );

    const renderTasksGrid = () => (
        <TasksPage></TasksPage>
    );

    const renderView = () => {
        switch (activeView) {
            case 'tasks':
                return (
                    <div className="main-container" style={{display: 'flex'}}>
                        <div className="groupe-container" style={{flex: 1}}>
                            <h3>Задачи</h3>
                            <Button
                                label="Создать задачу"
                                icon="pi pi-plus"
                                className="p-button-success"
                                onClick={() => setShowTaskDialog(true)}
                            />
                            {renderTasksGrid()}
                            {renderTaskDialog()}
                        </div>
                        <UsersList users={users} style={{width: '300px'}}/>
                    </div>
                );
            case 'members':
                return (
                    <div className="groupe-container">
                        <h3>Участники</h3>
                        <UsersList users={users}></UsersList>
                    </div>
                );
            case 'calendar':
                return (
                    <div className="groupe-container">
                        <h3>Календарь</h3>
                        {/* Логика календаря */}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="groupe-container">
            <Menubar model={menuItems} />
            <div className="p-mt-3">{renderView()}</div>
        </div>
    );
};

export default Group;
