import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Menu} from 'primereact/menu';
import {InputText} from 'primereact/inputtext';
import {Calendar, dateFnsLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {format, getDay, parse, startOfWeek} from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';
import PrivateRoute from './components/PrivateRoute';

import TasksPage from "./TaskPage";
import AuthForm from './AuthForm';
import Groups from "./Groups";
import Group from "./Group";
import NotificationTable from "./Notification";
import RewardsTable from "./RewardsTable";
import TaskService from './services/TaskService';
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';

const locales = {'en-US': enUS};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), {weekStartsOn: 0}),
    getDay,
    locales
});

const App = () => {
    const menuItems = [
        {label: 'Home', icon: 'pi pi-home', command: () => window.location = '/'},
        {label: 'All Tasks', icon: 'pi pi-list', command: () => window.location = '/all-tasks'},
        {label: 'Account', icon: 'pi pi-user', command: () => window.location = '/accounts'},
        // { label: 'Sign-in', icon: 'pi pi-key', command: () => window.location = '/sign-in' },
        {label: 'Groups', icon: 'pi pi-users', command: () => window.location = '/groups'},
        {label: 'Notification', icon: 'pi pi-bell', command: () => window.location = '/notifications'},
        {label: "Rewards", icon: 'pi pi-sparkles', command: () => window.location = "/rewards"},
    ];

    return (
        <Router>
            <div className="app-container">
                <Sidebar menuItems={menuItems}/>
                <div className="content-container">
                    <Routes>
                        <Route path="/sign-in" element={<AuthForm/>}/>
                        <Route path="/" element={
                            <PrivateRoute>
                                <MainPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="/all-tasks" element={
                            <PrivateRoute>
                                <AllTasksPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="/accounts" element={
                            <PrivateRoute>
                                <AccountsPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="/groups" element={
                            <PrivateRoute>
                                <Groups/>
                            </PrivateRoute>
                        }/>
                        <Route path="/groups/:id" element={
                            <PrivateRoute>
                                <Group/>
                            </PrivateRoute>
                        }/>
                        <Route path="/notifications" element={
                            <PrivateRoute>
                                <NotificationTable/>
                            </PrivateRoute>
                        }/>
                        <Route path="/rewards" element={
                            <PrivateRoute>
                                <RewardsTable/>
                            </PrivateRoute>
                        }/>
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

const Sidebar = ({menuItems}) => {
    return (
        <div className="sidebar">
            <div className="logo">
                <img src="/logo.png" alt="Site Logo" className="menu-logo"
                     style={{maxWidth: '25px', maxHeight: '25px', width: 'auto', height: 'auto', marginRight: '3px'}}/>
                <span>HomeTracker</span>
            </div>
            <Menu model={menuItems} className="menu"/>
        </div>
    );
};

const AllTasksPage = () => {
    return (
        <div className="main-page">
            <h1>Все ваши задачи</h1>
            <TasksPage/>
        </div>
    );
}

const MainPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasks = await TaskService.getUserTasks();
                const calendarEvents = tasks.map(task => ({
                    title: task.title,
                    start: new Date(task.deadline),
                    end: new Date(task.deadline),
                    description: task.description,
                    completed: task.completed
                }));
                setEvents(calendarEvents);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    const handleEventSelect = (event) => {
        setSelectedEvent(event);
        setDialogVisible(true);
    };

    return (
        <div className="main-page">
            <h1>Welcome</h1>
            <div className="calendar-container" style={{ padding: '20px' }}>
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
        </div>
    );
};

const AccountsPage = () => {
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('user');
                const response = await fetch('/api/users/current', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }

                const data = await response.json();
                setUserDetails(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    const updateUserDetail = async (field, value) => {
        try {
            const token = localStorage.getItem('user');
            const response = await fetch('/api/users/current', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...userDetails,
                    [field]: value
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update user details');
            }

            const updatedUser = await response.json();
            setUserDetails(updatedUser);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="accounts-page">
            <h1>My Account</h1>
            <div className="account-details">
                <div className="field">
                    <label>Firstname: </label>
                    <InputText
                        value={userDetails.firstName}
                        onChange={(e) => updateUserDetail('firstName', e.target.value)}
                    />
                </div>
                <div className="field">
                    <label>Lastname: </label>
                    <InputText
                        value={userDetails.lastName}
                        onChange={(e) => updateUserDetail('lastName', e.target.value)}
                    />
                </div>
                <div className="field">
                    <label>Email: </label>
                    <InputText
                        value={userDetails.email}
                        disabled={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
