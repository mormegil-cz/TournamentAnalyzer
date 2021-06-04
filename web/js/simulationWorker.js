importScripts('common.js');

(function () {
    var rules;
    var teams;
    var teamParameters;
    var matches;
    var matchesToSimulate;

    onmessage = function (e) {
        var req = e.data;
        switch (req.request) {
            case 'start':
                rules = req.rules;
                teams = req.teams;
                teamParameters = req.teamParameters;
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
        var homeParam = teamParameters[home] || 0;
        var awayParam = teamParameters[away] || 0;

        homeParam *= homeParam;
        awayParam *= awayParam;

        var sumParam = homeParam + awayParam;
        if (sumParam === 0) {
            return rules.results[Math.floor(Math.random() * rules.results.length)];
        }

        var homeFrac = homeParam / sumParam;
        var small = Math.min(homeFrac, 1 - homeFrac);
        var draw2 = small / 3;
        var drawLow = homeFrac - draw2;
        var drawHigh = homeFrac + draw2;

        var rnd = Math.random();
        if (rnd < drawLow) return rules.results[0];
        if (rnd < drawHigh) return rules.results[1];
        return rules.results[2];
    }

    function generateRandomResults() {
        let result = {};
        for (let id of Object.keys(matchesToSimulate)) {
            let teams = id.split('-');
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

    function addMatch(matchList, match, result, matchResults) {
        let matchRec = matchList[match] || {};
        matchRec[result] = (matchRec[result] || 0) + 1;
        matchRec[result + '-matches'] = matchResults;
        matchList[match] = matchRec;
    }

    function simulationLoop() {
        postMessage({ simulationCount: simulationCount, simulationTime: Date.now() - simulationStartTime, results: simulationResults });
        lastUpdate = Date.now();
        while (!shouldStop) {
            let now = Date.now();
            if (now - lastUpdate > 1000) {
                setTimeout(simulationLoop, 0);
                return;
            }

            let matchResults = mergeResults(mergeResults({}, matches), generateRandomResults());
            // var teamPoints = evaluateMatches(matchResults);
            let sortedTeams = SimulationCommon.sortGroup(teams, matchResults);

            let pos = 0;
            for (let team of sortedTeams) {
                for (let i = 0; i < pos; ++i) {
                    let rec = simulationResults[team][i];
                    for (let match of Object.keys(matchResults)) {
                        addMatch(rec.failMatches, match, matchResults[match].result, matchResults);
                    }
                }
                for (let i = pos; i < teams.length - 1; ++i) {
                    let rec = simulationResults[team][i];
                    ++rec.count;
                    for (let match of Object.keys(matchResults)) {
                        addMatch(rec.successMatches, match, matchResults[match].result, matchResults);
                    }
                }
                ++pos;
            }

            ++simulationCount;
        }
    }
})();
