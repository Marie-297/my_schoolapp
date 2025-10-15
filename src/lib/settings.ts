export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/student(.*)": ["student"],
  "/teacher(.*)": ["teacher"],
  "/parent(.*)": ["parent"],
  "/lists/teachers": ["admin", "teacher"],
  "/lists/students": ["admin", "teacher"],
  "/lists/parents": ["admin", "teacher"],
  "/lists/subjects": ["admin"],
  "/lists/classes": ["admin", "teacher"],
  "/lists/exams": ["admin", "teacher", "student", "parent"],
  "/lists/midterm": ["admin", "teacher", "student", "parent"],
  "/lists/results": ["admin", "teacher", "student", "parent"],
  "/lists/attendance": ["admin", "teacher", "student", "parent"],
  "/lists/events": ["admin", "teacher", "student", "parent"],
  "/lists/announcements": ["admin", "teacher", "student", "parent"],
};