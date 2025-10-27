import prisma from "@/lib/prisma";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const data = await prisma.event.findMany({
    where: {
      endDate: {
        gte: now,
      },
    },
    orderBy: { startDate: "asc" },
  });
   if (data.length === 0) {
    return <p className="text-gray-400">No Upcoming events.</p>;
  }

  return data.map((event) => (
      <div
        className="p-5 rounded-md border-2 bg-gray-100 border-t-4 odd:bg-yellow-100 even:border-t-lamaPurple flex justify-between items-center"
        key={event.id}
      >
        <div className="flex w-[70%] flex-col items-start justify-center">
          <h1 className="font-semibold text-gray-600">{event.title}</h1>
          <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
        </div>
        <span className="text-gray-500 w-[30%] text-xs flex flex-col items-center">
            <p>{event.startDate.toLocaleDateString("en-UK", {
              weekday: "short", 
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}{" "}</p>
            {event.startDate.toLocaleTimeString("en-UK", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </span>
      </div>
  ));
};

export default EventList;