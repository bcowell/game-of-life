import React from 'react';
import Game from './components/Game';
import './App.css';

const App = props =>
    <div className="App">
        <header>
            <h1>Game of Life</h1>
        </header>
        <Game />
    </div>

export default App;
