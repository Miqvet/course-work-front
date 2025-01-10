import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

const RewardsTable = () => {
    const rewards = [
        { name: "Top Performer", description: "Awarded for outstanding performance.", awarded_date: "2025-01-10" },
        { name: "Team Player", description: "Awarded for excellent teamwork.", awarded_date: "2025-01-08" },
        { name: "Innovator", description: "Awarded for creative solutions.", awarded_date: "2025-01-05" },
    ];

    const trophyBodyTemplate = () => (
        <i className="pi pi-trophy" style={{ fontSize: "1.5rem", color: "#FFD700" }}></i>
    );

    return (
        <div className="rewards-table" style={{ padding: "2rem" }}>
            <DataTable value={rewards} paginator rows={5} responsiveLayout="scroll">
                <Column body={trophyBodyTemplate} style={{ width: "50px", textAlign: "center" }}></Column>
                <Column field="name" header="Name" sortable></Column>
                <Column field="description" header="Description" sortable></Column>
                <Column field="awarded_date" header="Awarded Date" sortable></Column>
            </DataTable>
        </div>
    );
};

export default RewardsTable;