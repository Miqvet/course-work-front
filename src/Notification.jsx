import React, {useEffect, useState} from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

const NotificationTable = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('/api/notifications', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('user')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Ошибка при получении наград');
                }

                const data = await response.json();
                const formatedData = data.map(notification => ({
                    title: notification.title,
                    description: notification.description,
                    date: new Date(notification.date).toLocaleDateString(),
                    groupId: notification.groupId
                }));
                setNotifications(formatedData);
            } catch (error) {
                console.error('Ошибка при получении уведомлений:', error);
            }
        };

        fetchNotifications();
    }, []);

    const goToGroup = (groupId) => {
        window.location.href = `/groups/${groupId}`;
    };

    const actionBodyTemplate = (notification) => (
        <Button
            label="Go to Group"
            icon="pi pi-arrow-right"
            className="p-button-rounded p-button-primal"
            onClick={() => goToGroup(notification.groupId)}
        />
    );

    return (
        <div className="notification-table" style={{ padding: "2rem" }}>
            <DataTable value={notifications} paginator rows={5} responsiveLayout="scroll">
                <Column field="title" header="Title" sortable></Column>
                <Column field="description" header="Description" sortable></Column>
                <Column field="date" header="Date" sortable></Column>
                <Column body={actionBodyTemplate} header="Action"></Column>
            </DataTable>
        </div>
    );
};

export default NotificationTable;
