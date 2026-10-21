import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ToDoList.css'

function ToDoList() {
    const [todoList, setTodoList] = useState([]);
    const [item, setItem] = useState("");

    const addItem = () => {
        if (item.trim() === "") return;
        
        const newTask = {
            id: crypto.randomUUID(),
            text: item,
            completed: false
        };

        setTodoList((prevTodoList) => [...prevTodoList, newTask]);
        setItem("");
    }

    const toggleComplete = (taskId) => {
        setTodoList((prevTodoList) => 
            prevTodoList.map((task) => 
                task.id === taskId ? {...task, completed: !task.completed} : task
            )
        );
    }

    const deleteTask = (taskId) => {
        setTodoList((prevTodoList) => prevTodoList.filter((task) => task.id !== taskId));
    }

    return (
        <div>
            <nav className='nav-bar'>
                <Link to='/' className='back-button'>
                    &larr; Back to Dashboard
                </Link>
                <h2 className='nav-title'>To-Do List</h2>
                
                <div className='nav-spacer'></div>
            </nav>

            <div className='todo-list-workspace'>
                <input type='text' value={item} placeholder='Enter new item' onChange={(e) => setItem(e.target.value)} />
                <button className='add-task-button' onClick={addItem}>Add Item</button>
                {todoList.length === 0 ? (
                    <p className='empty-list-message'>There is no item in the list yet!</p>
                ) : (
                    <ul className='list'>
                        {todoList.map((task) => (
                           <li className={`item-list ${task.completed ? 'completed' : ''}`} key={task.id}>
                                <label className="item-label">
                                    <input type='checkbox' checked={task.completed} onChange={() => toggleComplete(task.id)}/>
                                    <span className="item-text">{task.text}</span>
                                    <button className='delete-task-button' onClick={() => deleteTask(task.id)}>Delete</button>
                                </label>
                           </li> 
                        ))}
                    </ul>
                )} 
            </div>
        </div>
    );
}

export default ToDoList;