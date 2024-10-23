import { Timetable as TimetableView } from "@/components";
import { useAccountContext } from "@/context";
import { ServiceAPI } from "@/infrastructure";
import { Timetable } from "@/infrastructure/ServiceAPI";
import { Central as Layout } from "@/layouts";
import { scheduledEventToCalendarBlock } from "@/utils";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ViewTimetable.style.scss";

function ViewTimetable() {
  const { jwt } = useAccountContext();
  const { id } = useParams<{ id: string }>();
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const result = await ServiceAPI.fetchTimetable(id, jwt);
        setTimetable(result);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchTimetable();
  }, []);

  if (!timetable) {
    return (
      <Layout title={"Student Timetable"}>
        <h3>{error || "Loading..."}</h3>
      </Layout>
    );
  }

  return (
    <Layout title={timetable.name}>
      <TimetableView
        events={timetable.items.map((item: any) =>
          scheduledEventToCalendarBlock(item),
        )}
      />
    </Layout>
  );
}

export default ViewTimetable;
