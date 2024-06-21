(function () {
    const $threadCount = document.getElementById('threadCount');
    const $smoothFactor = document.getElementById('smoothFactor');
    const $startSimulation = document.getElementById('startSimulation');
    const $stopSimulation = document.getElementById('stopSimulation');
    const $simulationResults = document.getElementById('simulationResults');
    const $simulationStats = document.getElementById('simulationStats');

    let totalSimulationCount = 0;
    let teamPlacements = {};
    let phaseTeamCounts = {};
    let interestingResults = {};
    let scheduledResultUpdate = false;

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
        if (num === totalSimulationCount) return "(all)";
        return (num * 100 / totalSimulationCount).toFixed(1) + ' %';
    }

    function fmtOdds(num) {
        if (typeof num !== 'number') return "(inf)";
        if (num === totalSimulationCount) return "—";
        return (totalSimulationCount / num).toFixed(3);
    }

    function fmtNegOdds(num) {
        if (typeof num !== 'number') return "(all)";
        if (num === totalSimulationCount) return "—";
        return (totalSimulationCount / (totalSimulationCount - num)).toFixed(3);
    }

    function updateResults() {
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

        $simulationStats.innerText = `After ${totalSimulationCount} simulations`;
        $simulationResults.innerText = results.join('\n');
        scheduledResultUpdate = false;
    }

    let currentWorkerId = 0;
    let runningWorkers = new Map();

    function startSimulation() {
        let threadCount = $threadCount.valueAsNumber;
        let smoothFactor = $smoothFactor.valueAsNumber;
        totalSimulationCount = 0;
        teamPlacements = {};
        phaseTeamCounts = {};
        interestingResults = {};
        scheduledResultUpdate = false;

        const cacheBuster = '?_=' + Date.now();
        const workerScript = 'js/scenarioSimulationWorker.js' + cacheBuster;
        for (let thread = 0; thread < threadCount; ++thread) {
            const worker = new Worker(workerScript);
            const workerId = ++currentWorkerId;
            runningWorkers.set(workerId, worker);
            worker.addEventListener('message', (evt) => {
                const msg = evt.data;
                switch (msg.type) {
                    case 'update':
                        let receivedResults = msg.results;
                        totalSimulationCount += msg.simulationCount;
                        mergeData(teamPlacements, receivedResults.teamPlacements);
                        mergeData(phaseTeamCounts, receivedResults.phaseTeamCounts);
                        mergeData(interestingResults, receivedResults.interestingResults);
                        // if (msg.interestingResults) console.dir(receivedResults.interestingResults, {depth: null});
                        if (!scheduledResultUpdate) {
                            setTimeout(updateResults, 300);
                            scheduledResultUpdate = true;
                        }
                        break;

                    case 'exit':
                        runningWorkers.delete(msg.id);
                        if (!runningWorkers.size) simulationStopped();
                        break;

                    default:
                        throw new Error('Unexpected message from worker thread');
                }

            });
            worker.addEventListener('error', (error) => {
                console.error(error);
                throw error;
            });
            worker.postMessage({ type: 'run', id: workerId, workerData: { smoothFactor: smoothFactor * 0.01 } });
        }
    }

    function stopSimulation() {
        for (let entry of runningWorkers) {
            entry[1].postMessage({ type: 'stop' });
        }
    }

    function simulationStopped() {
        $startSimulation.disabled = false;
    }

    function init() {
        $startSimulation.addEventListener('click', () => {
            $startSimulation.disabled = true;
            $stopSimulation.disabled = false;
            startSimulation();
            return false;
        });
        $stopSimulation.addEventListener('click', () => {
            $stopSimulation.disabled = true;
            stopSimulation();
            return false;
        });
    }

    init();
})();
