walk me through how to make each function a module based off this spec https://www.cs.cmu.edu/~113/hw9.html

take functionstimeToMinutes courseconflicts andfiltercourses and move them to a seperate file called logic

index.html is no longer loading in properly the calendar is not populating it seems like the functions defined in logic are no longer accessible


(the ai tries to work around the issue and rewrite the read me)no the content must be accesible as the readme describes, the write up suggest .mjs file

how can i handle the change from .js to .mjs in github so that app is not treated as a deletion but rather a rename
i dont want you to change the structure of ANY of the code, i caught this
        const sharesADay = first.days.some(day => second.days.includes(day));
        if (!sharesADay) {
        return false;
        }
        changed from the original
        let sharesADay = false;
        for (const day of days) {
        if (course.days.includes(day)) {
            sharesADay = true;
        }
        }
        if (!sharesADay) {
        continue;
        }
make sure that none of the bugs are fixed either

make sure the initial download from the project description did not fix any bugs

node is not recognized from vscode terminal, but is in my windows terminal help me fix this

Gave ai this description and told it to write test in ai.test.js
    timeToMinutes takes a time in "HH:MM" format and converts it to minutes since midnight. "04:20" should return 260. It could go wrong with empty inputs or invalid times like accepting "09:99" as a real time or any negative times, or hours past 24.

    coursesConflict checks whether a  course overlaps with an existing course on a day. It should return the first conflicting course or none if there isn’t one. Things that could go wrong are treating back-to-back classes as conflicts or missing a shared meeting day.

    filterCourses searches course numbers and titles and returns the matching courses. An empty search should return everything and no matches should return an empty array. It could go wrong with capitalization, returning a wrong match or destructively changing the list of courses.

    Include any other relevant test you may think of.

Given the fixes described in TESTING.md fix the buggy logic in logic.mjs. If you can think of other fixes suggest them here.

Handwritten test is still failing, why is that?

Fix the bug in the repo do not change the test cases, do not return until all test cases pass