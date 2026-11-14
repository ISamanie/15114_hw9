// Logic extracted from app.js, preserving the original loops and conditions.

export function timeToMinutes(time) {
  return Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
}

export function coursesConflict(courses, days, startMinutes, endMinutes) {
  for (const course of courses) {
    let sharesADay = false;
    for (const day of days) {
      if (course.days.includes(day)) {
        sharesADay = true;
      }
    }
    if (!sharesADay) {
      continue;
    }

    const otherStart = Number(course.start.slice(0, 2)) * 60 + Number(course.start.slice(3, 5));
    const otherEnd = Number(course.end.slice(0, 2)) * 60 + Number(course.end.slice(3, 5));

    if (startMinutes <= otherEnd && otherStart <= endMinutes) {
      return course;
    }
  }
}

export function filterCourses(courses, query) {
  const matchingCourses = [];

  courses.forEach(function (course, index) {
    const haystack = (course.number + " " + course.name).toLowerCase();
    if (query && !haystack.includes(query)) {
      return;
    }
    matchingCourses.push(course);
  });

  return matchingCourses;
}
