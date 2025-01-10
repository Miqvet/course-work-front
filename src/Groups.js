import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { DataView } from 'primereact/dataview';
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

    const [dialogVisible, setDialogVisible] = useState(false);
    const [joinDialogVisible, setJoinDialogVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDescription, setNewGroupDescription] = useState('');
    const [groupIdToJoin, setGroupIdToJoin] = useState('');
    const [sortKey, setSortKey] = useState(null); // Сортировка
    const [first, setFirst] = useState(0); // Пагинация
    const [rows, setRows] = useState(5);

    const sortOptions = [
        { label: 'По имени', value: 'name' },
        { label: 'По количеству задач', value: 'taskCount' }
    ];

    const handleCreateGroup = () => {
        if (newGroupName && newGroupDescription) {
            setGroups([
                ...groups,
                {
                    id: groups.length + 1,
                    name: newGroupName,
                    description: newGroupDescription,
                    taskCount: 0
                }
            ]);
            setNewGroupName('');
            setNewGroupDescription('');
            setDialogVisible(false);
        }
    };

    const handleJoinGroup = () => {
        if (groupIdToJoin) {
            console.log(`Joined group with ID: ${groupIdToJoin}`);
            setGroupIdToJoin('');
            setJoinDialogVisible(false);
        }
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
                    <p>{group.description}</p>
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
                    className="p-button-success"
                    onClick={() => setJoinDialogVisible(true)}
                />
                <Dropdown
                    value={sortKey}
                    options={sortOptions}
                    onChange={(e) => setSortKey(e.value)}
                    placeholder="Сортировать по"
                    className="p-mr-2"
                />
            </div>
            <DataView
                value={paginatedGroups}
                layout="list"
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
                <div className="p-field">
                    <label htmlFor="group-description">Описание группы</label>
                    <InputTextarea
                        id="group-description"
                        value={newGroupDescription}
                        onChange={(e) => setNewGroupDescription(e.target.value)}
                        placeholder="Введите описание"
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

            <Dialog
                header="Присоединиться к группе"
                visible={joinDialogVisible}
                style={{ width: '400px' }}
                onHide={() => setJoinDialogVisible(false)}
            >
                <div className="p-field">
                    <label htmlFor="group-id">ID группы</label>
                    <InputText
                        id="group-id"
                        value={groupIdToJoin}
                        onChange={(e) => setGroupIdToJoin(e.target.value)}
                        placeholder="Введите ID группы"
                        style={{ width: '100%' }}
                    />
                </div>
                <Button
                    label="Присоединиться"
                    icon="pi pi-check"
                    className="p-button-success"
                    onClick={handleJoinGroup}
                />
            </Dialog>
        </div>
    );
};

export default Groups;

