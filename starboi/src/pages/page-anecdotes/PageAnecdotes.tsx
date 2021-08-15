import "./PageAnecdotes.css";

import React from "react"; // TODO: line needed?

import anecdotesToType from "./anecdotes.json";

import { Anecdote, EMPTY_ANECDOTE } from "../../customTypes/Anecdote";

const importedAnecdotes: Anecdote[] = anecdotesToType;

// TODO: anexc
const generateUniqueKey = (a: Anecdote) => JSON.stringify(a);

type AnecdoteCardProps = {
  anecdote: Anecdote;
};

type ButtonSectionPropTypes = {
  anecdotes: Anecdote[];
  setAnecdotes: React.Dispatch<React.SetStateAction<Anecdote[]>>;
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

const AnecdoteCardSection = ({ anecdotes }: { anecdotes: Anecdote[] }) => (
  <section className="anecdote-card-section" contentEditable>
    {anecdotes.map((a) => (
      <AnecdoteCard anecdote={a} key={generateUniqueKey(a)} />
    ))}
  </section>
);

// TODO: compare to Rockstarboi, who uses Material <Button />
const ButtonSection = ({ anecdotes, setAnecdotes }: ButtonSectionPropTypes) => {
  const handleClickAddAnecdote = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnecdotes([{ ...EMPTY_ANECDOTE }].concat(anecdotes));
  };
  const handleClickImportAnecdotes = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {};
  const handleClickExportAnecdotes = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {};

  return (
    <section>
      <button onClick={handleClickAddAnecdote}>Add Anecdote</button>
      <button onClick={handleClickImportAnecdotes}>Import Anecdote JSON</button>
      <button onClick={handleClickExportAnecdotes}>Export Anecdote JSON</button>
    </section>
  );
};

export const PageAnecdotes = () => {
  const [anecdotes, setAnecdotes] = React.useState(importedAnecdotes);

  return (
    <>
      <ButtonSection anecdotes={anecdotes} setAnecdotes={setAnecdotes} />
      {anecdotes.length ? <AnecdoteCardSection anecdotes={anecdotes} /> : null}
    </>
  );
};
