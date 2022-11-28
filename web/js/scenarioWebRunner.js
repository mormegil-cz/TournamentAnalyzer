const THREAD_COUNT = 3;
const ITER_COUNT = 1000;

const $runSimulation = document.getElementById('runSimulation');
const $simulationResults = document.getElementById('simulationResults');

function mergeData(data, addedData) {
    if (!addedData) return;
    for (let key of Object.keys(addedData)) {
        let curr = data[key];
        let added = addedData[key];
        let type = typeof (curr);
        switch (type) {
            case 'undefined':
                data[key] = added;
                break;

            case 'number':
                data[key] = curr + added;
                break;

            case 'object':
                mergeData(curr, added);
                break;

            default:
                throw new Error('Unsupported data type ' + type);
        }
    }
}

function fmtPerc(num) {
    if (typeof num !== 'number') return "(none)";
    if (num === ITER_COUNT * THREAD_COUNT) return "(all)";
    return (num * 100 / ITER_COUNT / THREAD_COUNT).toFixed(1) + ' %';
}

function fmtOdds(num) {
    if (typeof num !== 'number') return "(inf)";
    if (num === ITER_COUNT * THREAD_COUNT) return "—";
    return (ITER_COUNT * THREAD_COUNT / num).toFixed(3);
}

function fmtNegOdds(num) {
    if (typeof num !== 'number') return "(all)";
    if (num === ITER_COUNT * THREAD_COUNT) return "—";
    return (ITER_COUNT * THREAD_COUNT / (ITER_COUNT * THREAD_COUNT - num)).toFixed(3);
}

function finished(teamPlacements, phaseTeamCounts, interestingResults) {
    let results = [];

    let phaseTeams = Object.keys(phaseTeamCounts);
    phaseTeams.sort((a, b) => phaseTeamCounts[b] - phaseTeamCounts[a]);
    for (let i = 0; i < 20; ++i) {
        let t = phaseTeams[i];
        results.push(`${t}\t${fmtPerc(phaseTeamCounts[t])}\t${fmtOdds(phaseTeamCounts[t])}`);
    }

    let chosenTeamCount = 0;
    for (let t of phaseTeams) {
        if (t.indexOf("FRA") >= 0 && t.indexOf("BRA") >= 0 && t.indexOf("ARG") >= 0) chosenTeamCount += phaseTeamCounts[t];
    }
    results.push(`Chosen teams: ${fmtPerc(chosenTeamCount)}\t${fmtOdds(chosenTeamCount)}`);

    let teams = Object.keys(teamPlacements);
    teams.sort((a, b) => {
        for (let s = 3; s >= 0; --s) {
            var aCount = teamPlacements[a]['' + s];
            var bCount = teamPlacements[b]['' + s];
            if (aCount > bCount) return -1;
            if (bCount > aCount) return +1;
        }
        return 0;
    });

    for (let team of teams) {
        let placements = teamPlacements[team];
        results.push(`${team}\t${fmtPerc(placements['0'])}\t${fmtPerc(placements['1'])}\t${fmtPerc(placements['2'])}\t${fmtPerc(placements['3'])}\t${fmtPerc(placements['4'])}`);
    }
    results.push('---');
    for (let team of teams) {
        let placements = teamPlacements[team];
        results.push(`${team}\t${fmtOdds(placements['0'])}\t${fmtOdds(placements['1'])}\t${fmtOdds(placements['2'])}\t${fmtOdds(placements['3'])}\t${fmtOdds(placements['4'])}`);
    }
    results.push('---');
    for (let team of teams) {
        let placements = teamPlacements[team];
        results.push(`${team}\t${fmtNegOdds(placements['0'])}\t${fmtNegOdds(placements['1'])}\t${fmtNegOdds(placements['2'])}\t${fmtNegOdds(placements['3'])}\t${fmtNegOdds(placements['4'])}`);
    }

    results.push('===');
    results.push(`Interesting results: ${fmtPerc(interestingResults.count)} / ${fmtOdds(interestingResults.count)} / ${fmtNegOdds(interestingResults.count)}`);
    /*
    let interestingTeams = Object.keys(interestingResults);
    interestingTeams.sort((a, b) => interestingResults[b] - interestingResults[a]);
    for (let team of interestingTeams) {
        results.push(`${team}: ${fmtPerc(interestingResults[team])}`);
    }
    */

    $simulationResults.innerText = results.join('\n');
    $runSimulation.disabled = false;
}

function runSimulation() {
    let threadsRunning = THREAD_COUNT;
    let teamPlacements = {};
    let phaseTeamCounts = {};
    let interestingResults = {};
    for (let thread = 0; thread < THREAD_COUNT; ++thread) {
        const worker = new Worker('js/scenarioSimulation.js');
        worker.addEventListener('message', (evt) => {
            const msg = evt.data;
            switch(msg.type) {
                case 'done':
                    mergeData(teamPlacements, msg.teamPlacements);
                    mergeData(phaseTeamCounts, msg.phaseTeamCounts);
                    mergeData(interestingResults, msg.interestingResults);
                    // if (msg.interestingResults) console.dir(msg.interestingResults, {depth: null});
                    break;

                case 'exit':
                    --threadsRunning;

                    if (threadsRunning === 0) {
                        finished(teamPlacements, phaseTeamCounts, interestingResults);
                    }
                    break;

                default:
                    throw new Error('Unexpected message from worker thread');
            }

        });
        worker.addEventListener('error', (error) => {
            console.error(error);
            throw error;
        });

        worker.postMessage({ type: 'run', workerData: { iterations: ITER_COUNT } });
    }
}

function init() {
    $runSimulation.addEventListener('click', () => {
        $runSimulation.disabled = true;
        runSimulation();
        return false;
    });
}

init();
