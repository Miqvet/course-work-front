import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

const NotificationTable = () => {
    const notifications = [
        { title: "Task Due", description: "Complete your task today.", date: "2025-01-10", groupId: 1 },
        { title: "New Group Invite", description: "You were invited to a group.", date: "2025-01-08", groupId: 2 },
        { title: "Reward Earned", description: "You've earned a new reward!", date: "2025-01-07", groupId: 3 },
    ];

    const goToGroup = (groupId) => {
        window.location.href = `/groups`;
    };

    const actionBodyTemplate = (rowData) => (
        <Button
            label="Go to Group"
            icon="pi pi-arrow-right"
            className="p-button-rounded p-button-primal"
            onClick={() => goToGroup()}
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
