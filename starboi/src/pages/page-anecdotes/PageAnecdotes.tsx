import "./PageAnecdotes.css";

import React from "react"; // TODO: line needed?

import anecdotesToType from "./anecdotes.json";

import type { Anecdote } from "../../customTypes/Anecdote";

const anecdotes: Anecdote[] = anecdotesToType;

// TODO: anexc
const generateUniqueKey = (a: Anecdote) => JSON.stringify(a);

type AnecdoteCardProps = {
  anecdote: Anecdote;
};

const AnecdoteCard = ({ anecdote }: AnecdoteCardProps) => (
  <div className="anecdote-card">
    <h3>{anecdote.name}</h3>
    <ol>
      <li>Situation: {anecdote.situation}</li>
      <li>Obstacle: {anecdote.obstacle}</li>
      <li>Task: {anecdote.task}</li>
      <li>Action: {anecdote.action}</li>
      <li>Result: {anecdote.result}</li>
    </ol>
  </div>
);

export const PageAnecdotes = () =>
  Array.isArray(anecdotes) ? (
    <section className="anecdote-card-section">
      {anecdotes.map((a) => (
        <AnecdoteCard anecdote={a} key={generateUniqueKey(a)} />
      ))}
    </section>
  ) : null;
