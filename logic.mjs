// Pure calculations extracted from app.js; existing behavior is preserved.

export function timeToMinutes(time) {
  return Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
}

export function coursesConflict(first, second) {
  const sharesADay = first.days.some(day => second.days.includes(day));
  if (!sharesADay) {
    return false;
  }

  const firstStart = timeToMinutes(first.start);
  const firstEnd = timeToMinutes(first.end);
  const secondStart = timeToMinutes(second.start);
  const secondEnd = timeToMinutes(second.end);

  return firstStart <= secondEnd && secondStart <= firstEnd;
}

export function filterCourses(courses, query) {
  return courses.filter(function (course) {
    const haystack = (course.number + " " + course.name).toLowerCase();
    return !query || haystack.includes(query);
  });
}
