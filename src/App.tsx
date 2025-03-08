import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { getTodos, getUser } from './api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    setIsLoading(true);
    getTodos().then((data: Todo[]) => {
      setTodos(data);
      setFilteredTodos(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    let filtered = todos;

    if (filterStatus !== 'all') {
      filtered = todos.filter(todo =>
        filterStatus === 'completed' ? todo.completed : !todo.completed,
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredTodos(filtered);
  }, [filterStatus, searchQuery, todos]);

  const handleShowTodo = (todo: Todo) => {
    setIsLoading(true);
    setSelectedTodo(todo);
    getUser(todo.userId).then(userData => {
      setUser(userData);
      setIsLoading(false);
    });
  };

  const handleHideTodo = () => {
    setSelectedTodo(null); // Hide the selected todo
  };

  const closeModal = () => {
    setSelectedTodo(null);
    setUser(null);
  };

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />
            </div>

            <div className="block">
              {isLoading && <Loader />}
              <TodoList
                todos={filteredTodos}
                onShowTodo={handleShowTodo}
                selectedTodoId={selectedTodo?.id} // Pass selectedTodoId to TodoList
                onHideTodo={handleHideTodo} // Pass onHideTodo to TodoList
              />
            </div>
          </div>
        </div>
      </div>
      {selectedTodo && (
        <TodoModal
          todo={selectedTodo}
          user={user}
          onClose={closeModal}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
