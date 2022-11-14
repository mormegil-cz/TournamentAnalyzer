const { Worker, isMainThread } = require('worker_threads');

const THREAD_COUNT = 5;
const ITER_COUNT = 10000;

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
                throw 'Unsupported data type ' + type;
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

function finished(teamPlacements, phaseTeamCounts, interestingResults) {
    let phaseTeams = Object.keys(phaseTeamCounts);
    phaseTeams.sort((a, b) => phaseTeamCounts[b] - phaseTeamCounts[a]);
    for (let i = 0; i < 20; ++i) {
        let t = phaseTeams[i];
        console.log(`${t}\t${fmtPerc(phaseTeamCounts[t])}\t${fmtOdds(phaseTeamCounts[t])}`);
    }

    let chosenTeamCount = 0;
    for (let t of phaseTeams) {
        if (t.indexOf("FRA") >= 0 && t.indexOf("BEL") >= 0 && t.indexOf("NED") >= 0) chosenTeamCount += phaseTeamCounts[t];
    }
    console.log(`Chosen teams: ${fmtPerc(chosenTeamCount)}\t${fmtOdds(chosenTeamCount)}`);

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
        console.log(`${team}\t${fmtPerc(placements['0'])}\t${fmtPerc(placements['1'])}\t${fmtPerc(placements['2'])}\t${fmtPerc(placements['3'])}\t${fmtPerc(placements['4'])}`);
    }

    for (let team of teams) {
        let placements = teamPlacements[team];
        console.log(`${team}\t${fmtOdds(placements['0'])}\t${fmtOdds(placements['1'])}\t${fmtOdds(placements['2'])}\t${fmtOdds(placements['3'])}\t${fmtOdds(placements['4'])}`);
    }

    let interestingTeams = Object.keys(interestingResults);
    interestingTeams.sort((a, b) => interestingResults[b] - interestingResults[a]);
    for (let team of interestingTeams) {
        console.log(`${team}: ${fmtPerc(interestingResults[team])}`);
    }
}

function main() {
    let threadsRunning = THREAD_COUNT;
    let teamPlacements = {};
    let phaseTeamCounts = {};
    let interestingResults = {};
    for (let thread = 0; thread < THREAD_COUNT; ++thread) {
        const worker = new Worker('./scenarioSimulation.js', { workerData: { iterations: ITER_COUNT } });
        worker.on('message', (msg) => {
            if (msg.type !== 'done') throw 'Unexpected message from worker thread';

            mergeData(teamPlacements, msg.teamPlacements);
            mergeData(phaseTeamCounts, msg.phaseTeamCounts);
            mergeData(interestingResults, msg.interestingResults);
            // if (msg.interestingResults) console.dir(msg.interestingResults, {depth: null});
        });
        worker.on('error', (error) => {
            console.error(error);
            throw error;
        });
        worker.on('exit', () => {
            --threadsRunning;

            if (threadsRunning === 0) {
                finished(teamPlacements, phaseTeamCounts, interestingResults);
            }
        });
    }
}

main();
