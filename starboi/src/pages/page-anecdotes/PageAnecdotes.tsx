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

  const handleChangeImportAnecdotes = async (
    evOnChange: React.ChangeEvent<HTMLInputElement>
  ) => {
    const reader = new FileReader();

    reader.onload = async (evOnload) => {
      const json = evOnload.target?.result;
      const parsed = typeof json === "string" ? JSON.parse(json) : null;

      if (parsed) {
        setAnecdotes(parsed);
      }
    };

    if (evOnChange?.target?.files) {
      reader.readAsText(evOnChange.target.files[0]);
    }
  };

  const handleClickExportAnecdotes = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {};

  return (
    <section>
      <button className="buttonlike" onClick={handleClickAddAnecdote}>
        Add Anecdote
      </button>
      <label className="buttonlike" htmlFor="import-anecdote-input">
        Import Anecdote JSON
        <input
          id="import-anecdote-input"
          onChange={handleChangeImportAnecdotes}
          type="file"
        />
      </label>
      <button className="buttonlike" onClick={handleClickExportAnecdotes}>
        Export Anecdote JSON
      </button>
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
