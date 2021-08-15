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
    <p className="anecdote-date">{anecdote.date}</p>
    <ol>
      <li>
        Employer: <span className="anecdote-employer">{anecdote.employer}</span>
      </li>
      <li>
        Situation:{" "}
        <span className="anecdote-situation">{anecdote.situation}</span>
      </li>
      <li>
        Obstacle: <span className="anecdote-obstacle">{anecdote.obstacle}</span>
      </li>
      <li>
        Task: <span className="anecdote-task">{anecdote.task}</span>
      </li>
      <li>
        Action: <span className="anecdote-action">{anecdote.action}</span>
      </li>
      <li>
        Result: <span className="anecdote-result">{anecdote.result}</span>
      </li>
    </ol>
    <p>
      Notes: <span className="anecdote-notes">{anecdote.notes || "N/A"}</span>
    </p>
  </div>
);

const parseAnecdotesByHeadings = (
  headings: HTMLHeadingElement[]
): Anecdote[] => {
  const parsedAnecdotes: Anecdote[] = [];

  for (const heading of headings) {
    const elCard = heading.parentElement;

    if (elCard === null) {
      console.log({ errorMessage: "unexpected null elCard" });
      return [];
    }

    const newAnecdote = {
      name: heading.textContent || "",
      date:
        elCard.getElementsByClassName("anecdote-date")[0]?.textContent || "",
      employer:
        elCard.getElementsByClassName("anecdote-employer")[0]?.textContent ||
        "",
      situation:
        elCard.getElementsByClassName("anecdote-situation")[0]?.textContent ||
        "",
      obstacle:
        elCard.getElementsByClassName("anecdote-obstacle")[0]?.textContent ||
        "",
      task:
        elCard.getElementsByClassName("anecdote-task")[0]?.textContent || "",
      action:
        elCard.getElementsByClassName("anecdote-action")[0]?.textContent || "",
      result:
        elCard.getElementsByClassName("anecdote-result")[0]?.textContent || "",
      notes:
        elCard.getElementsByClassName("anecdote-notes")[0]?.textContent || "",
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
  const downloadAnecdoteJson = async () => {
    const data = updateAnecdoteState();
    const fileName = `anecdotes-${new Date().getTime()}`;
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = href;
    link.download = fileName + ".json";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      return newAnecdotes;
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

  const handleClickExportAnecdotes = () => {
    downloadAnecdoteJson();
  };

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
