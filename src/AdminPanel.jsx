import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {Card} from "primereact/card";





const AdminPanel = ({ group, tasks, members, onUpdateGroup, onDeleteTask, onCreateTask, onUpdateTask, onDeleteMember }) => {
    const [groupDescription, setGroupDescription] = useState(group.description);
    const [groupName, setGroupName] = useState(group.name);
    const [selectedMember, setSelectedMember] = useState(null);

    const [roleDialogVisible, setRoleDialogVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");

    const [taskDialogVisible, setTaskDialogVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const [assignTaskDialogVisible, setAssignTaskDialogVisible] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);

    const [categoryDialogVisible, setCategoryDialogVisible] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: "", description: "" });

    const [commentsDialogVisible, setCommentsDialogVisible] = useState(false);

    const [categories, setCategories] = useState([
        { id: 1, name: "Категория 1", description: "Описание категории 1" },
        { id: 2, name: "Категория 2", description: "Описание категории 2" },
    ]);

    const comments = [
        { createdAt: "2025-01-09T10:30:00", text: "This task needs to be completed by tomorrow." },
        { createdAt: "2025-01-09T14:45:00", text: "Ensure to verify all details before submission." },
        { createdAt: "2025-01-10T09:15:00", text: "Task review completed, ready for final steps." },
        { createdAt: "2025-01-09T10:30:00", text: "This task needs to be completed by tomorrow." },
        { createdAt: "2025-01-09T14:45:00", text: "Ensure to verify all details before submission." },
        { createdAt: "2025-01-10T09:15:00", text: "Task review completed, ready for final steps." },
        { createdAt: "2025-01-09T10:30:00", text: "This task needs to be completed by tomorrow." },
        { createdAt: "2025-01-09T14:45:00", text: "Ensure to verify all details before submission." },
        { createdAt: "2025-01-10T09:15:00", text: "Task review completed, ready for final steps." },

    ];

    const [taskForm, setTaskForm] = useState({
        category: null,
        title: "",
        description: "",
        deadline: "",
        priority: 1,
        status: "",
        is_repeated: false,
        repeated_period: ""
    });
    const [createTaskDialogVisible, setCreateTaskDialogVisible] = useState(false);

    const roles = ["User", "Administrator"];

    const handleRenameGroup = () => {
        onUpdateGroup({ ...group, name: groupName });
    };

    const handleChangeRole = () => {
        if (selectedMember && selectedRole) {
            const updatedMember = { ...selectedMember, role: selectedRole };
            onUpdateGroup({
                ...group,
                members: group.members.map((m) => (m.id === updatedMember.id ? updatedMember : m)),
            });
            setRoleDialogVisible(false);
        }
    };
    const handleAssignTask = () =>{
        console.log("Человек: " + selectedPerson.name + " получил задачу " + selectedTask.title)
        setAssignTaskDialogVisible(false);
    }

    const handleCreateCategory = () => {
        setCategories([...categories, { ...newCategory, id: categories.length + 1 }]);
        setNewCategory({ name: "", description: "" });
        setCategoryDialogVisible(false);
    };

    const handleCreateTask = () => {
        onCreateTask(taskForm);
        setCreateTaskDialogVisible(false);
        setTaskForm({
            category: null,
            title: "",
            description: "",
            deadline: "",
            priority: 1,
            status: "",
            is_repeated: false,
            repeated_period: ""
        });
    };

    const handleUpdateTask = () => {
        onUpdateTask(selectedTask);
        setTaskDialogVisible(false);
    };

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

    const renderCommentsDialog = () => {
        return (
            <Dialog
                header={`Comments for Task`}
                visible={commentsDialogVisible}
                style={{ width: "50vw" }}
                onHide={() => setCommentsDialogVisible(false)}
            >
                <div className="comments-container">
                    {comments.map((comment, index) => (
                        <Card
                            key={index}
                            title={new Date(comment.createdAt).toLocaleString()}
                            style={{ marginBottom: "1rem" }}
                        >
                            <p>{comment.text}</p>
                        </Card>
                    ))}
                </div>
            </Dialog>
        );
    };

    const renderCategoryDialog = () => (
        <Dialog
            header="Создать категорию"
            visible={categoryDialogVisible}
            style={{ width: "400px" }}
            modal
            onHide={() => setCategoryDialogVisible(false)}
        >
            <div className="p-field">
                <label htmlFor="categoryName">Название категории</label>
                <InputText
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Введите название категории"
                />
            </div>
            <div className="p-field">
                <label htmlFor="categoryDescription">Описание категории</label>
                <InputText
                    id="categoryDescription"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Введите описание категории"
                />
            </div>
            <Button
                label="Создать"
                icon="pi pi-check"
                className="p-button-success"
                onClick={handleCreateCategory}
            />
        </Dialog>
    );

    const renderAssignTaskDialog = () => (
        <Dialog
            header="Назначить задачу"
            visible={assignTaskDialogVisible}
            style={{ width: "400px" }}
            modal
            onHide={() => setAssignTaskDialogVisible(false)}
        >
            <div className="p-field">
                <label htmlFor="task">Выберите задачу</label>
                <Dropdown
                    id="task"
                    value={null}
                    options={tasks}
                    onChange={(e) => setSelectedTask(e.value)}
                    placeholder="выберите задачу"
                />
            </div>
            <Button
                label="Выдать"
                icon="pi pi-check"
                className="p-button-success"
                onClick={handleAssignTask}
            />
        </Dialog>
    );

    const renderTaskDialog = () => (
        <Dialog
            header="Редактировать задачу"
            visible={taskDialogVisible}
            style={{ width: "500px" }}
            modal
            onHide={() => setTaskDialogVisible(false)}
        >
            <div className="p-field">
                <label htmlFor="category">Категория</label>
                <Dropdown
                    id="category"
                    value={selectedTask?.category}
                    options={categories}
                    onChange={(e) => setSelectedTask({ ...selectedTask, category: e.value })}
                    optionLabel="name"
                    placeholder="Выберите категорию"
                />
            </div>
            <div className="p-field">
                <label htmlFor="title">Название</label>
                <InputText
                    id="title"
                    value={selectedTask?.title}
                    onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                />
            </div>
            <div className="p-field">
                <label htmlFor="description">Описание</label>
                <InputText
                    id="description"
                    value={selectedTask?.description}
                    onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                />
            </div>
            <div className="p-field">
                <label htmlFor="deadline">Дедлайн</label>
                <InputText
                    id="deadline"
                    value={selectedTask?.deadline}
                    onChange={(e) => setSelectedTask({ ...selectedTask, deadline: e.target.value })}
                />
            </div>
            <div className="p-field">
                <label htmlFor="priority">Приоритет</label>
                <InputText
                    id="priority"
                    type="number"
                    value={selectedTask?.priority}
                    onChange={(e) => setSelectedTask({ ...selectedTask, priority: +e.target.value })}
                />
            </div>
            <div className="p-field">
                <label htmlFor="status">Статус</label>
                <InputText
                    id="status"
                    value={selectedTask?.status}
                    onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
                />
            </div>
            <div className="p-field">
                <label htmlFor="is_repeated">Повторяется</label>
                <Dropdown
                    id="is_repeated"
                    value={selectedTask?.is_repeated}
                    options={[{ label: "Да", value: true }, { label: "Нет", value: false }]}
                    onChange={(e) => setSelectedTask({ ...selectedTask, is_repeated: e.value })}
                />
            </div>
            <div className="p-field">
                <label htmlFor="repeated_period">Период повторения</label>
                <InputText
                    id="repeated_period"
                    value={selectedTask?.repeated_period}
                    onChange={(e) => setSelectedTask({ ...selectedTask, repeated_period: e.target.value })}
                />
            </div>
            <Button
                label="Сохранить изменения"
                icon="pi pi-check"
                className="p-button-success"
                onClick={handleUpdateTask}
            />
        </Dialog>
    );

    const renderCreateTaskDialog = () => (
        <Dialog
            header="Создать задачу"
            visible={createTaskDialogVisible}
            style={{ width: "500px" }}
            modal
            onHide={() => setCreateTaskDialogVisible(false)}
        >
            <div className="p-field">
                <label htmlFor="category">Категория</label>
                <Dropdown
                    id="category"
                    value={taskForm.category}
                    options={categories}
                    onChange={(e) => setTaskForm({ ...taskForm, category: e.value })}
                    optionLabel="name"
                    placeholder="Выберите категорию"
                />
            </div>
            <div className="p-field">
                <label htmlFor="title">Название</label>
                <InputText
                    id="title"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                />
            </div>
            <div className="p-field">
                <label htmlFor="description">Описание</label>
                <InputText
                    id="description"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                />
            </div>
            <div className="p-field">
                <label htmlFor="deadline">Дедлайн</label>
                <InputText
                    id="deadline"
                    value={taskForm.deadline}
                    onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                />
            </div>
            <div className="p-field">
                <label htmlFor="priority">Приоритет</label>
                <InputText
                    id="priority"
                    type="number"
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: +e.target.value })}
                />
            </div>
            <div className="p-field">
                <label htmlFor="status">Статус</label>
                <InputText
                    id="status"
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                />
            </div>
            <div className="p-field">
                <label htmlFor="is_repeated">Повторяется</label>
                <Dropdown
                    id="is_repeated"
                    value={taskForm.is_repeated}
                    options={[{ label: "Да", value: true }, { label: "Нет", value: false }]}
                    onChange={(e) => setTaskForm({ ...taskForm, is_repeated: e.value })}
                />
            </div>
            <div className="p-field">
                <label htmlFor="repeated_period">Период повторения</label>
                <InputText
                    id="repeated_period"
                    value={taskForm.repeated_period}
                    onChange={(e) => setTaskForm({ ...taskForm, repeated_period: e.target.value })}
                />
            </div>
            <Button
                label="Создать задачу"
                icon="pi pi-check"
                className="p-button-success"
                onClick={handleCreateTask}
            />
        </Dialog>
    );

    return (
        <div>
            <div className="p-field">
                <div className="p-field">
                    <label htmlFor="groupName">Название группы</label>
                    <InputText
                        id="groupName"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Введите новое название"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="groupDescription">Описание группы</label>
                    <InputText
                        id="groupDescription"
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                        placeholder="Введите новое описание"
                    />
                </div>
                <Button
                    label="Сохранить изменения"
                    icon="pi pi-save"
                    className="p-button-primary"
                    style={{ marginLeft: "1rem" }}
                    onClick={handleRenameGroup}
                />
            </div>

            <h3>Участники группы</h3>
            <DataTable paginator rows={5} value={members} responsiveLayout="scroll">
                <Column field="name" header="Имя" sortable/>
                <Column field="role" header="Роль" sortable/>
                <Column
                    header="Действия"
                    body={(member) => (
                        <div>
                            <Button
                                label=""
                                icon="pi pi-user-edit"
                                className="p-button-primary"
                                onClick={() => {
                                    setSelectedMember(member);
                                    setSelectedRole(member.role);
                                    setRoleDialogVisible(true);
                                }}
                            />
                            <Button
                                label=""
                                icon="pi pi-trash"
                                className="p-button-danger"
                                onClick={() => onDeleteMember(member.id)}
                            />
                            <Button
                                label=""
                                icon="pi pi-plus"
                                className="p-button-success"

                                onClick={() => {
                                    setSelectedPerson(member)
                                    setAssignTaskDialogVisible(true)
                                }}
                            />
                        </div>
                    )}
                />
            </DataTable>

            <h3>Задачи</h3>
            <Button
                label="Создать категорию"
                icon="pi pi-plus"
                className="p-button-success"
                style={{ marginBottom: "1rem", marginRight:"1rem"}}
                onClick={() => setCategoryDialogVisible(true)}
            />

            <Button
                label="Создать задачу"
                icon="pi pi-plus"
                className="p-button-success"
                style={{ marginBottom: "1rem" }}
                onClick={() => setCreateTaskDialogVisible(true)}
            />

            <DataTable value={categories} paginator rows={5} responsiveLayout="scroll">
                <Column field="name" header="Название категории" sortable/>
                <Column field="description" header="Описание категории" sortable/>
            </DataTable>

            <DataTable value={tasks} paginator rows={5}  responsiveLayout="scroll">
                <Column field="title" header="Название" sortable/>
                <Column field="description" header="Описание" sortable/>
                <Column field="deadline" header="Дедлайн" sortable/>
                <Column
                    header="Действия"
                    body={(task) => (
                        <div className="p-d-flex p-jc-between">
                            <Button
                                label=""
                                icon="pi pi-pencil"
                                className="p-button-primary"
                                onClick={() => {
                                    setSelectedTask(task);
                                    setTaskDialogVisible(true);
                                }}
                            />
                            <Button
                                label=""
                                icon="pi pi-trash"
                                className="p-button-danger"
                                onClick={() => onDeleteTask(task.id)}
                            />
                            <Button
                                label=""
                                icon="pi pi-comments"
                                className="p-button-help"
                                onClick={() => {
                                    setSelectedTask(task);
                                    setCommentsDialogVisible(true)
                                }}
                            />
                        </div>
                    )}
                />
            </DataTable>

            {renderTaskDialog()}
            {renderRoleDialog()}
            {renderCreateTaskDialog()}
            {renderCategoryDialog()}
            {renderAssignTaskDialog()}
            {renderCommentsDialog()}
        </div>
    );
};

export default AdminPanel;
