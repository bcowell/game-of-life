import React from 'react';
import Board from './components/Board';
import './App.css';

const App = props =>

    <div className="App">
        <header>
            <h1>Game of Life</h1>
        </header>
        <Board />
    </div>

export default App;
