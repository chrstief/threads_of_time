"use client";

import { Calendar1, Eraser, Pencil } from "lucide-react";
import { Bungee_Inline } from "next/font/google";
import { useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

const bungeeInline = Bungee_Inline({
  weight: "400",
  subsets: ["latin"],
});

type Event = { event: string; startYear: number; endYear: number };
const defaultEvents: Event[] = sortEvents([
  { event: "Arcades, VHS, and Mall Culture", startYear: 1991, endYear: 1999 },
  { event: "Smartphone Revolution", startYear: 2007, endYear: 2015 },
  { event: "COVID-19 Pandemic", startYear: 2019, endYear: 2023 },
  {
    event: "AOL, Chatrooms, and Instant Messaging",
    startYear: 1996,
    endYear: 2004,
  },
  { event: "Facebook Becomes the Internet", startYear: 2008, endYear: 2016 },
  {
    event: "ChatGPT",
    startYear: 2022,
    endYear: new Date().getFullYear(),
  },
]);

function sortEvents(events: Event[]): Event[] {
  // Sort by start year first
  const sorted = events.toSorted((a, b) => a.startYear - b.startYear);

  // Each row is an array of events
  const rows: Event[][] = [];

  for (const event of sorted) {
    // Try to find a row where it fits
    const targetRow = rows.find((row) => row.at(-1)!.endYear < event.startYear);
    if (targetRow) {
      targetRow.push(event);
    } else {
      rows.push([event]);
    }
  }
  return rows.flat();
}

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const popOverRef = useRef<HTMLDivElement>(null);
  const [deleteMode, setDeletemode] = useState(false);
  const [event, setEvent] = useState("");
  const [startYear, setStartYear] = useState("1991");
  const [endYear, setEndYear] = useState("1991");
  const [events, setEvents] = useLocalStorage<Event[]>(
    "events",
    defaultEvents,
    { initializeWithValue: false },
  );
  const bounds = {
    firstYear: Math.min(...events.map((event) => event.startYear)),
    lastYear: Math.max(...events.map((event) => event.endYear)),
  };
  const totalColumns = bounds.lastYear - bounds.firstYear + 1;
  const headRow = Array.from(
    { length: totalColumns },
    (_, index) => bounds.firstYear + index,
  );
  return (
    <div>
      {/* <ThemeController /> */}

      <div className="m-auto flex w-fit flex-col items-center">
        <div
          style={bungeeInline.style}
          className="pt-16 pb-10 text-center text-9xl"
        >
          Threads of Time
        </div>

        <div className="pb-12 text-center text-3xl">
          Your life is a story. See the plot unfold.
        </div>

        <div className="w-full pb-20">
          <div className="flex h-28 items-center justify-center bg-amber-50 text-black">
            Advertisement
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          className="btn btn-sm btn-primary rounded-field"
          title="Add event"
          style={{ anchorName: "--anchor-1" } as React.CSSProperties}
          onClick={() => {
            popOverRef.current?.togglePopover();
            requestAnimationFrame(() => {
              inputRef.current?.focus();
            });
          }}
        >
          <Pencil size={16} />
        </button>
        <div
          className="dropdown dropdown-left dropdown-center menu rounded-box bg-base-100 m-1 w-52 shadow-sm"
          popover="auto"
          ref={popOverRef}
          style={{ positionAnchor: "--anchor-1" } as React.CSSProperties}
        >
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!event || !startYear || !endYear) return;
              setEvents(
                sortEvents([
                  ...events,
                  {
                    event: event,
                    startYear: Number(startYear),
                    endYear: Number(endYear),
                  },
                ]),
              );
              popOverRef.current?.hidePopover();
              setEvent("");
              setStartYear(endYear);
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Event name"
              className="input"
              value={event}
              onChange={(e) => {
                setEvent(e.target.value);
              }}
              onMouseEnter={(e) => e.currentTarget.focus()}
              onMouseLeave={(e) => e.currentTarget.blur()}
            />
            <div className="flex items-center justify-between gap-1">
              <input
                type="number"
                min={0}
                placeholder="Start year"
                className="input text-center"
                value={startYear}
                onChange={(e) => {
                  setStartYear(e.target.value);
                }}
                onMouseEnter={(e) => e.currentTarget.focus()}
                onMouseLeave={(e) => e.currentTarget.blur()}
              />
              <div className="px-1">-</div>
              <input
                type="number"
                placeholder="End year"
                className="input text-center"
                value={Math.max(Number(endYear), Number(startYear))}
                onChange={(e) => {
                  setEndYear(e.target.value);
                }}
                onMouseEnter={(e) => e.currentTarget.focus()}
                onMouseLeave={(e) => e.currentTarget.blur()}
              />
            </div>
            <button type="submit" className="btn btn-primary rounded-field">
              Add
            </button>
          </form>
        </div>

        <button
          className={
            deleteMode
              ? "btn btn-sm btn-error rounded-field btn-active"
              : "btn btn-sm btn-primary rounded-field"
          }
          title="Erase events"
          onClick={() => {
            setDeletemode(!deleteMode);
          }}
        >
          <Eraser size={16} />
        </button>
      </div>

      <div className="w-full overflow-auto px-4 py-3">
        <div className="rounded-box bg-base-100 flex min-h-40 w-fit min-w-full shadow-sm">
          {events.length ? (
            <div
              className="grid min-w-max auto-rows-min gap-2 px-4 pt-2 pb-4"
              style={{ gridTemplateColumns: `repeat(${totalColumns},45px)` }}
            >
              {headRow.map((year) => (
                <div className="text-center" key={year}>
                  {year}
                </div>
              ))}
              {events.map((event, eventIndex) => {
                const colStart = event.startYear - bounds.firstYear + 1;
                const colEnd = event.endYear - bounds.firstYear + 2;
                return (
                  <div
                    key={event.event}
                    className="bg-primary rounded-field text-primary-content flex cursor-pointer justify-between px-2 py-1"
                    title={event.event}
                    style={{ gridColumnStart: colStart, gridColumnEnd: colEnd }}
                  >
                    <div className="truncate"> {event.event}</div>
                    <button
                      hidden={!deleteMode}
                      title={`Erase "${event.event}"`}
                      className="btn btn-xs btn-error rounded-field"
                      onClick={() => {
                        setEvents(sortEvents(events.toSpliced(eventIndex, 1)));
                      }}
                    >
                      <Eraser size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center">
              <Calendar1 />
              Add some events.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
