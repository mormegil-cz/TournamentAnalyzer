const fs = require('fs');
const vm = require('vm');// vm must be in the global context to work properly
const Worker = require('web-worker');

const THREAD_COUNT = 7;
const ITER_COUNT = 30000;
const SMOOTH_FACTOR = 0.2;

function include(filename) {
    var code = fs.readFileSync(filename, 'utf-8');
    vm.runInThisContext(code, filename);
}

include('./scenarioData.js');

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

function getPerc(num) {
    if (typeof num !== 'number') return 0;
    if (num === ITER_COUNT * THREAD_COUNT) return 100;
    return num * 100 / ITER_COUNT / THREAD_COUNT;
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

function runScenarioAsync(rating, scenarioDefinition, resolve, reject) {
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
                        resolve([teamPlacements, phaseTeamCounts, interestingResults, totalSimulationCount]);
                    }
                    break;

                default:
                    throw new Error('Unexpected message from worker thread: ' + JSON.stringify(msg));
            }
        });
        worker.addEventListener('error', (error) => {
            console.error(error);
            reject(error);
        });

        worker.postMessage({
            type: 'run', id: thread + 1, workerData: {
                rating: rating,
                scenarioDefinition: scenarioDefinition,
                smoothFactor: SMOOTH_FACTOR,
                iterations: ITER_COUNT
            }
        });
    }
}

function main(rating, scenarioDefinition) {
    let promise = new Promise((resolve, reject) => runScenarioAsync(rating, scenarioDefinition, resolve, reject));
    promise.then(args => finished(...args));
}

function replayedEvolutionStep(rating, scenarioDefinition) {
    return new Promise((resolve, reject) => runScenarioAsync(rating, scenarioDefinition, resolve, reject));
}

function clearDefinition(scenarioDefinition) {
    let limitedDefinition = Object.assign({}, scenarioDefinition);
    let limitedScenario = [];
    for (let part of scenarioDefinition.scenario) {
        switch (part.type) {
            case 'group':
                let limitedGroup = structuredClone(part);
                for (let match of Object.keys(limitedGroup.params.matches)) {
                    limitedGroup.params.matches[match] = '';
                }
                limitedScenario.push(limitedGroup);
                break;
            case 'playofftree':
                let limitedTree = structuredClone(part);
                limitedTree.knownResults = {};
                limitedScenario.push(limitedTree);
                break;
            default:
                limitedScenario.push(part);
        }
    }
    limitedDefinition.scenario = limitedScenario;
    return limitedDefinition;
}

function findInScenario(scenario, partName) {
    for (let part of scenario) {
        if (part.label === partName) return part;
    }
    throw new Error('Unknown part ' + partName);
}

function applyMatchToScenario(scenario, fullDefinition, match) {
    const hash = match.indexOf('#');
    const partName = match.substring(0, hash);
    const matchName = match.substring(hash + 1);
    let part = findInScenario(scenario.scenario, partName);
    let fullPart = findInScenario(fullDefinition.scenario, partName);

    switch (part.type) {
        case 'group':
            const fullGroupResult = fullPart.params.matches[matchName];
            if (typeof fullGroupResult !== 'string') throw new Error(`Unknown match ${match}`);
            if (part.params.matches[matchName]) throw new Error(`Duplicate match ${match}`);
            if (!fullGroupResult) return false;
            part.params.matches[matchName] = fullGroupResult;
            break;

        case 'playofftree':
            const fullPlayoffResult = fullPart.params.knownResults[matchName];
            if (typeof fullPlayoffResult !== 'string') throw new Error(`Unknown match ${match}`);
            if (part.params.knownResults[matchName]) throw new Error(`Duplicate match ${match}`);
            if (!fullPlayoffResult) return false;
            part.params.knownResults[matchName] = fullPart.params.knownResults[matchName];
            break;

        default:
            throw new Error(`Unable to apply match in ${partName} which is ${part.type}`);
    }

    // console.dir(scenario, { depth: null });

    return true;
}

const EVOLUTION_STEP_PHASE = '0'; // 0 = playoffs, 4 = tournament win
let chanceEvolutionHistory = [];

function recordEvolutionStep(afterMatch, teamPlacements, phaseTeamCounts, interestingResults, totalSimulationCount) {
    let chances = {};
    for (let team of Object.keys(teamPlacements)) {
        let placements = teamPlacements[team];
        chances[team] = getPerc(placements[EVOLUTION_STEP_PHASE]);
    }
    chanceEvolutionHistory.push({
        afterMatch: afterMatch,
        chances: chances
    });
    console.debug(`Recorded results after ${afterMatch}`);
}

function printChanceEvolutionHistory() {
    let teams = Object.keys(chanceEvolutionHistory[0].chances);
    let matches = chanceEvolutionHistory.map(e => e.afterMatch);
    matches.unshift('');
    console.log(matches.join(';'));

    for (let team of teams) {
        let line = [team];
        for (let match of chanceEvolutionHistory) {
            line.push(match.chances[team]);
        }
        console.log(line.join(';'));
    }
}

function computeChanceEvolutionHistory(rating, scenarioDefinition, matchList) {
    let currentScenario = clearDefinition(scenarioDefinition);
    let promise = replayedEvolutionStep(rating, currentScenario)
        .then(args => recordEvolutionStep('(start)', ...args));

    for (let matchIndex = 0; matchIndex < matchList.length; ++matchIndex) {
        let currentMatch = matchList[matchIndex];
        promise = promise.then(() => {
            applyMatchToScenario(currentScenario, scenarioDefinition, currentMatch);
            // TODO: break
    
            return replayedEvolutionStep(rating, currentScenario);
        })
            .then(args => recordEvolutionStep(currentMatch, ...args));
    }

    promise.then(printChanceEvolutionHistory);
}

// main(ELO_RATING_UEFA, SCENARIO_DEFINITION_UEFA_2024);

computeChanceEvolutionHistory(ELO_RATING_UEFA, SCENARIO_DEFINITION_UEFA_2024, [
    'A#GER-SCO', 'A#HUN-SUI', 'B#ESP-CRO', 'B#ITA-ALB', 'D#POL-NED', 'C#SLO-DEN', 'C#SRB-ENG', 'E#ROM-UKR', 'E#BEL-SVK', 'D#AUT-FRA', 'F#TUR-GEO', 'F#POR-CZE',
    'B#CRO-ALB', 'A#GER-HUN', 'A#SCO-SUI', 'C#SLO-SRB', 'C#DEN-ENG', 'B#ESP-ITA', 'E#SVK-UKR', 'D#POL-AUT', 'D#NED-FRA', 'F#GEO-CZE', 'F#TUR-POR', 'E#BEL-ROM',
    /*'A#SUI-GER', 'A#SCO-HUN', 'B#ALB-ESP', 'B#CRO-ITA', 'D#NED-AUT', 'D#FRA-POL', 'C#ENG-SLO', 'C#DEN-SRB', 'E#SVK-ROM', 'E#UKR-BEL', 'F#GEO-POR', 'F#CZE-TUR'*/
]);
