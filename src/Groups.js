import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [joinDialogVisible, setJoinDialogVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDescription, setNewGroupDescription] = useState('');
    const [groupIdToJoin, setGroupIdToJoin] = useState('');
    const [sortKey, setSortKey] = useState(null); // Сортировка
    const [first, setFirst] = useState(0); // Пагинация
    const [rows, setRows] = useState(5);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = localStorage.getItem('user');
                
                const response = await fetch('/api/groups', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }

                const data = await response.json();
                setGroups(data);
            } catch (error) {
                console.error('Ошибка при получении групп:', error);
            }
        };

        fetchGroups();
    }, []);

    const sortOptions = [
        { label: 'По имени', value: 'name' },
        { label: 'По количеству задач', value: 'taskCount' }
    ];

    const handleCreateGroup = async () => {
        if (newGroupName && newGroupDescription) {
            try {
                const token = localStorage.getItem('user');
                
                const response = await fetch('/api/groups', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: newGroupName,
                        description: newGroupDescription
                    })
                });

                if (!response.ok) {
                    throw new Error('Ошибка при создании группы');
                }

                const newGroup = await response.json();
                setGroups([...groups, newGroup]);
                setNewGroupName('');
                setNewGroupDescription('');
                setDialogVisible(false);
            } catch (error) {
                console.error('Ошибка при создании группы:', error);
            }
        }
    };

    const handleJoinGroup = async () => {
        if (groupIdToJoin) {
            try {
                const token = localStorage.getItem('user');
                
                const response = await fetch(`/api/groups/${groupIdToJoin}/members`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userRole: 'MEMBER'
                    })
                });

                if (!response.ok) {
                    throw new Error('Ошибка при присоединении к группе');
                }

                // Обновляем список групп после успешного присоединения
                const fetchGroupsResponse = await fetch('/api/groups', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (fetchGroupsResponse.ok) {
                    const updatedGroups = await fetchGroupsResponse.json();
                    setGroups(updatedGroups);
                }

                setGroupIdToJoin('');
                setJoinDialogVisible(false);
            } catch (error) {
                console.error('Ошибка при присоединении к группе:', error);
            }
        }
    };

    const handleLeaveGroup = async (groupId) => {
        try {
            const token = localStorage.getItem('user');
            
            const response = await fetch(`/api/groups/${groupId}/delete`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при выходе из группы');
            }

            setGroups(groups.filter(group => group.id !== groupId));
        } catch (error) {
            console.error('Ошибка при выходе из группы:', error);
        }
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
                                onClick={() => window.location.href = `/groups/${group.id}`}
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

