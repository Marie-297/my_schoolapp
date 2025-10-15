"use client";

import { Calendar as BigCalendarComponent, momentLocalizer, View, Views, SlotInfo, } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import Holidays from "date-holidays";

const localizer = momentLocalizer(moment);
const Calendar = BigCalendarComponent as unknown as React.ComponentType<any>;

const timeSlots = [
  { start: '08:00', end: '09:00' },
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '10:30' },
  { start: '10:30', end: '11:30' },
  { start: '11:30', end: '12:30' },
  { start: '12:30', end: '13:00' },
  { start: '13:00', end: '14:00' },
  { start: '14:00', end: '15:00' },
]

const BigCalendar = ({
  data,
}: {
  data: { title: string; start: Date; end: Date }[];
}) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<
    { title: string; allDay?: boolean }[]
  >([]); 
  const [holidayDates, setHolidayDates] = useState<string[]>([]);


  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  useEffect(() => {
    const hd = new Holidays("GH");
    const year = new Date().getFullYear();
    const holidays = hd.getHolidays(year);
  
    const holidayMap = new Map<string, string>();
    const holidayStrDates: string[] = [];
    const formattedHolidays = holidays.map((holiday) => {
      const dateStr = new Date(holiday.date).toDateString();
      holidayMap.set(dateStr, holiday.name);
      holidayStrDates.push(dateStr);
      return {
        title: holiday.name,
        start: new Date(holiday.date),
        end: new Date(holiday.date),
        allDay: true,
      };
    });
    const filteredUserData = data.filter(
      (event) => !holidayMap.has(new Date(event.start).toDateString())
    );
    const mergedEvents = [...filteredUserData, ...formattedHolidays];
  
    setEvents(mergedEvents);
    setHolidayDates(holidayStrDates);
  }, [date, data]);  

  const CustomEvent = ({ event }: { event: { title: string; sstart?: Date; end?: Date, allDay?: boolean } }) => {
    const [subject, teacher] = event.title.split("\n");
    return (
      <div title={event.title} className="flex flex-col justify-center items-center text-center h-full">
      <span style={{ fontWeight: "bold" }}>{subject?.trim()}</span>
      <br />
      <span className="text-xs">{teacher?.trim()}</span>
    </div>
    );
  };

  const CustomTimeGutterHeader = () => (
    <div style={{ paddingLeft: '4px', fontWeight: 'bold' }}>Time</div>
  );

  const customTimeGutterFormat = (date: Date, culture: string, localizerInstance: any) => {
    const hour = date.getHours();
    const minute = date.getMinutes();

    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    const foundSlot = timeSlots.find(slot => slot.start === timeString);

    if (foundSlot) {
      return `${foundSlot.start} - ${foundSlot.end}`;
    }
    return ""; 
  };

  

  return (
    <Calendar
      localizer={localizer}
      events={events}
      date={date}
      onNavigate={(newDate: Date) => setDate(newDate)}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      style={{ height: "98%" }}
      onView={handleOnChangeView}
      min={new Date(2025, 1, 0, 8, 0, 0)}
      max={new Date(2025, 1, 0, 16, 0, 0)}
      step={30}
      timeslots={1}
      components={{
        event: CustomEvent,
        timeGutterHeader: CustomTimeGutterHeader,
      }}
      formats={{
        timeGutterFormat: customTimeGutterFormat,
      }}
      dayPropGetter={(date: Date) => {
        const isHoliday = holidayDates.includes(date.toDateString());
        if (isHoliday) {
          return {
            style: {
              backgroundColor: "#fef9c3",
            },
          };
        }
        return {};
      }}
      
    />
  );
};

export default BigCalendar;