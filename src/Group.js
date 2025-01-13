import React, {useEffect, useState} from 'react';
import {Menubar} from 'primereact/menubar';
import {useParams} from 'react-router-dom';

import {format, getDay, parse, startOfWeek} from "date-fns";
import enUS from "date-fns/locale/en-US";

import './Group.css';
import TasksPage from "./TaskPage";
import AdminPanel from "./AdminPanel";

import {Calendar, dateFnsLocalizer} from "react-big-calendar";
import TaskService from "./services/TaskService";


const locales = {'en-US': enUS};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), {weekStartsOn: 0}),
    getDay,
    locales
});


const UsersList = ({users}) => {
    // Подсчет статистики
    const totalUsers = users.length;
    const totalAdmins = users.filter(user => user.role == 'Администратор').length;
    const totalParticipants = users.filter(user => user.role == 'Участник').length;

    const getRoleStyle = (role) => {
        switch (role) {
            case 'Администратор':
                return {backgroundColor: '#007bff', color: '#fff'}; // Синий для администратора
            case 'Участник':
                return {backgroundColor: '#28a745', color: '#fff'}; // Зеленый для участника
            case 'Гость':
                return {backgroundColor: '#ffc107', color: '#fff'}; // Желтый для гостя
            default:
                return {backgroundColor: '#6c757d', color: '#fff'}; // Серый для остальных
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

const CalendarPage = ({events}) => {
    return (
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end" style={{height: 600}}
        />
    );
}

const Group = () => {
    const {id} = useParams(); // Получаем id из URL
    const [events] = useState([
        {title: 'Project Kickoff', start: new Date(2025, 0, 1, 10, 0), end: new Date(2025, 0, 1, 12, 0)},
        {title: 'Team Meeting', start: new Date(2025, 0, 2, 14, 0), end: new Date(2025, 0, 2, 15, 0)},
        {title: 'Submit Report', start: new Date(2025, 0, 3, 9, 0), end: new Date(2025, 0, 3, 11, 0)},
        {title: 'Client Presentation', start: new Date(2025, 0, 4, 13, 0), end: new Date(2025, 0, 4, 14, 30)},
        {title: 'Code Review', start: new Date(2025, 0, 5, 16, 0), end: new Date(2025, 0, 5, 17, 0)},
        {title: 'Workshop', start: new Date(2025, 0, 6, 10, 0), end: new Date(2025, 0, 6, 12, 0)},
        {title: 'Project Deadline', start: new Date(2025, 0, 7, 17, 0), end: new Date(2025, 0, 7, 18, 0)},
    ]);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Получение пользователей группы
    const fetchGroupUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('user');

            const response = await fetch(`/api/groups/${id}/users`, { // Используем id из параметров
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch group users');
            }

            const data = await response.json();
            setUsers(data.map(user => ({
                id: user.id,
                name: user.name,
                role: user.role === 'ADMIN' ? 'Администратор' : 'Участник'
            })));
        } catch (err) {
            setError(err.message);
            console.error('Error fetching group users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) { // Проверяем наличие id
            fetchGroupUsers();
        }
    }, [id]); // Добавляем id в зависимости

    const [activeView, setActiveView] = useState('tasks');
    const [tasks, setTasks] = useState([]);
    const [showTaskDialog, setShowTaskDialog] = useState(false);
    const [newTask, setNewTask] = useState({title: '', description: '', deadline: '', group: '', completed: false});

    useEffect(() => {
        const fetchTasks = async () => {
            const data = await TaskService.getUserTasks();
            setTasks(data.filter(task => task.group == id));
        };
        fetchTasks();
    }, []);

    const menuItems = [
        {label: 'Главная', icon: 'pi pi-briefcase', command: () => setActiveView('tasks')},
        {label: 'Календарь', icon: 'pi pi-calendar', command: () => setActiveView('calendar')},
        {label: 'Настройки', icon: 'pi pi-spin pi-cog', command: () => setActiveView('settings')}
    ];

    const [group, setGroup] = useState({
        id: 1,
        name: "Команда мечты",
        members: [
            {id: 1, name: "Иван Иванов", role: "User"},
            {id: 2, name: "Мария Петрова", role: "Administrator"},
            {id: 3, name: "Сергей Сидоров", role: "User"},
        ],
    });

    const handleUpdateGroup = (updatedGroup) => {
        setGroup(updatedGroup);
    };

    const handleAssignTask = (task, member) => {
        alert(`Задача "${task.title}" назначена участнику "${member.name}"`);
    };

    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
        alert("Задача удалена!");
    };

    const toggleTaskCompletion = (taskId) => {
        setTasks(tasks.map((task) => (task.id == taskId ? {...task, completed: !task.completed} : task)));
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    const renderTasksGrid = () => (
        <TasksPage groupId={group.id}></TasksPage>
    );

    const renderView = () => {
        switch (activeView) {
            case 'tasks':
                return (
                    <div className="main-container" style={{display: 'flex'}}>
                        <div className="groupe-container" style={{flex: 1}}>
                            <h3>Задачи</h3>
                            {renderTasksGrid()}
                        </div>
                        {loading ? (
                            <div>Loading users...</div>
                        ) : error ? (
                            <div>Error: {error}</div>
                        ) : (
                            <UsersList users={users} style={{width: '300px'}}/>
                        )}
                    </div>
                );
            case 'calendar':
                return (
                    <div className="groupe-container">
                        <h3>Календарь</h3>
                        <CalendarPage events={events}/>
                    </div>
                );
            case 'settings':
                return (
                    <div className="groupe-container">
                        <h2>Панель администратора группы {group.id}</h2>
                        <AdminPanel
                            group={group}
                            tasks={tasks}
                            members={group.members}
                            onUpdateGroup={handleUpdateGroup}
                            onAssignTask={handleAssignTask}
                            onDeleteTask={handleDeleteTask}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="groupe-container">
            <Menubar model={menuItems}/>
            <div className="p-mt-3">{renderView()}</div>
        </div>
    );
};

export default Group;
