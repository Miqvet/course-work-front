import React, {useEffect, useState} from 'react';
import {Menubar} from 'primereact/menubar';
import {useParams} from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

import {format, getDay, parse, startOfWeek} from "date-fns";
import enUS from "date-fns/locale/en-US";

import './Group.css';
import './Group.css';
import TasksPage from "./TaskPage";
import AdminPanel from "./AdminPanel";

import {Calendar, dateFnsLocalizer} from "react-big-calendar";
import TaskService from "./services/TaskService";
import CommentService from "./services/CommentService";


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
                        <div className="user-avatar">
                            {user.firstName ? user.firstName[0] : '?'}
                        </div>
                        <div className="user-details">
                            <div className="user-name">
                                {`${user.firstName} ${user.lastName}`}
                            </div>
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
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);

    const handleEventSelect = (event) => {
        setSelectedEvent(event);
        setDialogVisible(true);
    };

    return (
        <div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{
                    height: 600,
                    margin: '20px',
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                views={['month', 'week', 'day', 'agenda']}
                defaultView='month'
                eventPropGetter={event => ({
                    style: {
                        backgroundColor: event.completed ? '#d4edda' : '#f8d7da',
                        borderRadius: '3px',
                        color: 'black',
                        padding: '2px 5px'
                    }
                })}
                tooltipAccessor={event => `${event.title} - ${event.description || 'Нет описания'}`}
                popup
                selectable
                onSelectEvent={handleEventSelect}
                messages={{
                    next: "Следующий",
                    previous: "Предыдущий",
                    today: "Сегодня",
                    month: "Месяц",
                    week: "Неделя",
                    day: "День",
                    agenda: "Список"
                }}
            />

            <Dialog
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                header="Информация о задаче"
                style={{ width: '350px' }}
                modal
                footer={
                    <div>
                        <Button
                            label="Закрыть"
                            icon="pi pi-times"
                            onClick={() => setDialogVisible(false)}
                            className="p-button-text"
                        />
                    </div>
                }
            >
                {selectedEvent && (
                    <div>
                        <h3>{selectedEvent.title}</h3>
                        <p><strong>Описание:</strong> {selectedEvent.description || 'Нет описания'}</p>
                        <p><strong>Статус:</strong> {selectedEvent.completed ? 'Выполнено' : 'В процессе'}</p>
                        <p><strong>Дата:</strong> {selectedEvent.start.toLocaleDateString()}</p>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

const Group = () => {
    const {id} = useParams(); // Получаем id из URL
    const [tasks, setTasks] = useState([]);
    const [events, setEvents] = useState([]);
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
                firstName: `${user.firstName}`,
                lastName: `${user.lastName}`,
                role: user.role === 'ADMIN' ? 'Администратор' : 'Участник'
            })));
        } catch (err) {
            setError(err.message);
            console.error('Error fetching group users:', err);
        } finally {
            setLoading(false);
        }
    };

    const [groupDetails, setGroupDetails] = useState({
        id: id,
        name: '',
        description: ''
    });
    const fetchGroupDetails = async () => {
        try {
            const response = await fetch(`/api/groups/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('user')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch group details');
            }

            const data = await response.json();
            setGroupDetails({
                name: data.name,
                description: data.description
            });
        } catch (err) {
            setError(err.message);
            console.error('Error fetching group details:', err);
        }
    };

    useEffect(() => {
        if (id) {
            fetchGroupDetails();
            fetchGroupUsers();
        }
    }, [id]);

    const [activeView, setActiveView] = useState('tasks');
    const [showTaskDialog, setShowTaskDialog] = useState(false);
    const [newTask, setNewTask] = useState({title: '', description: '', deadline: '', group: '', completed: false});

    useEffect(() => {
        const fetchTasks = async () => {
            const data = await TaskService.getUserTasks();
            const filteredTasks = data.filter(task => task.group.id == id);
            setTasks(filteredTasks);

            // Преобразуем задачи в события для календаря
            const calendarEvents = filteredTasks.map(task => ({
                title: task.title,
                start: new Date(task.deadline),
                end: new Date(task.deadline),
                description: task.description,
                completed: task.completed
            }));
            setEvents(calendarEvents);
        };
        fetchTasks();
    }, [id]);

    const menuItems = [
        {label: 'Главная', icon: 'pi pi-briefcase', command: () => setActiveView('tasks')},
        {label: 'Календарь', icon: 'pi pi-calendar', command: () => setActiveView('calendar')},
        {label: 'Настройки', icon: 'pi pi-spin pi-cog', command: () => setActiveView('settings')}
    ];

    const handleUpdateGroupAdmin = async (updatedGroup) => {
        try {
            const token = localStorage.getItem('user');
            const response = await fetch(`/api/groups/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: updatedGroup.name,
                    description: updatedGroup.description
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update group');
            }

            const data = await response.json();
            setGroupDetails({
                id: id,
                name: data.name,
                description: data.description
            });
        } catch (err) {
            console.error('Error updating group:', err);
            alert("Ошибка при обновлении группы");
        }
    };

    const handleAssignTaskAdmin = (task, member) => {
        alert(`Задача "${task.title}" назначена участнику "${member.name}"`);
    };

    const handleDeleteTaskAdmin = async (taskId) => {
        await TaskService.deleteTask(taskId)
        setTasks(tasks.filter((task) => task.id != taskId));
        alert("Задача удалена!");
    };

    const renderTasksGrid = () => (
        <TasksPage groupId={id}></TasksPage>
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
                    <div className="groupe-container">я
                        <h3>Календарь</h3>
                        <CalendarPage events={events}/>
                    </div>
                );
            case 'settings':
                return (
                    <div className="groupe-container">
                        <h2>Панель администратора группы {id}</h2>
                        <AdminPanel
                            id={id}
                            group={groupDetails}
                            tasks={tasks}
                            members={users}
                            onUpdateGroup={handleUpdateGroupAdmin}
                            onAssignTask={handleAssignTaskAdmin}
                            onDeleteTask={handleDeleteTaskAdmin}
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
