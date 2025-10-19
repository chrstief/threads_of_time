"use client";

import { Calendar1, Eraser, Pencil } from "lucide-react";
import { Bungee_Inline } from "next/font/google";
import { useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

const bungeeInline = Bungee_Inline({
  weight: "400",
  subsets: ["latin"],
});

type Event = { id: string; event: string; start: string; end: string };
const defaultEvents: Event[] = sortEvents([
  {
    id: crypto.randomUUID(),
    event: "Arcades, VHS, and Mall Culture",
    start: "1991-01",
    end: "1999-12",
  },
  {
    id: crypto.randomUUID(),
    event: "AOL, Chatrooms, and Instant Messaging",
    start: "1996-03",
    end: "2004-06",
  },
  {
    id: crypto.randomUUID(),
    event: "Smartphone Revolution",
    start: "2007-01",
    end: "2015-09",
  },
  {
    id: crypto.randomUUID(),
    event: "Facebook becomes the Internet",
    start: "2008-01",
    end: "2016-12",
  },
  {
    id: crypto.randomUUID(),
    event: "COVID-19 Pandemic",
    start: "2019-12",
    end: "2023-05",
  },
  {
    id: crypto.randomUUID(),
    event: "ChatGPT",
    start: "2022-11",
    end: `${new Date().getFullYear()}-12`,
  },
]);

function sortEvents(events: Event[]): Event[] {
  // Sort by start year first
  const sorted = events.toSorted((a, b) => a.start.localeCompare(b.start));

  // Each row is an array of events
  const rows: Event[][] = [];

  for (const event of sorted) {
    // Try to find a row where it fits
    const targetRow = rows.find((row) => row.at(-1)!.end < event.start);
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
  const [start, setStart] = useState("1991-01");
  const [end, setEnd] = useState("1991-01");
  const [events, setEvents] = useLocalStorage<Event[]>(
    "events",
    defaultEvents,
    { initializeWithValue: false },
  );
  const bounds = {
    firstYear: Number(events[0].start.split("-")[0]) - 1,
    lastYear:
      Math.max(...events.map((event) => Number(event.end.split("-")[0]))) + 1,
  };
  const numberOfYears = bounds.lastYear - bounds.firstYear + 1;
  const headRow = Array.from(
    { length: numberOfYears },
    (_, index) => bounds.firstYear + index,
  );
  const gridLineNames = headRow.flatMap((year) =>
    Array.from(
      { length: 12 },
      (_, index) => `y${year}m${String(index + 1).padStart(2, "0")}`,
    ),
  );
  function getNextMonth(gridLineName: string) {
    const startIndex = gridLineNames.indexOf(gridLineName);
    const nextGridLineName = gridLineNames[startIndex + 1];
    return nextGridLineName;
  }

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
              if (!event || !start || !end) return;
              setEvents(
                sortEvents([
                  ...events,
                  {
                    id: crypto.randomUUID(),
                    event: event,
                    start: start,
                    end: end,
                  },
                ]),
              );
              popOverRef.current?.hidePopover();
              setEvent("");
              setStart(end);
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
            <input
              type="month"
              className="input text-center"
              value={start}
              onChange={(e) => {
                setStart(e.target.value);
                if (e.target.value > end) setEnd(e.target.value);
              }}
              onMouseEnter={(e) => e.currentTarget.focus()}
              onMouseLeave={(e) => e.currentTarget.blur()}
            />
            <input
              type="month"
              className="input text-center"
              value={end}
              onChange={(e) => {
                setEnd(e.target.value);
              }}
              onBlur={() => {
                if (start > end) setEnd(start);
              }}
              onMouseEnter={(e) => e.currentTarget.focus()}
              onMouseLeave={(e) => e.currentTarget.blur()}
            />
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
              className="grid min-w-max auto-rows-min px-4 pt-2 pb-4"
              style={{
                gridTemplateColumns: gridLineNames
                  .map((gridLineName) => `[${gridLineName}]`)
                  .join(" 4px "),
              }}
            >
              {headRow.map((year) => (
                <div
                  className="text-center"
                  key={year}
                  style={{
                    gridColumnStart: `y${year}m01`,
                    gridColumnEnd: getNextMonth(`y${year}m12`),
                  }}
                >
                  {year}
                </div>
              ))}
              {events.map((event) => (
                <button
                  key={event.id}
                  className={
                    deleteMode
                      ? "hover:btn-error btn btn-primary btn-sm rounded-field m-0.5 truncate"
                      : "btn btn-primary btn-sm rounded-field m-0.5 truncate"
                  }
                  title={event.event}
                  style={{
                    gridColumnStart: `y${event.start.replace("-", "m")}`,
                    gridColumnEnd: getNextMonth(
                      `y${event.end.replace("-", "m")}`,
                    ),
                  }}
                  onClick={() => {
                    if (!deleteMode) return;
                    setEvents(
                      sortEvents(events.filter((e) => e.id !== event.id)),
                    );
                  }}
                >
                  {event.event}
                </button>
              ))}
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
