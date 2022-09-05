import React, { useCallback, useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const API = process.env.REACT_APP_API as string;

function App() {
  const [items, setItems] = useState<any[]>();
  const textRef = useRef<HTMLInputElement | null>(null);
  const [todo, setTodo] = useState<string>();

  const fetchData = useCallback(async () => {
    const res = await fetch(API);
    setItems(await res?.json());
  }, []);

  const save = async (item: any) => {
    await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    await fetchData();
    setTodo('');
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (textRef && textRef.current) {
      textRef.current.focus();
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <ul style={{ listStyle: 'none', width: '20rem' }}>
          <li>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                save({ text: todo });
              }}
            >
              <input
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                placeholder="New todo..."
                name="text"
                ref={textRef}
                style={{
                  width: '100%',
                  height: '4rem',
                  fontSize: '20px',
                  marginBottom: '1rem',
                }}
              ></input>
            </form>
          </li>
          {items?.map(({ id, text, done }) => (
            <li
              key={id}
              style={{
                padding: '1rem 1.4rem',
                border: '1px solid #ebebeb',
                borderRadius: 4,
                margin: 0,
                textAlign: 'left',
              }}
            >
              <input
                type="checkbox"
                checked={done}
                onChange={(e) => save({ id, text, done: e.target.checked })}
              ></input>
              <span style={{ textDecoration: done && 'line-through' }}>
                {text}
              </span>
            </li>
          ))}
        </ul>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
