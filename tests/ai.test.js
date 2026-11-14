import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  timeToMinutes,
  coursesConflict,
  filterCourses,
} from "../logic.mjs";

// Overlap and filtering expectations follow README.md. Invalid-time tests
// extend the rejection expectation already present in handwritten.test.js.
describe("timeToMinutes", () => {
  const validTimes = [
    ["00:00", 0],
    ["00:01", 1],
    ["00:59", 59],
    ["01:00", 60],
    ["04:20", 260],
    ["12:00", 720],
    ["14:50", 890],
    ["23:59", 1439],
  ];

  for (const [time, expected] of validTimes) {
    test(`converts ${time} to ${expected} minutes`, () => {
      assert.equal(timeToMinutes(time), expected);
    });
  }

  // RangeError is also the intended contract in handwritten.test.js.
  for (const time of ["24:00", "23:60", "00:99", "-1:30"]) {
    test(`rejects out-of-range time ${JSON.stringify(time)}`, () => {
      assert.throws(() => timeToMinutes(time), RangeError);
    });
  }

  for (const time of ["", "9:30", "09", "09:30:00", "ab:cd"]) {
    test(`rejects malformed time ${JSON.stringify(time)}`, () => {
      assert.throws(() => timeToMinutes(time), RangeError);
    });
  }

  for (const time of [undefined, null, 930, true, {}]) {
    test(`rejects non-string input ${String(time)}`, () => {
      assert.throws(() => timeToMinutes(time), TypeError);
    });
  }
});

function makeCourse(overrides = {}) {
  return {
    number: "15-113",
    name: "Effective Coding with AI",
    days: ["M", "W"],
    start: "09:00",
    end: "10:20",
    ...overrides,
  };
}

describe("coursesConflict", () => {
  // Minute values are explicit so these tests do not depend on timeToMinutes.
  const intervals = [
    ["a course ending before the existing course", 480, 539, false],
    ["a course ending exactly when the existing course starts", 480, 540, false],
    ["a one-minute overlap at the existing start", 539, 541, true],
    ["an overlap with the existing start", 510, 570, true],
    ["a course entirely inside the existing course", 550, 600, true],
    ["identical meeting times", 540, 620, true],
    ["a course containing the existing course", 480, 660, true],
    ["an overlap with the existing end", 600, 660, true],
    ["a one-minute overlap at the existing end", 619, 621, true],
    ["a course starting exactly when the existing course ends", 620, 680, false],
    ["a course starting after the existing course", 621, 680, false],
  ];

  for (const [label, start, end, conflicts] of intervals) {
    test(label, () => {
      const course = makeCourse();
      assert.strictEqual(
        coursesConflict([course], ["M"], start, end),
        conflicts ? course : undefined,
      );
    });
  }

  test("returns undefined for an empty schedule", () => {
    assert.equal(coursesConflict([], ["M"], 540, 620), undefined);
  });

  test("does not conflict when the days are different", () => {
    assert.equal(coursesConflict([makeCourse()], ["T", "R"], 540, 620), undefined);
  });

  test("does not conflict when the proposed days are empty", () => {
    assert.equal(coursesConflict([makeCourse()], [], 540, 620), undefined);
  });

  test("does not conflict when the existing course has no days", () => {
    assert.equal(
      coursesConflict([makeCourse({ days: [] })], ["M"], 540, 620),
      undefined,
    );
  });

  test("finds a shared day after nonmatching days", () => {
    const course = makeCourse();
    assert.strictEqual(coursesConflict([course], ["T", "W"], 550, 600), course);
  });

  test("continues past courses on other days and at other times", () => {
    const differentDay = makeCourse({ days: ["T"] });
    const earlier = makeCourse({ start: "07:00", end: "08:00" });
    const conflict = makeCourse({ number: "21-120" });
    assert.strictEqual(
      coursesConflict([differentDay, earlier, conflict], ["M"], 550, 600),
      conflict,
    );
  });

  test("returns the first conflicting course in schedule order", () => {
    const first = makeCourse();
    const second = makeCourse({ number: "21-120" });
    assert.strictEqual(coursesConflict([first, second], ["M"], 550, 600), first);
  });

  test("detects an overlap at midnight", () => {
    const course = makeCourse({ start: "00:00", end: "00:02" });
    assert.strictEqual(coursesConflict([course], ["M"], 0, 1), course);
  });

  test("detects an overlap near the end of the day", () => {
    const course = makeCourse({ start: "23:57", end: "23:59" });
    assert.strictEqual(coursesConflict([course], ["M"], 1438, 1439), course);
  });

  test("does not mutate the schedule or proposed days", () => {
    const courses = [makeCourse()];
    const days = ["T", "W"];
    const originalCourses = structuredClone(courses);
    const originalDays = [...days];
    coursesConflict(courses, days, 550, 600);
    assert.deepEqual(courses, originalCourses);
    assert.deepEqual(days, originalDays);
  });

  test("throws TypeError for a null schedule", () => {
    assert.throws(() => coursesConflict(null, ["M"], 540, 620), TypeError);
  });

  test("throws TypeError for a non-iterable schedule", () => {
    assert.throws(() => coursesConflict({}, ["M"], 540, 620), TypeError);
  });

  test("throws TypeError for missing proposed days", () => {
    assert.throws(
      () => coursesConflict([makeCourse()], undefined, 540, 620),
      TypeError,
    );
  });

  test("throws TypeError for a course with missing days", () => {
    assert.throws(
      () => coursesConflict([makeCourse({ days: undefined })], ["M"], 540, 620),
      TypeError,
    );
  });

  test("throws TypeError for a non-string course start time", () => {
    assert.throws(
      () => coursesConflict([makeCourse({ start: 900 })], ["M"], 540, 620),
      TypeError,
    );
  });
});

