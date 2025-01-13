import React, {useEffect, useState} from 'react';
import {Card} from 'primereact/card';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Paginator} from 'primereact/paginator';
import './TaskPage.css';
import TaskService from "./services/TaskService"; // Подключаем CSS

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

const TasksGrid = ({tasks, toggleTaskCompletion, deleteTask}) => {
    const [sortBy, setSortBy] = useState('deadline');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterByGroup, setFilterByGroup] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const tasksPerPage = 10;

    const sortedTasks = [...tasks].sort((a, b) => {
        if (sortBy == 'deadline') {
            return sortOrder == 'asc'
                ? new Date(a.deadline) - new Date(b.deadline)
                : new Date(b.deadline) - new Date(a.deadline);
        }
        if (sortBy == 'group') {
            return sortOrder == 'asc'
                ? a.group.localeCompare(b.group)
                : b.group.localeCompare(a.group);
        }
        if (sortBy == 'status') {
            return sortOrder == 'asc'
                ? a.completed - b.completed
                : b.completed - a.completed;
        }
        return 0;
    });

    const filteredTasks = filterByGroup
        ? sortedTasks.filter(task => task.group == filterByGroup)
        : sortedTasks;

    const startIndex = currentPage * tasksPerPage;
    const visibleTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);

    const onPageChange = (e) => setCurrentPage(e.page);

    return (
        <div className="tasks-grid-container">
            <div className="control-panel">
                <div className="filter-sort">
                    {/*<div>*/}
                    {/*    <label htmlFor="sortBy">Сортировать по:</label>*/}
                    {/*    <select*/}
                    {/*        id="sortBy"*/}
                    {/*        value={sortBy}*/}
                    {/*        onChange={(e) => setSortBy(e.target.value)}*/}
                    {/*        className="control-select"*/}
                    {/*    >*/}
                    {/*        <option value="deadline">Дедлайн</option>*/}
                    {/*        <option value="group">Группа</option>*/}
                    {/*        <option value="status">Статус</option>*/}
                    {/*    </select>*/}
                    {/*    <select*/}
                    {/*        value={sortOrder}*/}
                    {/*        onChange={(e) => setSortOrder(e.target.value)}*/}
                    {/*        className="control-select"*/}
                    {/*    >*/}
                    {/*        <option value="asc">По возрастанию</option>*/}
                    {/*        <option value="desc">По убыванию</option>*/}
                    {/*    </select>*/}
                    {/*</div>*/}
                    <div>
                        <label htmlFor="filterByGroup">Фильтр по группе:</label>
                        <select
                            id="filterByGroup"
                            value={filterByGroup}
                            onChange={(e) => setFilterByGroup(e.target.value)}
                            className="control-select"
                        >
                            <option value="">Все группы</option>
                            {[...new Set(tasks.map(task => task.group))].map(group => (
                                <option key={group} value={group}>
                                    {group}
                                </option>
                            ))}
                        </select>
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
                                    <strong>Группа:</strong> {task.group}
                                </p>
                                <div className="card-buttons">
                                    <Button
                                        label={task.completed ? 'Вернуть' : 'Готово'}
                                        icon={task.completed ? 'pi pi-times' : 'pi pi-check'}
                                        className={task.completed ? 'p-button-secondary' : 'p-button-success'}
                                        onClick={() => toggleTaskCompletion(task.id)}
                                    />
                                    <Button
                                        label="Удалить"
                                        icon="pi pi-trash"
                                        className="p-button-danger"
                                        onClick={() => deleteTask(task.id)}
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
            setTasks(groupId ? data.filter(task => task.group == groupId) : data);
        };
        fetchTasks();
    }, [groupId]);

    const addTask = () => {
        setTasks([...tasks, {...newTask, id: Date.now()}]);
        setNewTask({title: '', description: '', deadline: '', group: '', completed: false});
        setShowTaskDialog(false);
    };

    const toggleTaskCompletion = (id) => setTasks(tasks.map(task => (task.id == id ? {
        ...task,
        completed: !task.completed
    } : task)));

    const deleteTask = (id) => setTasks(tasks.filter(task => task.id !== id));

    return (
        <div className="tasks-page">
            <TasksGrid tasks={tasks} toggleTaskCompletion={toggleTaskCompletion} deleteTask={deleteTask}/>
        </div>
    );
};

export default TasksPage;
