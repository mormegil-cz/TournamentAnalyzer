importScripts('common.js');

(function () {
    var rules;
    var teams;
    var matches;
    var matchesToSimulate;

    onmessage = function (e) {
        var req = e.data;
        switch (req.request) {
            case 'start':
                rules = req.rules;
                teams = req.teams;
                matches = req.matches;
                matchesToSimulate = filterMatchesToSimulate(matches);
                setTimeout(runSimulation, 0);
                break;

            case 'stop':
                shouldStop = true;
                break;

            default:
                console.error('Unexpected message', e);
                break;
        }
    }

    function filterMatchesToSimulate(matches) {
        var result = {};
        for (var id of Object.keys(matches)) {
            var m = matches[id];
            if (m.type === 'toplay') result[id] = m;
        }
        return result;
    }

    var shouldStop;
    var simulationStartTime;
    var simulationCount;
    var simulationResults;

    function runSimulation() {
        simulationStartTime = Date.now();
        simulationCount = 0;
        simulationResults = {};
        for (let team of teams) {
            let teamResults = [];
            for (let i = 0; i < teams.length; ++i) {
                teamResults.push({ count: 0, successMatches: {}, failMatches: {} });
            }
            simulationResults[team] = teamResults;
        }
        shouldStop = false;
        simulationLoop();
    }

    function generateRandomResult(home, away) {
        return rules.results[Math.floor(Math.random() * rules.results.length)];
    }

    function generateRandomResults() {
        var result = {};
        for (var id of Object.keys(matchesToSimulate)) {
            var teams = id.split('-');
            result[id] = generateRandomResult(teams[0], teams[1]);
        }
        return result;
    }

    function mergeResults(result, list) {
        for (let id of Object.keys(list)) {
            let m = list[id];
            if (m.type !== 'toplay') result[id] = m;
        }
        return result;
    }

    function addMatch(matchList, match, result) {
        let matchRec = matchList[match] || { W: 0, OW: 0, OL: 0, L: 0 };
        ++matchRec[result];
        matchList[match] = matchRec;
    }

    function simulationLoop() {
        postMessage({ simulationCount: simulationCount, simulationTime: Date.now() - simulationStartTime, results: simulationResults });
        lastUpdate = Date.now();
        while (!shouldStop) {
            var now = Date.now();
            if (now - lastUpdate > 1000) {
                setTimeout(simulationLoop, 0);
                return;
            }

            var matchResults = mergeResults(mergeResults({}, matches), generateRandomResults());
            // var teamPoints = evaluateMatches(matchResults);
            var sortedTeams = SimulationCommon.sortGroup(teams, matchResults);

            var pos = 0;
            for (let team of sortedTeams) {
                for (let i = 0; i < pos; ++i) {
                    var rec = simulationResults[team][i];
                    for (let match of Object.keys(matchResults)) {
                        addMatch(rec.failMatches, match, matchResults[match].result);
                    }
                }
                for (let i = pos; i < teams.length - 1; ++i) {
                    var rec = simulationResults[team][i];
                    ++rec.count;
                    for (let match of Object.keys(matchResults)) {
                        addMatch(rec.successMatches, match, matchResults[match].result);
                    }
                }
                ++pos;
            }

            ++simulationCount;
        }
    }
})();
