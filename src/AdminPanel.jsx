import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const AdminPanel = ({ group, tasks, members, onUpdateGroup, onAssignTask, onDeleteTask }) => {
    const [groupName, setGroupName] = useState(group.name);
    const [selectedMember, setSelectedMember] = useState(null);
    const [roleDialogVisible, setRoleDialogVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [taskDialogVisible, setTaskDialogVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [assignedMember, setAssignedMember] = useState(null);

    const roles = ["User", "Administrator"];

    const handleRenameGroup = () => {
        onUpdateGroup({ ...group, name: groupName });
    };

    const handleChangeRole = () => {
        if (selectedMember && selectedRole) {
            const updatedMember = { ...selectedMember, role: selectedRole };
            onUpdateGroup({
                ...group,
                members: group.members.map((m) =>
                    m.id === updatedMember.id ? updatedMember : m
                ),
            });
            setRoleDialogVisible(false);
        }
    };

    const handleAssignTask = () => {
        if (selectedTask && assignedMember) {
            onAssignTask(selectedTask, assignedMember);
            setTaskDialogVisible(false);
        }
    };

    const renderTaskDialog = () => (
        <Dialog
            header="Назначить задачу"
            visible={taskDialogVisible}
            style={{ width: "400px" }}
            modal
            onHide={() => setTaskDialogVisible(false)}
        >
            <div className="p-field">
                <label htmlFor="task">Выберите задачу</label>
                <Dropdown
                    id="task"
                    value={selectedTask}
                    options={tasks}
                    onChange={(e) => setSelectedTask(e.value)}
                    optionLabel="title"
                    placeholder="Выберите задачу"
                />
            </div>
            <div className="p-field">
                <label htmlFor="member">Назначить участника</label>
                <Dropdown
                    id="member"
                    value={assignedMember}
                    options={members}
                    onChange={(e) => setAssignedMember(e.value)}
                    optionLabel="name"
                    placeholder="Выберите участника"
                />
            </div>
            <Button
                label="Назначить задачу"
                icon="pi pi-check"
                className="p-button-success"
                onClick={handleAssignTask}
            />
        </Dialog>
    );

    const renderRoleDialog = () => (
        <Dialog
            header="Изменить роль участника"
            visible={roleDialogVisible}
            style={{ width: "400px" }}
            modal
            onHide={() => setRoleDialogVisible(false)}
        >
            <div className="p-field">
                <label htmlFor="role">Выберите роль</label>
                <Dropdown
                    id="role"
                    value={selectedRole}
                    options={roles}
                    onChange={(e) => setSelectedRole(e.value)}
                    placeholder="Выберите роль"
                />
            </div>
            <Button
                label="Сохранить"
                icon="pi pi-check"
                className="p-button-success"
                onClick={handleChangeRole}
            />
        </Dialog>
    );

    return (
        <div>
            <div className="p-field">
                <label htmlFor="groupName">Название группы</label>
                <InputText
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Введите новое название"
                />
                <Button
                    label="Переименовать"
                    icon="pi pi-pencil"
                    className="p-button-primary"
                    style={{ marginLeft: "1rem" }}
                    onClick={handleRenameGroup}
                />
            </div>

            <h3>Участники группы</h3>
            <DataTable value={members} responsiveLayout="scroll">
                <Column field="name" header="Имя" />
                <Column field="role" header="Роль" />
                <Column
                    header="Действия"
                    body={(member) => (
                        <Button
                            label="Изменить роль"
                            icon="pi pi-user-edit"
                            className="p-button-secondary"
                            onClick={() => {
                                setSelectedMember(member);
                                setSelectedRole(member.role);
                                setRoleDialogVisible(true);
                            }}
                        />
                    )}
                />
            </DataTable>

            <h3>Задачи</h3>
            <DataTable value={tasks} responsiveLayout="scroll">
                <Column field="title" header="Название" />
                <Column field="description" header="Описание" />
                <Column field="deadline" header="Дедлайн" />
                <Column
                    header="Действия"
                    body={(task) => (
                        <div className="p-d-flex p-jc-between">
                            <Button
                                label="Назначить"
                                icon="pi pi-plus"
                                className="p-button-success"
                                onClick={() => {
                                    setSelectedTask(task);
                                    setTaskDialogVisible(true);
                                }}
                            />
                            <Button
                                label="Удалить"
                                icon="pi pi-trash"
                                className="p-button-danger"
                                onClick={() => onDeleteTask(task.id)}
                            />
                        </div>
                    )}
                />
            </DataTable>

            {renderTaskDialog()}
            {renderRoleDialog()}
        </div>
    );
};

export default AdminPanel;