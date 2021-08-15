import "./PageAnecdotes.css";

import React from "react"; // TODO: line needed?

import { Anecdote, EMPTY_ANECDOTE } from "../../customTypes/Anecdote";
import anecdotesToType from "./anecdotes.json";

const importedAnecdotes: Anecdote[] = anecdotesToType;

const generateUniqueKey = (a: Anecdote) => JSON.stringify(a);

type AnecdoteCardProps = {
  anecdote: Anecdote;
};

type ButtonSectionProps = {
  anecdotes: Anecdote[];
  andecdoteSectionRef: React.RefObject<HTMLElement>;
  setAnecdotes: React.Dispatch<React.SetStateAction<Anecdote[]>>;
};

type AnecdoteCardSectionProps = {
  anecdotes: Anecdote[];
  andecdoteSectionRef: React.RefObject<HTMLElement>;
};

const AnecdoteCard = ({ anecdote }: AnecdoteCardProps) => (
  <div className="anecdote-card">
    <h3>{anecdote.name}</h3>
    <p>{anecdote.date}</p>
    <ol>
      <li>Employer: {anecdote.employer}</li>
      <li>Situation: {anecdote.situation}</li>
      <li>Obstacle: {anecdote.obstacle}</li>
      <li>Task: {anecdote.task}</li>
      <li>Action: {anecdote.action}</li>
      <li>Result: {anecdote.result}</li>
    </ol>
    <p>Notes: {anecdote.notes || "N/A"}</p>
  </div>
);

const parseAnecdotesByHeadings = (
  headings: HTMLHeadingElement[]
): Anecdote[] => {
  const parsedAnecdotes: Anecdote[] = [];

  for (const heading of headings) {
    const newAnecdote = {
      name: heading.textContent || "",
      date: "",
      employer: "",
      situation: "",
      obstacle: "",
      task: "",
      action: "",
      result: "",
      notes: "",
    };

    parsedAnecdotes.push(newAnecdote);
  }

  return parsedAnecdotes;
};

const AnecdoteCardSection = ({
  anecdotes,
  andecdoteSectionRef,
}: AnecdoteCardSectionProps) => {
  return (
    <section
      ref={andecdoteSectionRef}
      className="anecdote-card-section"
      contentEditable
    >
      {anecdotes.map((a) => (
        <AnecdoteCard anecdote={a} key={generateUniqueKey(a)} />
      ))}
    </section>
  );
};

// TODO: compare to Rockstarboi, who uses Material <Button />
const ButtonSection = ({
  anecdotes,
  andecdoteSectionRef,
  setAnecdotes,
}: ButtonSectionProps) => {
  // note: this whole dom parsing thing is basically an anti-pattern
  const updateAnecdoteState = () => {
    const result = andecdoteSectionRef.current;
    const anecdoteHeadings =
      result instanceof HTMLElement
        ? Array.from(result.getElementsByTagName("h3"))
        : [];

    if (anecdoteHeadings.length) {
      const newAnecdotes = parseAnecdotesByHeadings(anecdoteHeadings);
      setAnecdotes(newAnecdotes);
    } else {
      setAnecdotes([]);
    }
  };

  const handleClickAddAnecdote = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnecdotes([{ ...EMPTY_ANECDOTE }].concat(anecdotes));
  };

  const handleChangeImportAnecdotes = async (
    evOnChange: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateAnecdoteState();
    const reader = new FileReader();

    // note: this will not trigger if u re-load the same file twice in a row
    //   this seems to be a browser constraint, not a React thing.
    reader.onload = async (evOnload) => {
      const json = evOnload.target?.result;
      const parsed = typeof json === "string" ? JSON.parse(json) : null;

      if (parsed) {
        setAnecdotes(parsed);
      }
    };

    if (evOnChange?.target?.files?.length) {
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
          onClick={updateAnecdoteState}
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
  const andecdoteSectionRef = React.useRef(null);

  return (
    <>
      <ButtonSection
        anecdotes={anecdotes}
        andecdoteSectionRef={andecdoteSectionRef}
        setAnecdotes={setAnecdotes}
      />
      {anecdotes.length ? (
        <AnecdoteCardSection
          anecdotes={anecdotes}
          andecdoteSectionRef={andecdoteSectionRef}
        />
      ) : null}
    </>
  );
};
