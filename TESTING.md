I used the provided example project given in the homework spec.

What you pulled out of the page and why, and anything that got awkward in the process
I chose functions that translate a 24 hour time format to minutes
Course conflicts and a course search function that matches courses againts the query.
I struggled to add the addEventListerner changes, until I reread the writeup but still struggled
with its placement until I asked ai to help. I also had issues getting the modules to be properly called by the webpage until I changed the file extension.

What you chose to test, and what you deliberately left untested
TimeToMinutes : Boundary checks on timeToMinutes such as negative numbers, 24:00 or minutes at or above 60.
CourseConflicts : Boundary checks, ie one class ends as another begins.
filterCoutses : Made sure to check that matching was case insensitive.

The break-it-on-purpose table: five rows, each with the change you made, the test that caught it, and the failure message

1.  test at tests\handwritten.test.js:15:1 ✖ Check that an invalid time does not translate properly
   This was a handwritten test I wrote to make sure that an invalid time such as 00:99 throws a rangeError.
2. test at tests\ai.test.js:221:5 ✖ matches case-insensitively for query CaLc
   This was a test case ai wrote that checked for case-insensitivity, this was fixed by changing the query and course name to lower before checking matching.
3. test at tests\ai.test.js:77:5 ✖ a course starting exactly when the existing course ends
   Fixed by changing the comparing operator to be non-inclusive 
4. test at tests\ai.test.js:37:5 ✖ rejects malformed time "ab:cd" 
    Added an input check to reject invalid inputs such as "ab:cd" which are not in valid 24 hour formats.
5. test at tests\ai.test.js:37:5 ✖ rejects malformed time "09:30:00" 
    Another check for invalid inputs, although this is a valid time format it is not the one specified for this function.


Every fake test you found, and whether you fixed it or deleted it
Deleted these two test, the first one will always pass even if the filter course returns gibberish or an empty list and the second one will always return true.

test("filtering returns an array", () => {
    assert.ok(Array.isArray(filterCourses([makeCourse()], "calc")));
});

test("time conversion returns a number", () => {
    assert.equal(typeof timeToMinutes("04:20"), "number");
  });


Both CI links: one passing run, one failing run


The verifier experiment: what you asked, what the agent did, the relevant transcript and diff, and what you make of it
A brief note on how you used AI on this assignment, with citations.