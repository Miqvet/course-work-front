import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Menu } from 'primereact/menu';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

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
        { label: 'Settings', icon: 'pi pi-cog', command: () => window.location = '/settings' },
        { label: 'All Tasks', icon: 'pi pi-list', command: () => window.location = '/all-tasks' },
        { label: 'Accounts', icon: 'pi pi-users', command: () => window.location = '/accounts' },
    ];

    return (
        <Router>
            <div className="app-container">
                <Sidebar menuItems={menuItems} />
                <div className="content-container">
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/all-tasks" element={<AllTasksPage />} />
                        <Route path="/accounts" element={<AccountsPage />} />
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

const SettingsPage = () => {
    return (
        <div className="settings-page">
            <h1>Settings</h1>
            {/* Add your settings content here */}
        </div>
    );
};

const AllTasksPage = () => {
    const [tasks] = useState([
        { id: 1, name: 'Complete project report', deadline: '2025-01-10', status: 'In Progress' },
        { id: 2, name: 'Team meeting', deadline: '2025-01-05', status: 'Pending' },
        { id: 3, name: 'Submit assignment', deadline: '2025-01-03', status: 'Completed' },
    ]);

    return (
        <div className="all-tasks-page">
            <DataTable value={tasks} paginator rows={10} className="tasks-table">
                <Column field="id" header="ID" />
                <Column field="name" header="Task Name" />
                <Column field="deadline" header="Deadline" />
                <Column field="status" header="Status" />
            </DataTable>
        </div>
    );
};

const AccountsPage = () => {
    const [userDetails, setUserDetails] = useState({
        username: 'johndoe',
        email: 'johndoe@example.com',
        fullName: 'John Doe'
    });

    const [groups] = useState([
        { id: 1, name: 'Group A', description: 'Description of Group A' },
        { id: 2, name: 'Group B', description: 'Description of Group B' },
        { id: 3, name: 'Group C', description: 'Description of Group C' },
    ]);
    const [layout, setLayout] = useState('list');

    const itemTemplate = (group) => {
        return (
            <div className="p-card">
                <div className="p-card-body">
                    <h3>{group.name}</h3>
                    <p>{group.description}</p>
                    <div className="group-buttons">
                        <Button label="Leave Group" className="p-button-danger" />
                        <Button label="Go to Group" className="p-button-info" />
                    </div>
                </div>
            </div>
        );
    };

    const updateUserDetail = (field, value) => {
        setUserDetails((prevDetails) => ({ ...prevDetails, [field]: value }));
    };

    return (
        <div className="accounts-page">
            <h1>My Account</h1>
            <div className="account-details">
                <div className="field">
                    <label>Username</label>
                    <InputText value={userDetails.username} onChange={(e) => updateUserDetail('username', e.target.value)} />
                </div>
                <div className="field">
                    <label>Email</label>
                    <InputText value={userDetails.email} onChange={(e) => updateUserDetail('email', e.target.value)} />
                </div>
                <div className="field">
                    <label>Full Name</label>
                    <InputText value={userDetails.fullName} onChange={(e) => updateUserDetail('fullName', e.target.value)} />
                </div>
                <div className="update-buttons">
                    <Button label="Save Changes" className="p-button-success" />
                </div>
            </div>
            <DataView value={groups} layout={layout} paginator rows={5} itemTemplate={itemTemplate} header={
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            } />
        </div>
    );
};

export default App;
