import Image from "next/image";
import CalendarEvent from "./CalendarEvent";
import EventList from "./EventList";
import { MdEventAvailable } from "react-icons/md";

const EventCalendarContainer = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;
  return (
    <div className="bg-white p-4 rounded-md">
      <CalendarEvent />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <MdEventAvailable width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        <EventList dateParam={date} />
      </div>
    </div>
  );
};

export default EventCalendarContainer;