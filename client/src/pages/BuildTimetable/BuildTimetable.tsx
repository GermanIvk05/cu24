import { useAccountContext } from "@/context";
import { ServiceAPI } from "@/infrastructure";
import { ScheduledEvent } from "@/infrastructure/ServiceAPI";
import { Central as Layout } from "@/layouts";
import { scheduledEventToCalendarBlock } from "@/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BuildTimetable.style.scss";
import { ResultsSection } from "./ResultsSection";
import { SearchSection } from "./SearchSection";
import { Section } from "./Section";
import { TimetableSection } from "./TimetableSection";
import { WorksheetSection } from "./WorksheetSection";

function BuildTimetable() {
  const { jwt } = useAccountContext();
  const [timetableName, setTimetableName] = useState(new Date().toISOString());
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<ScheduledEvent[]>([]);
  const navigate = useNavigate();

  const fetchScheduledEvents = async () => {
    const result = await ServiceAPI.fetchScheduledEvents();
    setScheduledEvents(result);
  };

  const createTimetable = async () => {
    const result = await ServiceAPI.createTimetable(
      timetableName,
      selectedEvents.map((event) => event.id.toString()),
      jwt,
    );

    navigate(`/timetables/${result.data.id}`);
  };

  const addEvent = (event: ScheduledEvent) => {
    setSelectedEvents([...selectedEvents, event]);
  };

  const removeEvent = (event: ScheduledEvent) => {
    setSelectedEvents(selectedEvents.filter((e) => e.id !== event.id));
  };

  return (
    <Layout title={"My Course Worksheet"}>
      <div className="BuildTimetable">
        <Section title="Search">
          <SearchSection onSearch={fetchScheduledEvents} />
        </Section>
        {scheduledEvents.length > 0 && (
          <Section title="Results">
            <ResultsSection
              scheduledEvents={scheduledEvents}
              addEvent={addEvent}
            />
          </Section>
        )}
        {selectedEvents.length > 0 && (
          <Section title="Worksheet">
            <WorksheetSection
              selectedEvents={selectedEvents}
              removeEvent={removeEvent}
              setTimetableName={setTimetableName}
              createTimetable={createTimetable}
            />
          </Section>
        )}
        <Section title="Draft Timetable">
          <TimetableSection
            selectedEvents={selectedEvents.map((event: ScheduledEvent) =>
              scheduledEventToCalendarBlock(event),
            )}
          />
        </Section>
      </div>
    </Layout>
  );
}

export default BuildTimetable;
