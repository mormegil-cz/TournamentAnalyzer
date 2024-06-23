(function () {
    const ENTRY_TO_PLAY = { type: 'toplay' };

    let workerId = 0;
    let doTerminate = false;
    let iterationLimit = 0;
    let updateFrequency = 1000;
    let smoothFactor = 0;

    let scenario;
    let rating;

    addEventListener('message', (evt) => {
        const msg = evt.data;
        switch (msg.type) {
            case 'run':
                workerId = msg.id;
                iterationLimit = msg.workerData.iterations;
                updateFrequency = msg.workerData.updateFrequency ?? 0;
                smoothFactor = msg.workerData.smoothFactor ?? 0;
                rating = msg.workerData.rating;
                scenario = buildAndValidateScenario(msg.workerData.scenarioDefinition, rating);
                setTimeout(startSimulation, 0);
                break;

            case 'stop':
                doTerminate = true;
                break;

            default:
                throw new Error('Unexpected message for worker thread: ' + JSON.stringify(msg));
        }
    });

    function startSimulation() {
        doTerminate = false;
        simulationLoop();
    }

    function computeMatchPoints(teams, matches) {
        let teamPoints = {};
        for (let team of teams) {
            let pts = 0;
            for (let otherTeam of teams) {
                var homeMatch = matches[`${team}-${otherTeam}`];
                if (homeMatch) pts += homeMatch.home;
                if (otherTeam !== team) {
                    var awayMatch = matches[`${otherTeam}-${team}`];
                    if (awayMatch) pts += awayMatch.away;
                }
            }
            teamPoints[team] = pts;
        }
        return teamPoints;
    }

    function computeGlobalMatchPoints(teams, matches) {
        let teamPoints = {};
        for (let team of teams) {
            let pts = 0;
            for (let match of Object.keys(matches)) {
                let matchResult = matches[match];
                if (!matchResult) {
                    console.debug(matches, match, matchResult);
                }
                if (match.startsWith(`${team}-`)) pts += matchResult.home;
                else if (match.endsWith(`-${team}`)) pts += matchResult.away;
            }
            teamPoints[team] = pts;
        }
        return teamPoints;
    }

    function computeGoalDifference(teams, matches) {
        let teamPoints = {};
        for (let team of teams) {
            let difference = 0;
            for (let otherTeam of teams) {
                var homeMatch = matches[`${team}-${otherTeam}`];
                if (homeMatch) difference += homeMatch.homeScore - homeMatch.awayScore;
                if (otherTeam !== team) {
                    var awayMatch = matches[`${otherTeam}-${team}`];
                    if (awayMatch) difference += awayMatch.awayScore - awayMatch.homeScore;
                }
            }
            teamPoints[team] = difference;
        }
        return teamPoints;
    }

    function computeGoalsScored(teams, matches) {
        let teamPoints = {};
        for (let team of teams) {
            let goals = 0;
            for (let otherTeam of teams) {
                var homeMatch = matches[`${team}-${otherTeam}`];
                if (homeMatch) goals += homeMatch.homeScore;
                if (otherTeam !== team) {
                    var awayMatch = matches[`${otherTeam}-${team}`];
                    if (awayMatch) goals += awayMatch.awayScore;
                }
            }
            teamPoints[team] = goals;
        }
        return teamPoints;
    }

    function computeTriesScored(teams, matches) {
        let teamPoints = {};
        for (let team of teams) {
            let tries = 0;
            for (let otherTeam of teams) {
                var homeMatch = matches[`${team}-${otherTeam}`];
                if (homeMatch) tries += homeMatch.homeTries;
                if (otherTeam !== team) {
                    var awayMatch = matches[`${otherTeam}-${team}`];
                    if (awayMatch) tries += awayMatch.awayTries;
                }
            }
            teamPoints[team] = tries;
        }
        return teamPoints;
    }

    function computeGlobalTriesScored(teams, matches) {
        let teamSet = {};
        for (let team of teams) teamSet[team] = 1;

        let teamTries = {};
        for (let id of Object.keys(matches)) {
            let match = matches[id];
            let pieces = id.split('-');
            let homeTeam = pieces[0];
            let awayTeam = pieces[1];
            if (teamSet[homeTeam]) {
                let currHome = teamTries[homeTeam] || 0;
                teamTries += match.homeTries;
                teamTries[homeTeam] = currHome;
            }
            if (teamSet[awayTeam]) {
                let currAway = teamTries[awayTeam] || 0;
                currAway += match.awayTries;
                teamTries[awayTeam] = currAway;
            }
        }
        return teamTries;
    }

    function computeGlobalGoalDifference(teams, matches) {
        let teamSet = {};
        for (let team of teams) teamSet[team] = 1;

        let teamPoints = {};
        for (let id of Object.keys(matches)) {
            let match = matches[id];
            let pieces = id.split('-');
            let homeTeam = pieces[0];
            let awayTeam = pieces[1];
            let difference = match.homeScore - match.awayScore;
            if (teamSet[homeTeam]) {
                let currHome = teamPoints[homeTeam] || 0;
                currHome += difference;
                teamPoints[homeTeam] = currHome;
            }
            if (teamSet[awayTeam]) {
                let currAway = teamPoints[awayTeam] || 0;
                currAway -= difference;
                teamPoints[awayTeam] = currAway;
            }
        }
        return teamPoints;
    }

    function computeGlobalTriesDifference(teams, matches) {
        let teamSet = {};
        for (let team of teams) teamSet[team] = 1;

        let teamPoints = {};
        for (let id of Object.keys(matches)) {
            let match = matches[id];
            let pieces = id.split('-');
            let homeTeam = pieces[0];
            let awayTeam = pieces[1];
            let difference = match.homeTries - match.awayTries;
            if (teamSet[homeTeam]) {
                let currHome = teamPoints[homeTeam] || 0;
                currHome += difference;
                teamPoints[homeTeam] = currHome;
            }
            if (teamSet[awayTeam]) {
                let currAway = teamPoints[awayTeam] || 0;
                currAway -= difference;
                teamPoints[awayTeam] = currAway;
            }
        }
        return teamPoints;
    }

    function computeGlobalGoalsScored(teams, matches) {
        let teamSet = {};
        for (let team of teams) teamSet[team] = 1;

        let teamPoints = {};
        for (let id of Object.keys(matches)) {
            let match = matches[id];
            let pieces = id.split('-');
            let homeTeam = pieces[0];
            let awayTeam = pieces[1];
            if (teamSet[homeTeam]) {
                let currHome = teamPoints[homeTeam] || 0;
                currHome += match.homeScore;
                teamPoints[homeTeam] = currHome;
            }
            if (teamSet[awayTeam]) {
                let currAway = teamPoints[awayTeam] || 0;
                currAway -= match.awayScore;
                teamPoints[awayTeam] = currAway;
            }
        }
        return teamPoints;
    }

    function computeRandomRanking(teams, _matches) {
        let teamPoints = {};
        for (let team of teams) {
            teamPoints[team] = randomNumber() * 100;
        }
        return teamPoints;
    }

    function computeRankingScoring(ranking) {
        let result = {};
        let count = ranking.length;
        for (let i = 0; i < count; ++i) {
            result[ranking[i]] = count - i;
        }
        return result;
    }

    function makeRankingAlgorithm(ranking) {
        let result = computeRankingScoring(ranking);
        return (_teams, _matches) => result;
    }

    function findResultDefinitionInRules(rules, result) {
        return rules.results.find(r => r.result === result);
    }

    function preparePresetMatches(matches, rules) {
        const RESULT_WIN = findResultDefinitionInRules(rules, 'W');
        const RESULT_LOSS = findResultDefinitionInRules(rules, 'L');
        const RESULT_DRAW = findResultDefinitionInRules(rules, 'D');
        const RESULT_OT_WIN = findResultDefinitionInRules(rules, 'OW');
        const RESULT_OT_LOSS = findResultDefinitionInRules(rules, 'OL');

        let result = {};
        for (let m of Object.keys(matches)) {
            let r = undefined;
            if (!matches[m]) r = ENTRY_TO_PLAY;
            else {
                let scoreParts = matches[m].split(':');
                let homeScore = +scoreParts[0];
                let awayScore = scoreParts[1];
                if (awayScore.endsWith('o')) {
                    awayScore = +(awayScore.substring(0, awayScore.length - 1));
                    if (homeScore > awayScore) {
                        r = RESULT_OT_WIN;
                    } else if (homeScore < awayScore) {
                        r = RESULT_OT_LOSS;
                    } else {
                        throw new Error('Invalid preset match overtime result');
                    }
                } else {
                    awayScore = +awayScore;
                    if (homeScore > awayScore) {
                        r = RESULT_WIN;
                    } else if (homeScore < awayScore) {
                        r = RESULT_LOSS;
                    } else {
                        r = RESULT_DRAW;
                    }
                }
                r = Object.assign({}, r);
                r.homeScore = homeScore;
                r.awayScore = awayScore;
            }

            result[m] = r;
        }
        return result;
    }

    const rugbyScoreFormatParser = /(?<homeScore>0|[1-9][0-9]*)([(](?<homeTries>[1-9][0-9]*)[)])?:(?<awayScore>0|[1-9][0-9]*)([(](?<awayTries>[1-9][0-9]*)[)])?/;
    function preparePresetRugbyMatches(matches) {
        let result = {};
        for (let m of Object.keys(matches)) {
            let r = undefined;
            const matchScoreStr = matches[m];
            if (!matchScoreStr) r = ENTRY_TO_PLAY;
            else {
                const parsedScore = rugbyScoreFormatParser.exec(matchScoreStr);
                if (!parsedScore) throw new Error('Invalid score syntax ' + matchScoreStr);

                const homeScore = +parsedScore.groups.homeScore;
                const awayScore = +parsedScore.groups.awayScore;
                const homeTries = +(parsedScore.groups.homeTries || 0);
                const awayTries = +(parsedScore.groups.awayTries || 0);

                r = makeRugbyResult(homeScore, awayScore, homeTries, awayTries);
            }

            result[m] = r;
        }
        return result;
    }

    const INV_32 = 1.0 / 0x100000000;
    const RANDOM_BUFFER_SIZE = 1024;
    let randomBuffer = new Uint32Array(RANDOM_BUFFER_SIZE);
    let randomPosition = RANDOM_BUFFER_SIZE;

    function randomNumber() {
        if (randomPosition >= RANDOM_BUFFER_SIZE) {
            crypto.getRandomValues(randomBuffer);
            randomPosition = 0;
        }
        return randomBuffer[randomPosition++] * INV_32;
    }

    function randomPoisson(lambda) {
        const L = Math.exp(-lambda);
        let k = 0;
        let p = 1;
        do {
            ++k;
            let u = randomNumber();
            p = p * u;
        } while (p > L);
        return k - 1;
    }

    function randomTruncatedPoisson(lambda) {
        const eL = Math.exp(-lambda);
        let t = eL / (1 - eL) * lambda;
        let k = 1;
        let s = t;
        let u = randomNumber();
        while (s < u) {
            ++k;
            t = t * lambda / k;
            s += t;
        }
        return k;
    }

    function makeResultWithScore(template, homeScore, awayScore) {
        return Object.assign({ homeScore: homeScore, awayScore: awayScore }, template);
    }

    function generateRandomResult(home, away, rules, teamParameters) {
        var homeParam = teamParameters[home] || 0;
        var awayParam = teamParameters[away] || 0;

        // homeParam *= homeParam;
        // awayParam *= awayParam;
        // homeParam = Math.sqrt(homeParam);
        // awayParam = Math.sqrt(awayParam);

        var sumParam = homeParam + awayParam;
        if (sumParam === 0) {
            return rules.results[Math.floor(Math.random() * rules.results.length)];
        }

        var avgParam = sumParam / 2;
        homeParam += (avgParam - homeParam) * smoothFactor;
        awayParam += (avgParam - awayParam) * smoothFactor;

        var expWin = 1 / (Math.pow(10, -Math.abs(homeParam - awayParam) / 400) + 1);
        var small = 1 - expWin;
        var homeFrac = homeParam < awayParam ? small : expWin;

        /*
        var homeFrac = homeParam / sumParam;
        var small = Math.min(homeFrac, 1 - homeFrac);
        */
        var draw2 = small / 3;
        var drawLow = homeFrac - draw2;
        var drawHigh = homeFrac + draw2;

        var rnd = randomNumber();
        var goals = randomPoisson(1);
        if (rnd >= drawLow && rnd < drawHigh) return makeResultWithScore(rules.results[1], goals, goals);
        var goalDifference = 1 + Math.round((randomTruncatedPoisson(1) - 1) / 2);
        if (rnd < drawLow) return makeResultWithScore(rules.results[0], goals + goalDifference, goals);
        else return makeResultWithScore(rules.results[2], goals, goals + goalDifference);
    }

    function makeRugbyResultWithScore(template, homeScore, awayScore, homeTries, awayTries) {
        if (!template) throw new Error("Invalid score");
        return Object.assign({ homeScore: homeScore, awayScore: awayScore, homeTries: homeTries, awayTries: awayTries }, template);
    }

    function evalRugbyResult(resultNoBonus, resultHomeBonus, resultAwayBonus, resultBothBonus, isHomeBonus, isAwayBonus) {
        if (isHomeBonus) {
            return isAwayBonus ? resultBothBonus : resultHomeBonus;
        } else if (isAwayBonus) {
            return resultAwayBonus;
        } else {
            return resultNoBonus;
        }
    }

    function makeRugbyResult(homeScore, awayScore, homeTries, awayTries) {
        const homeBonusPoint = homeTries >= 4;
        const awayBonusPoint = awayTries >= 4;

        if (homeScore === awayScore) {
            // draw
            return makeRugbyResultWithScore(evalRugbyResult(RESULT_DRAW_NO_BONUS, RESULT_DRAW_HOME_BONUS, RESULT_DRAW_AWAY_BONUS, RESULT_DRAW_BOTH_BONUS, homeBonusPoint, awayBonusPoint), homeScore, awayScore, homeTries, awayTries);
        } else if (homeScore >= awayScore + 7) {
            // big home win
            return makeRugbyResultWithScore(evalRugbyResult(RESULT_WIN_BIG_NO_BONUS, RESULT_WIN_BIG_HOME_BONUS, RESULT_WIN_BIG_AWAY_BONUS, RESULT_WIN_BIG_BOTH_BONUS, homeBonusPoint, awayBonusPoint), homeScore, awayScore, homeTries, awayTries);
        } else if (homeScore > awayScore) {
            // small home win
            return makeRugbyResultWithScore(evalRugbyResult(RESULT_WIN_SMALL_NO_BONUS, RESULT_WIN_SMALL_HOME_BONUS, RESULT_WIN_SMALL_AWAY_BONUS, RESULT_WIN_SMALL_BOTH_BONUS, homeBonusPoint, awayBonusPoint), homeScore, awayScore, homeTries, awayTries);
        } else if (homeScore + 7 <= awayScore) {
            // big away win
            return makeRugbyResultWithScore(evalRugbyResult(RESULT_LOSS_BIG_NO_BONUS, RESULT_LOSS_BIG_HOME_BONUS, RESULT_LOSS_BIG_AWAY_BONUS, RESULT_LOSS_BIG_BOTH_BONUS, homeBonusPoint, awayBonusPoint), homeScore, awayScore, homeTries, awayTries);
        } else if (homeScore < awayScore) {
            // small away win
            return makeRugbyResultWithScore(evalRugbyResult(RESULT_LOSS_SMALL_NO_BONUS, RESULT_LOSS_SMALL_HOME_BONUS, RESULT_LOSS_SMALL_AWAY_BONUS, RESULT_LOSS_SMALL_BOTH_BONUS, homeBonusPoint, awayBonusPoint), homeScore, awayScore, homeTries, awayTries);
        } else {
            // WAT
            throw new Error("Wat");
        }
    }

    function generateRandomRugbyResult(home, away, rules, teamParameters) {
        const homeParam = teamParameters[home] || 0;
        const awayParam = teamParameters[away] || 0;

        if (homeParam === 0 || awayParam === 0) {
            throw new Error(`No data for teams ${home}-${away}`);
        }

        const homeFrac = homeParam / awayParam;
        const homeFrac2 = homeFrac * homeFrac;

        const homeTries = randomPoisson(2 * homeFrac2);
        const awayTries = randomPoisson(2 / homeFrac2);

        const homeAdditional = randomPoisson(6 * homeFrac);
        const awayAdditional = randomPoisson(6 / homeFrac);

        const homeScore = 5 * homeTries + (homeTries ? (homeTries * 2 * 0.7 * randomNumber()) : 0) + homeAdditional;
        const awayScore = 5 * awayTries + (awayTries ? (awayTries * 2 * 0.7 * randomNumber()) : 0) + awayAdditional;

        return makeRugbyResult(homeScore, awayScore, homeTries, awayTries);
    }

    function sortByCriteriumPoints(teams, teamPoints) {
        // 1. sort by points
        teams.sort(function (a, b) {
            return teamPoints[b] - teamPoints[a];
        });

        // 2. group by points
        let result = [];
        let currGroup = null;
        let currPoints = undefined;
        for (let team of teams) {
            let points = teamPoints[team];
            if (!currGroup || points != currPoints) {
                if (currGroup) result.push(currGroup);
                currGroup = [];
                currPoints = points;
            }
            currGroup.push(team);
        }
        if (currGroup) result.push(currGroup);

        return result;
    }

    function sortGroup(teams, matches, algorithm) {
        let state = [{ teams: teams, levelApplied: 0 }];

        var iter = 0;
        while (true) {
            let next = [];
            let sorted = true;

            for (let group of state) {
                if (group.teams.length === 1) {
                    next.push(group);
                    continue;
                }

                sorted = false;
                let appliedLevel = group.levelApplied;
                if (appliedLevel >= algorithm.length) {
                    console.error(state);
                    throw new Error('Unable to sort group');
                }
                let criteriumPoints = algorithm[appliedLevel](group.teams, matches);
                let sortedGroup = sortByCriteriumPoints(group.teams, criteriumPoints);
                if (sortedGroup.length > 1) {
                    for (let g of sortedGroup) next.push({ teams: g, levelApplied: 0 });
                } else {
                    next.push({ teams: group.teams, levelApplied: appliedLevel + 1 });
                }
            }
            if (sorted) break;

            state = next;
            ++iter;
        }

        let result = [];
        for (let group of state) {
            result.push(group.teams[0]);
        }
        return result;
    }

    class ScenarioPart {
        constructor(id) {
            this.id = id;
        }

        getTeam(ref, scenarioResults) {
            let hash = ref.indexOf('#');
            if (hash < 0) return ref;
            let partResults = scenarioResults[ref.substring(0, hash)];
            return partResults.getTeam(ref.substring(hash + 1));
        }

        execute(_scenarioResults, _simulationParameters) {
            throw new Error('Abstract method error');
        }
    }

    class ScenarioPartResult {
        getTeam(_specifier) {
            throw new Error('Abstract method error');
        }
    }

    class GroupResult extends ScenarioPartResult {
        constructor(teams, matchResults, rules) {
            super();
            this.teams = sortGroup(teams, matchResults, rules.sortingAlgorithm);
            this.matchResults = matchResults;
        }

        getTeam(specifier) {
            return this.teams[(+specifier) - 1];
        }
    }

    class Group extends ScenarioPart {
        constructor(id, teams, matches, rules) {
            super(id);
            this.teams = teams;
            this.matches = matches;
            this.rules = rules;
        }

        execute(scenarioResults, simulationParameters) {
            let teams = this.teams.map(t => this.getTeam(t, scenarioResults));
            let matchResults = {};
            for (let id of Object.keys(this.matches)) {
                let teams = id.split('-');
                let matchResult = this.matches[id];
                matchResults[id] = matchResult.type === 'toplay' ? this.rules.genFunc(this.getTeam(teams[0], scenarioResults), this.getTeam(teams[1], scenarioResults), this.rules, simulationParameters) : matchResult;
            }

            return new GroupResult(teams, matchResults, this.rules);
        }
    }

    class LuckyLoserGroup extends ScenarioPart {
        constructor(id, teams, rules) {
            super(id);
            this.teams = teams;
            this.rules = rules;
        }

        execute(scenarioResults, _simulationParameters) {
            let fakeMatches = {};
            let teams = [];
            for (let id of this.teams) {
                let idParts = id.split('#');
                let groupId = idParts[0];
                let team = this.getTeam(id, scenarioResults);
                teams.push(team);
                let groupResults = scenarioResults[groupId];
                let pts = 0;
                let gf = 0;
                let ga = 0;
                for (let matchId of Object.keys(groupResults.matchResults)) {
                    let matchResult = groupResults.matchResults[matchId];
                    if (matchId.startsWith(team + '-')) {
                        pts += matchResult.home;
                        gf += matchResult.homeScore;
                        ga += matchResult.awayScore;
                    }
                    else if (matchId.endsWith('-' + team)) {
                        pts += matchResult.away;
                        gf += matchResult.awayScore;
                        ga += matchResult.homeScore;
                    }
                }
                fakeMatches[team + '-' + team] = { type: 'done', result: '@', home: pts, away: 0, homeScore: gf, awayScore: ga };
            }
            return new GroupResult(teams, fakeMatches, this.rules);
        }
    }

    class GroupSortingResult extends ScenarioPartResult {
        constructor(teams) {
            super();
            this.teams = teams;
        }

        getTeam(specifier) {
            return this.teams[specifier];
        }
    }

    class GroupOriginSorting extends ScenarioPart {
        constructor(id, participants, orderings, naming) {
            super(id);
            this.participants = participants;
            this.orderings = orderings;
            this.naming = naming;
        }

        execute(scenarioResults, _simulationParameters) {
            let participatingTeams = {};
            for (let teamRef of this.participants) {
                let team = this.getTeam(teamRef, scenarioResults);
                participatingTeams[team] = true;
            }
            let groupTeams = {};
            let teamGroups = {};
            let participatingTeamFromGroup = {};
            for (let possibility of this.orderings) {
                for (let groupName of [...possibility]) {
                    if (groupTeams[groupName]) continue;

                    let groupResults = scenarioResults[groupName];
                    for (let team of groupResults.teams) {
                        teamGroups[team] = groupName;
                        if (participatingTeams[team]) participatingTeamFromGroup[groupName] = team;
                    }

                    groupTeams[groupName] = groupResults.teams;
                }
            }

            let participantGroups = Object.keys(participatingTeamFromGroup);
            participantGroups.sort();
            let participantGroupsStr = participantGroups.join();
            for (let possibility of this.orderings) {
                let possibilityGroups = [...possibility];
                let possibilitySorted = possibilityGroups.slice().sort();
                if (participantGroupsStr === possibilitySorted.join()) {
                    let result = {};
                    for (let i = 0; i < possibilityGroups.length; ++i) {
                        let group = possibilityGroups[i];
                        let team = participatingTeamFromGroup[group];
                        result[this.naming[i]] = team;
                    }
                    return new GroupSortingResult(result);
                }
            }

            console.error(scenarioResults, groupTeams, teamGroups, participatingTeamFromGroup, participantGroups);
            throw new Error('No ordering found!');
        }
    }

    class PlayoffTreeResults extends ScenarioPartResult {
        constructor(stageTeams) {
            super();
            this.stageTeams = stageTeams;

            let teamStages = {};
            let stageCount = stageTeams.length;
            for (let s = 0; s < stageCount; ++s) {
                let stage = stageTeams[s];
                // let stageNumber = stageCount - s - 1;

                for (let i = 0; i < stage.length; ++i) {
                    teamStages[stage[i]] = s;
                }
            }

            this.teamStages = teamStages;
        }

        getTeam(specifier) {
            let winner = this.stageTeams[this.stageTeams.length - 1][0];
            switch (specifier) {
                case '1':
                    return winner;

                case '2': {
                    let sf1 = this.stageTeams[this.stageTeams.length - 2][0];
                    let sf2 = this.stageTeams[this.stageTeams.length - 2][1];
                    return winner === sf1 ? sf2 : sf1;
                }

                default:
                    throw new Error('Unsupported specifier');
            }
        }
    }

    class PlayoffTree extends ScenarioPart {
        constructor(id, teams, rules, knownResults) {
            if (teams.length === 0 || teams.length % 2 !== 0) throw new Error('Invalid number of playoff teams');

            super(id);
            this.teams = teams;
            this.rules = rules;
            this.knownResults = knownResults || {};
        }

        execute(scenarioResults, simulationParameters) {
            let resolvedTeams = this.teams.map(t => this.getTeam(t, scenarioResults));

            let currTeams = resolvedTeams;
            let stages = [];
            while (currTeams.length > 1) {
                var nextTeams = [];
                for (let i = 0; i < currTeams.length; i += 2) {
                    let homeTeam = currTeams[i];
                    let awayTeam = currTeams[i + 1];
                    let matchResult = this.knownResults[`${homeTeam}-${awayTeam}`];
                    if (!matchResult) {
                        do {
                            matchResult = this.rules.genFunc(homeTeam, awayTeam, this.rules, simulationParameters);
                        } while (matchResult.home === matchResult.away);
                    }
                    let winner = matchResult.home > matchResult.away ? homeTeam : awayTeam;
                    nextTeams.push(winner);
                }
                stages.push(currTeams);
                currTeams = nextTeams;
            }
            stages.push(currTeams);
            return new PlayoffTreeResults(stages);
        }
    }

    function executeScenario(scenario, simulationParameters) {
        let scenarioResults = {};
        for (let part of scenario) {
            scenarioResults[part.id] = part.execute(scenarioResults, simulationParameters);
        }
        // console.dir(scenarioResults, { depth: null });
        return { result: scenarioResults._result, full: scenarioResults };
    }

    function validateScenario(scenario, rating) {
        for (let part of scenario) {
            if (part instanceof Group) {
                let teamsTable = {};
                for (let team of part.teams) {
                    if (!rating[team]) throw new Error(`Unknown team ${team}`);
                    teamsTable[team] = 1;
                }
                for (let match of Object.keys(part.matches)) {
                    var matchTeams = match.split('-');
                    if (matchTeams.length != 2) throw new Error(`Invalid match syntax ${match}`);
                    for (let matchTeam of matchTeams) {
                        if (!teamsTable[matchTeam]) throw new Error(`Unknown team ${matchTeam}`);
                    }
                }
            }
        }
    }

    function buildRule(def) {
        let type = typeof def === 'string' ? def : def.type;
        switch (type) {
            case 'computeGlobalGoalDifference':
                return computeGlobalGoalDifference;
            case 'computeGlobalGoalsScored':
                return computeGlobalGoalsScored;
            case 'computeGlobalMatchPoints':
                return computeGlobalMatchPoints;
            case 'computeGlobalTriesDifference':
                return computeGlobalTriesDifference;
            case 'computeGlobalTriesScored':
                return computeGlobalTriesScored;
            case 'computeGoalDifference':
                return computeGoalDifference;
            case 'computeGoalsScored':
                return computeGoalsScored;
            case 'computeMatchPoints':
                return computeMatchPoints;
            case 'computeRandomRanking':
                return computeRandomRanking;
            case 'ranking':
                return makeRankingAlgorithm(def.ranking);
            default:
                throw new Error(`Unknown rule definition type ${type}`);
        }
    }

    function getGenFunc(name) {
        switch (name) {
            case 'generateRandomResult':
                return generateRandomResult;
            case 'generateRandomRugbyResult':
                return generateRandomRugbyResult;
            default:
                throw new Error(`Unknown generation function name ${name}`);
        }
    }

    function buildRules(definition) {
        return {
            results: definition.results,
            genFunc: getGenFunc(definition.genFuncName),
            sortingAlgorithm: definition.sortingAlgorithmDefinition.map(buildRule)
        };
    }

    function buildAndValidateScenario(definition, rating) {
        let rules = buildRules(definition.rules);
        let scenario = [];
        for (let part of definition.scenario) {
            switch (part.type) {
                case 'group':
                    scenario.push(new Group(part.label, part.params.members, preparePresetMatches(part.params.matches, rules), rules));
                    break;
                case 'luckylosergroup':
                    scenario.push(new LuckyLoserGroup(part.label, part.params.members, rules));
                    break;
                case 'grouporiginsorting':
                    scenario.push(new GroupOriginSorting(part.label, part.params.members, part.params.orderings, part.params.naming));
                    break;
                case 'playofftree':
                    scenario.push(new PlayoffTree(part.label, part.params.members, rules, part.params.knownResults));
                    break;
                default:
                    throw new Error(`Unknown scenario definition type ${part.type}`);
            }
        }
        validateScenario(scenario, rating);
        return scenario;
    }

    function simulationLoop() {
        let simulationCount = 0;
        let lastUpdate = Date.now();
        let teamPlacements = {};
        let phaseTeamCounts = {};
        let interestingResults = [];
        let interestingCounts = {};

        while (!doTerminate && (!iterationLimit || simulationCount < iterationLimit)) {
            let now = Date.now();
            if (updateFrequency && (now - lastUpdate > updateFrequency)) {
                postMessage({
                    type: 'update',
                    simulationCount: simulationCount,
                    results: {
                        teamPlacements: teamPlacements,
                        phaseTeamCounts: phaseTeamCounts,
                        interestingResults: { count: interestingResults.length, counts: interestingCounts }
                    }
                });

                setTimeout(simulationLoop, 0);
                return;
            }

            ++simulationCount;

            let scenarioResults = executeScenario(scenario, rating);
            let results = scenarioResults.result;
            for (let team of Object.keys(results.teamStages)) {
                let placements = teamPlacements[team] || {};
                let teamStage = results.teamStages[team];
                for (let stage = 0; stage <= teamStage; ++stage) {
                    let currCount = placements[stage] || 0;
                    placements[stage] = currCount + 1;
                }
                teamPlacements[team] = placements;
            }
            // if (!('NED' in results.teamStages) || !('CZE' in results.teamStages)) interestingResults.push(scenarioResults.full);
            //if (scenarioResults.full['B'].teams[0] === 'ESP') interestingResults.push(scenarioResults.full);
            // if ('CZE' in results.teamStages) interestingResults.push(scenarioResults.full);

            let gertur = false;
            for (let s = 0; s < 4 && !gertur; ++s) {
                let t = results.stageTeams[s];
                for (let m = 0; m < t.length; m += 2) {
                    if ((t[m] === 'GER' && t[m + 1] === 'TUR') || (t[m] === 'TUR' && t[m + 1] === 'GER')) {
                        gertur = true;
                        break;
                    }
                }
            }
            if (gertur) interestingResults.push(scenarioResults.full);

            /*
            let czePlayoffPos = results.stageTeams[0].indexOf('CZE');
            if (czePlayoffPos >= 0) {
                let czePartner = results.stageTeams[0][czePlayoffPos ^ 1];
                let counter = interestingCounts[czePartner] ?? 0;
                interestingCounts[czePartner] = counter + 1;
                interestingResults.push(scenarioResults.full);
            } else {
                // console.dir(scenarioResults.full, {depth:null});
            }
            */

            let sfTeams = results.stageTeams[results.stageTeams.length - 2].slice();
            sfTeams.sort();
            var id = sfTeams.join('+');
            let currCount = phaseTeamCounts[id] || 0;
            phaseTeamCounts[id] = currCount + 1;

            //let winner = results.stageTeams[results.stageTeams.length - 1][0];
            //if (winner === 'BEL' || winner === 'SCO' || winner === 'TUR' || winner === 'AUT' || winner === 'ENG' || winner === 'HUN' || winner === 'ALB' || winner === 'ROM' || winner === 'SUI' || winner === 'SRB' || winner === 'SLO' || winner === 'CRO' || winner === 'GEO' || winner === 'UKR' || winner === 'POL') interestingResults.push(scenarioResults.full);

            /*
            let winner = results.stageTeams[results.stageTeams.length - 1][0];
            let finals = results.stageTeams[results.stageTeams.length - 2];
            let semis = results.stageTeams[results.stageTeams.length - 3];
    
            finals.sort();
            semis.sort();
            var id = winner + '|' + finals.join('+') + '|' + semis.join('+');
            let currCount = phaseTeamCounts[id] || 0;
            phaseTeamCounts[id] = currCount + 1;
            */
        }

        postMessage({
            type: 'update',
            simulationCount: simulationCount,
            results: {
                teamPlacements: teamPlacements,
                phaseTeamCounts: phaseTeamCounts,
                interestingResults: { count: interestingResults.length, counts: interestingCounts }
            }
        });
        postMessage({
            type: 'exit',
            id: workerId,
        });
        close();
    }

})();
