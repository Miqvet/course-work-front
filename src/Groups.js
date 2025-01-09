import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';

const Groups = () => {
    const [groups, setGroups] = useState([
        { id: 1, name: 'Группа 1', description: 'Описание 1', taskCount: 5 },
        { id: 2, name: 'Группа 2', description: 'Описание 2', taskCount: 2 },
        { id: 3, name: 'Группа 3', description: 'Описание 3', taskCount: 8 },
        { id: 4, name: 'Группа 4', description: 'Описание 4', taskCount: 1 },
        { id: 5, name: 'Группа 5', description: 'Описание 5', taskCount: 10 },
        { id: 6, name: 'Группа 6', description: 'Описание 6', taskCount: 7 }
    ]); // Пример списка групп

    const [layout, setLayout] = useState('list'); // Для переключения между сеткой и списком
    const [dialogVisible, setDialogVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [sortKey, setSortKey] = useState(null); // Сортировка
    const [first, setFirst] = useState(0); // Пагинация
    const [rows, setRows] = useState(5);

    const sortOptions = [
        { label: 'По имени', value: 'name' },
        { label: 'По количеству задач', value: 'taskCount' }
    ];

    const handleCreateGroup = () => {
        if (newGroupName) {
            setGroups([...groups, { id: groups.length + 1, name: newGroupName, description: '', taskCount: 0 }]);
            setNewGroupName('');
            setDialogVisible(false);
        }
    };
    const handleJoinGroup = (groupId) => {
        console.log(`Joined group: ${groupId}`);
    };

    const handleLeaveGroup = (groupId) => {
        console.log(`Left group: ${groupId}`);
    };

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const sortedGroups = sortKey
        ? [...groups].sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1))
        : groups;

    const paginatedGroups = sortedGroups.slice(first, first + rows);

    const renderGroup = (group) => {
        return (
            <div className="p-col-12 p-md-6 p-lg-4">
                <Card
                    key={group.id}
                    title={group.name}
                    style={{ marginBottom: '1rem' }}
                    footer={
                        <div className="p-d-flex p-jc-between">

                            <Button
                                label="Перейти"
                                icon="pi pi-sign-in"
                                className="p-button-text"
                                onClick={() => handleJoinGroup(group.id)}
                            />
                            <Button
                                label="Выйти"
                                icon="pi pi-sign-out"
                                className="p-button-danger"
                                onClick={() => handleLeaveGroup(group.id)}
                            />
                        </div>
                    }
                >
                    <p>Описание группы...</p>
                </Card>
            </div>
        );
    };

    return (
        <div className="groups-container">
            <h2>Группы</h2>
            <div className="p-d-flex p-ai-center p-mb-3">
                <Button
                    label="Создать группу"
                    icon="pi pi-plus"
                    className="p-button-success p-mr-2"
                    onClick={() => setDialogVisible(true)}
                />
                <Button
                    label="Присоединиться"
                    icon="pi pi-plus"
                    className="p-button-success p-mr-2"
                    onClick={() => setDialogVisible(true)}
                />
                <Dropdown
                    value={sortKey}
                    options={sortOptions}
                    onChange={(e) => setSortKey(e.value)}
                    placeholder="Сортировать по"
                    className="p-mr-2"
                />
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
            <DataView
                value={paginatedGroups}
                layout={layout}
                itemTemplate={renderGroup}
                paginator={false}
                className="p-mb-3"
            />
            <Paginator first={first} rows={rows} totalRecords={groups.length} onPageChange={onPageChange} />

            <Dialog
                header="Создать новую группу"
                visible={dialogVisible}
                style={{ width: '400px' }}
                onHide={() => setDialogVisible(false)}
            >
                <div className="p-field">
                    <label htmlFor="group-name">Название группы</label>
                    <InputText
                        id="group-name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="Введите название"
                        style={{ width: '100%' }}
                    />
                </div>
                <Button
                    label="Создать"
                    icon="pi pi-check"
                    className="p-button-success"
                    onClick={handleCreateGroup}
                />
            </Dialog>
        </div>
    );
};

export default Groups;
