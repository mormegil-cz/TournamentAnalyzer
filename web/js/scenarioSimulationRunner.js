const Worker = require('web-worker');

const THREAD_COUNT = 5;
const ITER_COUNT = 50000;

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

function finished(teamPlacements, phaseTeamCounts, interestingResults, totalSimulationCount) {
    let results = [];

    let phaseTeams = Object.keys(phaseTeamCounts);
    phaseTeams.sort((a, b) => phaseTeamCounts[b] - phaseTeamCounts[a]);
    for (let i = 0; i < 20; ++i) {
        let t = phaseTeams[i];
        results.push(`${t}\t${fmtPerc(phaseTeamCounts[t])}\t${fmtOdds(phaseTeamCounts[t])}`);
    }

    let chosenTeamCount = 0;
    for (let t of phaseTeams) {
        if (t.indexOf("CZE") >= 0 && t.indexOf("SVK") >= 0) chosenTeamCount += phaseTeamCounts[t];
    }
    results.push(`Chosen teams: ${fmtPerc(chosenTeamCount)}\t${fmtOdds(chosenTeamCount)}`);

    let teams = Object.keys(teamPlacements);
    teams.sort((a, b) => {
        for (let s = Object.keys(teamPlacements[a]).length; s >= 0; --s) {
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

    console.log(`After ${totalSimulationCount} simulations`);
    console.log(results.join('\n'));
}

function main() {
    let threadsRunning = THREAD_COUNT;
    let totalSimulationCount = 0;
    let teamPlacements = {};
    let phaseTeamCounts = {};
    let interestingResults = {};
    for (let thread = 0; thread < THREAD_COUNT; ++thread) {
        const worker = new Worker('./scenarioSimulationWorker.js');
        worker.addEventListener('message', (evt) => {
            const msg = evt.data;
            switch (msg.type) {
                case 'update':
                    let receivedResults = msg.results;
                    totalSimulationCount += msg.simulationCount;
                    mergeData(teamPlacements, receivedResults.teamPlacements);
                    mergeData(phaseTeamCounts, receivedResults.phaseTeamCounts);
                    mergeData(interestingResults, receivedResults.interestingResults);
                    // if (receivedResults.interestingResults) console.dir(receivedResults.interestingResults, {depth: null});
                    break;

                case 'exit':
                    --threadsRunning;

                    if (threadsRunning === 0) {
                        finished(teamPlacements, phaseTeamCounts, interestingResults, totalSimulationCount);
                    }
                    break;

                default:
                    throw new Error('Unexpected message from worker thread: ' + JSON.stringify(msg));
            }
        });
        worker.addEventListener('error', (error) => {
            console.error(error);
            throw error;
        });

        worker.postMessage({ type: 'run', id: thread + 1, workerData: { smoothFactor: 0, iterations: ITER_COUNT } });
    }
}

main();
