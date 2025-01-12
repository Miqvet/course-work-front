import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';
import PrivateRoute from './components/PrivateRoute';
import AuthService from './services/AuthService';

import TasksPage from "./TaskPage";
import AuthForm from './AuthForm';
import Groups from "./Groups";
import Group from "./Group";
import NotificationTable from "./Notifiacation";
import RewardsTable from "./RewardsTable";

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
    getDay,
    locales
});

const App = () => {
    const menuItems = [
        { label: 'Home', icon: 'pi pi-home', command: () => window.location = '/' },
        { label: 'All Tasks', icon: 'pi pi-list', command: () => window.location = '/all-tasks' },
        { label: 'Account', icon: 'pi pi-user', command: () => window.location = '/accounts' },
        { label: 'Sign-in', icon: 'pi pi-key', command: () => window.location = '/sign-in' },
        { label: 'Groups', icon: 'pi pi-users', command: () => window.location = '/groups' },
        { label: 'Group', icon: 'pi pi-users', command: () => window.location = '/group' },
        { label: 'Notification', icon: 'pi pi-bell', command: () => window.location = '/notifications' },
        { label: "Rewards", icon: 'pi pi-sparkles', command: () => window.location = "/rewards" }, // Новый маршрут
    ];

    return (
        <Router>
            <div className="app-container">
                <Sidebar menuItems={menuItems} />
                <div className="content-container">
                    <Routes>
                        <Route path="/sign-in" element={<AuthForm />} />
                        <Route path="/" element={
                            <PrivateRoute>
                                <MainPage />
                            </PrivateRoute>
                        } />
                        <Route path="/all-tasks" element={
                            <PrivateRoute>
                                <AllTasksPage />
                            </PrivateRoute>
                        } />
                        <Route path="/accounts" element={
                            <PrivateRoute>
                                <AccountsPage />
                            </PrivateRoute>
                        } />
                        <Route path="/groups" element={
                            <PrivateRoute>
                                <Groups />
                            </PrivateRoute>
                        } />
                        <Route path="/group" element={
                            <PrivateRoute>
                                <Group />
                            </PrivateRoute>
                        } />
                        <Route path="/notifications" element={
                            <PrivateRoute>
                                <NotificationTable />
                            </PrivateRoute>
                        } />
                        <Route path="/rewards" element={
                            <PrivateRoute>
                                <RewardsTable />
                            </PrivateRoute>
                        } />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

const Sidebar = ({ menuItems }) => {
    return (
        <div className="sidebar">
            <div className="logo">
                <img src="./logo.png" alt="Site Logo" className="menu-logo" style={{ maxWidth: '30px', maxHeight: '30px', width: 'auto', height: 'auto'}} />
                <span>TaskTracker</span>
            </div>
            <Menu model={menuItems} className="menu"/>
        </div>
    );
};

const AllTasksPage = () => {
    // const [tasks, setTasks] = useState([]);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);

    // const fetchUserTasks = async () => {
    //     try {
    //         setLoading(true);
    //         const token = localStorage.getItem('user');
    //         const userEmail = localStorage.getItem('userEmail');
    //         const response = await fetch(`/api/tasks/user/${localStorage.getItem('userId')}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to fetch tasks');
    //         }

    //         const data = await response.json();
    //         // Преобразуем данные в нужный формат
    //         const formattedTasks = data.map(task => ({
    //             id: task.id,
    //             title: task.title,
    //             description: task.description,
    //             deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
    //             completed: task.isCompleted,
    //             group: task.group || 'Без группы',
    //             priority: task.currentPriority
    //         }));
            
    //         setTasks(formattedTasks);
    //     } catch (err) {
    //         setError(err.message);
    //         console.error('Error fetching tasks:', err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    return (
        <div className="main-page">
            <h1>Все ваши задачи</h1>
            <TasksPage 
                // tasks={tasks} 
                // loading={loading}
                // error={error}
                // onTasksUpdate={fetchUserTasks}
            />
        </div>
    );
}

const MainPage = () => {
    const [events] = useState([
        { title: 'Project Kickoff', start: new Date(2025, 0, 1, 10, 0), end: new Date(2025, 0, 1, 12, 0) },
        { title: 'Team Meeting', start: new Date(2025, 0, 2, 14, 0), end: new Date(2025, 0, 2, 15, 0) },
        { title: 'Submit Report', start: new Date(2025, 0, 3, 9, 0), end: new Date(2025, 0, 3, 11, 0) },
        { title: 'Client Presentation', start: new Date(2025, 0, 4, 13, 0), end: new Date(2025, 0, 4, 14, 30) },
        { title: 'Code Review', start: new Date(2025, 0, 5, 16, 0), end: new Date(2025, 0, 5, 17, 0) },
        { title: 'Workshop', start: new Date(2025, 0, 6, 10, 0), end: new Date(2025, 0, 6, 12, 0) },
        { title: 'Project Deadline', start: new Date(2025, 0, 7, 17, 0), end: new Date(2025, 0, 7, 18, 0) },
    ]);

    return (
        <div className="main-page">
            <h1>Welcome</h1>
            <div className="calendar-container">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                />
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