describe("filterCourses", () => {
  function makeRoster() {
    return [
      makeCourse(),
      makeCourse({ number: "21-120", name: "Differential Calculus" }),
      makeCourse({ number: "15-122", name: "Imperative Computation" }),
    ];
  }

  test("returns all courses for an empty query", () => {
    const courses = makeRoster();
    const result = filterCourses(courses, "");
    assert.deepEqual(result, courses);
    assert.notStrictEqual(result, courses);
  });

  test("returns an empty array for an empty schedule", () => {
    assert.deepEqual(filterCourses([], "calc"), []);
  });

  test("returns an empty array when nothing matches", () => {
    assert.deepEqual(filterCourses(makeRoster(), "astronomy"), []);
  });

  test("matches a complete course number", () => {
    const courses = makeRoster();
    assert.deepEqual(filterCourses(courses, "21-120"), [courses[1]]);
  });

  test("matches a partial course number and preserves schedule order", () => {
    const courses = makeRoster();
    assert.deepEqual(filterCourses(courses, "15-"), [courses[0], courses[2]]);
  });

  test("matches a substring of the course title", () => {
    const courses = makeRoster();
    assert.deepEqual(filterCourses(courses, "calc"), [courses[1]]);
  });

  test("matches a suffix at the end of a course title", () => {
    const courses = makeRoster();
    assert.deepEqual(filterCourses(courses, "lus"), [courses[1]]);
  });

  for (const query of ["CALC", "CaLc"]) {
    test(`matches case-insensitively for query ${query}`, () => {
      const courses = makeRoster();
      assert.deepEqual(filterCourses(courses, query), [courses[1]]);
    });
  }

  test("treats search punctuation as literal text", () => {
    assert.deepEqual(filterCourses(makeRoster(), ".*"), []);
  });

  test("preserves duplicate matching courses", () => {
    const course = makeCourse();
    assert.deepEqual(filterCourses([course, course], "15-113"), [course, course]);
  });

  test("returns original course objects without mutating the input", () => {
    const courses = makeRoster();
    const before = structuredClone(courses);
    const result = filterCourses(courses, "calc");
    assert.strictEqual(result[0], courses[1]);
    assert.deepEqual(courses, before);
  });

  test("throws TypeError for a null schedule", () => {
    assert.throws(() => filterCourses(null, "calc"), TypeError);
  });

  test("throws TypeError for a schedule that is not an array", () => {
    assert.throws(() => filterCourses({}, "calc"), TypeError);
  });

  test("throws TypeError for a null course record", () => {
    assert.throws(() => filterCourses([null], "calc"), TypeError);
  });
});
  
