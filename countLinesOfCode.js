'use strict';

//replace jquery/jquery with the repo you're interested in
fetch('https://api.github.com/repos/c7x43t/_dom/stats/contributors')
.then(response => response.json())
.then(contributors => contributors
    .map(contributor => contributor.weeks
        .reduce((lineCount, week) => lineCount + week.a - week.d, 0)))
.then(lineCounts => lineCounts.reduce((lineTotal, lineCount) => lineTotal + lineCount))
.then(lines => console.info(lines));
