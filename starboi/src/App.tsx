import "./App.css";

import React from "react"; // TODO: line needed?

import logo from "./logo.svg";
import { PageAnecdotes } from "./pages/page-anecdotes/PageAnecdotes";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Starboi Anecdote Organizer</h1>
        <a
          className="App-link"
          href="https://www.amazon.jobs/en/landing_pages/in-person-interview"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn the STAR method
        </a>
      </header>
      <PageAnecdotes />
    </div>
  );
}

export default App;
