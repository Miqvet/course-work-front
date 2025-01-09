import React, { useState } from 'react';
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

import TasksPage from "./TaskPage";
import AuthForm from './AuthForm';
import Groups from "./Groups";
import Group from "./Group";

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
    ];

    return (
        <Router>
            <div className="app-container">
                <Sidebar menuItems={menuItems} />
                <div className="content-container">
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/all-tasks" element={<TasksPage />} />
                        <Route path="/accounts" element={<AccountsPage />} />
                        <Route path="/sign-in" element={<AuthForm />} />
                        <Route path="/groups" element={<Groups />} />
                        <Route path="/group" element={<Group />} />
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
                    style={{ height: 500 }}
                />
            </div>
            <div className="action-buttons">
                <Button label="Create Group" className="p-button-success" />
                <Button label="Join Group" className="p-button-primary" />
            </div>
        </div>
    );
};

const AccountsPage = () => {
    const [userDetails, setUserDetails] = useState({
        username: 'johndoe',
        email: 'johndoe@example.com',
        fullName: 'John Doe'
    });

    const updateUserDetail = (field, value) => {
        setUserDetails((prevDetails) => ({ ...prevDetails, [field]: value }));
    };

    return (
        <div className="accounts-page">
            <h1>My Account</h1>
            <div className="account-details">
                <div className="field">
                    <label>Username: </label>
                    <InputText value={userDetails.username} onChange={(e) => updateUserDetail('username', e.target.value)} />
                </div>
                <div className="field">
                    <label>Email: </label>
                    <InputText value={userDetails.email} onChange={(e) => updateUserDetail('email', e.target.value)} />
                </div>
                <div className="field">
                    <label>Full Name: </label>
                    <InputText value={userDetails.fullName} onChange={(e) => updateUserDetail('fullName', e.target.value)} />
                </div>
                <div className="update-buttons">
                    <Button label="Save Changes" className="p-button-success" />
                </div>
            </div>
        </div>
    );
};

export default App;
