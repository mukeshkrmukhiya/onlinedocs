'use client';
import React, { useState, useEffect } from 'react';
import TodoCard from './todoCard';
import { LuPlusCircle } from 'react-icons/lu';
import { RxCrossCircled } from "react-icons/rx";
import CreateTodo from './createTodo';
import Loader from '../loader/loader';
import toast, { Toaster } from 'react-hot-toast';
const notify = () => toast('Here is your toast.');

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editTodo, setEditTodo] = useState(null);
    const [Loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch('/api/todo');
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            const data = await response.json();
            setTodos(data.todos);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching todos:', error.message);
        }
    };

    const createTodo = async (newTodo) => {
        try {
            const response = await fetch('/api/todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTodo),
            });
            if (!response.ok) {
                toast.error("Todo is Not created.")
                throw new Error('Failed to create todo');
            }
            const data = await response.json();
            toast.success('Task created!')
            fetchTodos(); // Refetch todos after creating a new one
            setIsModalOpen(false); // Close modal after submitting
        } catch (error) {
            console.error('Error creating todo:', error.message);
        }
    };
    const updateTodo = async (updatedTodo) => {
        try {
            const response = await fetch(`/api/todo/${updatedTodo._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTodo),
            });
            if (!response.ok) {
                toast.error("Updation Failled!.")
                throw new Error('Failed to update todo');
            }
            const data = await response.json();
            toast.success('Updated Successfuly!')
            fetchTodos(); // Refetch todos after updating
        } catch (error) {
            console.error('Error updating todo:', error.message);
        }
    };
    const deleteTodo = async (todoId) => {
        try {
          const response = await fetch(`/api/todo/${todoId}`, {
            method: 'DELETE',
          });
      
          if (!response.ok) {
            throw new Error('Failed to delete todo');
          }
      
          const data = await response.json();
      
          // Using toast.promise to handle deletion
          toast.promise(Promise.resolve(data), {
            loading: 'Deleting...', // Message to display while deletion is in progress
            success: 'Deleted!', // Message to display on successful deletion
            error: 'Not Deleted!', // Message to display on deletion failure
          });
      
          // Refetch todos after deleting
          fetchTodos();
        } catch (error) {
          console.error('Error deleting todo:', error.message);
        }
      };


    const handleEditTodo = (todo) => {
        setEditTodo(todo);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditTodo(null);
    };

    // const handleOutsideClick = (e) => {
    //     if (e.target.classList.contains('fixed')) {
    //         handleModalClose();
    //     }
    // }
    const sortedTodos = todos.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (Loading) {
        return (<div className='flex items-center justify-center h-screen'>
            <Loader />
        </div>
        );
    } else

        return (
            <main>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                />

                <div className="container  flex flex-wrap mx-auto bg-transparent shadow-lg rounded-lg overflow-hidden m-4">
                    {sortedTodos.map((todo) => (
                        <TodoCard
                            key={todo._id}
                            todo={todo}
                            onUpdate={updateTodo}
                            onDelete={deleteTodo}
                            onEdit={handleEditTodo}
                        />
                    ))}
                </div>
                {/* <div className="fixed bottom-4 right-4 m-8 cursor-pointer transition duration-300 transform  hover:scale-110" onClick={() => setIsModalOpen(true)}>
                    <LuPlusCircle className="text-blue-700 text-5xl md:text-6xl z-51 hover:text-white" />
                </div> */}
              {!Loading && !isModalOpen && (
                <div
                className="fixed bottom-4 right-4 m-8 cursor-pointer transition duration-300 transform hover:scale-110"
                onClick={() => setIsModalOpen(true)}
                >
                <LuPlusCircle className="text-blue-700 text-5xl md:text-6xl z-51 hover:text-white" />
                </div>
                )}


                {isModalOpen && (
                    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50" > {/*onClick={handleOutsideClick} */}
                        <div className="bg-white p-4 rounded-md shadow-md">
                            <CreateTodo
                                mode={editTodo ? 'update' : 'create'}
                                todoData={editTodo}
                                onSubmit={(formData) => {
                                    if (editTodo) {
                                        updateTodo({ ...editTodo, ...formData });
                                    } else {
                                        createTodo(formData);
                                    }
                                    handleModalClose();
                                }}
                                onClose={handleModalClose}
                            />
                        </div>
                    </div>
                )}

            </main>
        );
};

export default TodoList;
