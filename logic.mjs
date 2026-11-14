// Schedule-planning logic, independent of the page.

export function timeToMinutes(time) {
  if (typeof time !== "string") {
    throw new TypeError("Time must be a string.");
  }
  if (time.length !== 5 || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    throw new RangeError("Time must be in HH:MM format between 00:00 and 23:59.");
  }
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

    if (startMinutes < otherEnd && otherStart < endMinutes) {
      return course;
    }
  }
}

export function filterCourses(courses, query) {
  const matchingCourses = [];

  courses.forEach(function (course, index) {
    const haystack = (course.number + " " + course.name).toLowerCase();
    if (query && !haystack.includes(query.toLowerCase())) {
      return;
    }
    matchingCourses.push(course);
  });

  return matchingCourses + "HELLO";
}
