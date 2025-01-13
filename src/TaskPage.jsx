import React, {useEffect, useState} from 'react';
import {Card} from 'primereact/card';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Paginator} from 'primereact/paginator';
import './TaskPage.css';
import TaskService from "./services/TaskService";
import {Dropdown} from "primereact/dropdown";
import CommentService from "./services/CommentService";
import { InputTextarea } from "primereact/inputtextarea";

const TaskDialog = ({showTaskDialog, setShowTaskDialog, newTask, setNewTask, addTask}) => {
    return (
        <Dialog
            header="Создать новую задачу"
            visible={showTaskDialog}
            style={{width: '400px'}}
            modal
            className="task-dialog"
            onHide={() => setShowTaskDialog(false)}
        >
            <div className="dialog-field">
                <label htmlFor="title">Название задачи</label>
                <InputText
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Введите название задачи"
                    className="dialog-input"
                />
            </div>
            <div className="dialog-field">
                <label htmlFor="description">Описание задачи</label>
                <InputText
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Введите описание задачи"
                    className="dialog-input"
                />
            </div>
            <div className="dialog-field">
                <label htmlFor="deadline">Дедлайн</label>
                <InputText
                    id="deadline"
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                    className="dialog-input"
                />
            </div>
            <Button
                label="Создать задачу"
                icon="pi pi-check"
                className="p-button-success create-task-button"
                onClick={addTask}
            />
        </Dialog>
    );
};

const TasksGrid = ({tasks, toggleTaskToComplete}) => {
    const [filterByGroup, setFilterByGroup] = useState(null);
    const filteredTasks = tasks.filter(task => !filterByGroup || task.group.id == filterByGroup.id);

    const [currentPage, setCurrentPage] = useState(0);
    const tasksPerPage = 10;
    const startIndex = currentPage * tasksPerPage;
    const visibleTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);

    const [commentDialogVisible, setCommentDialogVisible] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);

    const onPageChange = (e) => setCurrentPage(e.page);

    const handleCommentTask = async (taskId) => {
        await CommentService.createComment({taskId: taskId, comment: commentText});
        alert("Комментарий оставлен");
        setCommentDialogVisible(false);
        setCommentText("");
    };

    return (
        <div className="tasks-grid-container">
            <div className="control-panel">
                <div className="filter-sort">
                    <div>
                        <label htmlFor="filterByGroup">Фильтр по группе:</label>
                        <Dropdown value={filterByGroup}
                                  onChange={(e) => setFilterByGroup(e.value)}
                                  placeholder="Все группы" options={[...new Map(tasks.map(task => [task.group.id, task.group])).values()]}
                                  optionLabel="name" showClear className="w-full md:w-14rem" />
                    </div>
                </div>
            </div>

            <div className="tasks-grid-wrapper">
                <div className="tasks-grid">
                    {visibleTasks.map((task) => (
                        <div key={task.id} className="task-card">
                            <Card
                                title={task.title}
                                style={{
                                    marginBottom: '1rem',
                                    background: task.completed ? '#d4edda' : '#f8d7da',
                                }}
                                className="task-card-content"
                            >
                                <p>
                                    <strong>Описание:</strong> {task.description}
                                </p>
                                <p>
                                    <strong>Дедлайн:</strong> {task.deadline}
                                </p>
                                <p>
                                    <strong>Группа:</strong> {task.group.name}
                                </p>
                                <div className="card-buttons">
                                    <Button
                                        label={task.completed ? 'Выполнено' : 'Готово'}
                                        disabled={task.completed}
                                        icon={'pi pi-check'}
                                        className={task.completed ? 'p-button-secondary' : 'p-button-success'}
                                        onClick={() => {
                                            if (!task.completed)
                                                toggleTaskToComplete(task.id)
                                        }}
                                    />
                                    <Button
                                        label=""
                                        icon="pi pi-pencil"
                                        className="p-button-primary"
                                        onClick={() => {
                                            setSelectedTask(task);
                                            setCommentDialogVisible(true);
                                        }}
                                    />
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            <Paginator
                first={startIndex}
                rows={tasksPerPage}
                totalRecords={filteredTasks.length}
                onPageChange={onPageChange}
                className="paginator"
            />

            <Dialog
                header="Написать комментарий"
                visible={commentDialogVisible}
                style={{ width: '400px' }}
                onHide={() => {setCommentDialogVisible(false); setCommentText("");}}
            >
                <div className="p-field">
                    <label htmlFor="comment">Текст комментария</label>
                    <InputTextarea id="comment" value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={5} cols={30} />
                </div>
                <Button
                    label="Оставить комментарий"
                    icon="pi pi-check"
                    className="p-button-success"
                    onClick={() => handleCommentTask(selectedTask.id)}
                />
            </Dialog>
        </div>
    );
};

const TasksPage = ({groupId}) => {
    const [tasks, setTasks] = useState([]);
    const [showTaskDialog, setShowTaskDialog] = useState(false);
    const [newTask, setNewTask] = useState({title: '', description: '', deadline: '', group: '', completed: false});

    useEffect(() => {
        const fetchTasks = async () => {
            const data = await TaskService.getUserTasks();
            setTasks(groupId ? data.filter(task => task.group.id == groupId) : data);
        };
        fetchTasks();
    }, [groupId]);

    const addTask = () => {
        setTasks([...tasks, {...newTask, id: Date.now()}]);
        setNewTask({title: '', description: '', deadline: '', group: '', completed: false});
        setShowTaskDialog(false);
    };

    const toggleTaskToComplete = async (taskId) => {
        await TaskService.completeUserTask(taskId)
        setTasks(tasks.map(task => (task.id == taskId ? {
            ...task,
            completed: true
        } : task)));
    };

    return (
        <div className="tasks-page">
            <TasksGrid tasks={tasks} toggleTaskToComplete={toggleTaskToComplete}/>
        </div>
    );
};

export default TasksPage;
