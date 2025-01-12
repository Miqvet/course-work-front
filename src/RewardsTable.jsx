import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const RewardsTable = () => {
    const [rewards, setRewards] = useState([]);

    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const token = localStorage.getItem('user');
                const response = await fetch('/api/rewards', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Ошибка при получении наград');
                }

                const data = await response.json();
                const formatedData = data.map(userReward => ({
                    name: userReward.reward.name,
                    description: userReward.reward.description,
                    awarded_date: new Date(userReward.awardedDate).toLocaleDateString()
                }));
                setRewards(formatedData);
            } catch (error) {
                console.error('Ошибка при получении наград:', error);
            }
        };

        fetchRewards();
    }, []);

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