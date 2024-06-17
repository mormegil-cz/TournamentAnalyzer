(function () {
    let workerId = 0;
    let doTerminate = false;
    let iterationLimit = 0;
    let smoothFactor = 0;

    let scenario;
    let rating;

    addEventListener('message', (evt) => {
        const msg = evt.data;
        switch (msg.type) {
            case 'run':
                workerId = msg.id;
                iterationLimit = msg.workerData.iterations;
                smoothFactor = msg.workerData.smoothFactor;
                setTimeout(startSimulation, 0);
                break;

            case 'stop':
                doTerminate = true;
                break;

            default:
                throw new Error('Unexpected message for worker thread');
        }
    });

    function startSimulation() {
        runSimulationMain();
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

    function preparePresetMatches(matches) {
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

    const ENTRY_TO_PLAY = { type: 'toplay' };
    const RESULT_WIN = { type: 'done', result: 'W', caption: 'Win', home: 3, away: 0 };
    const RESULT_DRAW = { type: 'done', result: 'D', caption: 'Draw', home: 1, away: 1 };
    const RESULT_OT_WIN = { type: 'done', result: 'OW', caption: 'OT win', home: 2, away: 1 };
    const RESULT_OT_LOSS = { type: 'done', result: 'OL', caption: 'OT loss', home: 1, away: 2 };
    const RESULT_LOSS = { type: 'done', result: 'L', caption: 'Loss', home: 0, away: 3 };

    const RESULT_WIN_BIG_HOME_BONUS = { type: 'done', result: 'WIN_BIG_WINNER_BONUS', caption: 'WIN_BIG_WINNER_BONUS', home: 5, away: 0 };
    const RESULT_WIN_BIG_NO_BONUS = { type: 'done', result: 'WIN_BIG_NO_BONUS', caption: 'WIN_BIG_NO_BONUS', home: 4, away: 0 };
    const RESULT_WIN_BIG_BOTH_BONUS = { type: 'done', result: 'WIN_BIG_BOTH_BONUS', caption: 'WIN_BIG_BOTH_BONUS', home: 5, away: 1 };
    const RESULT_WIN_BIG_AWAY_BONUS = { type: 'done', result: 'WIN_BIG_LOSER_BONUS', caption: 'WIN_BIG_LOSER_BONUS', home: 4, away: 1 };
    const RESULT_WIN_SMALL_HOME_BONUS = { type: 'done', result: 'WIN_SMALL_WINNER_BONUS', caption: 'WIN_SMALL_WINNER_BONUS', home: 5, away: 1 };
    const RESULT_WIN_SMALL_NO_BONUS = { type: 'done', result: 'WIN_SMALL_NO_BONUS', caption: 'WIN_SMALL_NO_BONUS', home: 4, away: 1 };
    const RESULT_WIN_SMALL_BOTH_BONUS = { type: 'done', result: 'WIN_SMALL_BOTH_BONUS', caption: 'WIN_SMALL_BOTH_BONUS', home: 5, away: 2 };
    const RESULT_WIN_SMALL_AWAY_BONUS = { type: 'done', result: 'WIN_SMALL_LOSER_BONUS', caption: 'WIN_SMALL_LOSER_BONUS', home: 4, away: 2 };
    const RESULT_DRAW_HOME_BONUS = { type: 'done', result: 'DRAW_HOME_BONUS', caption: 'DRAW_HOME_BONUS', home: 3, away: 2 };
    const RESULT_DRAW_NO_BONUS = { type: 'done', result: 'DRAW_NO_BONUS', caption: 'DRAW_NO_BONUS', home: 2, away: 2 };
    const RESULT_DRAW_BOTH_BONUS = { type: 'done', result: 'DRAW_BOTH_BONUS', caption: 'DRAW_BOTH_BONUS', home: 3, away: 3 };
    const RESULT_DRAW_AWAY_BONUS = { type: 'done', result: 'DRAW_AWAY_BONUS', caption: 'DRAW_AWAY_BONUS', home: 2, away: 3 };
    const RESULT_LOSS_BIG_AWAY_BONUS = { type: 'done', result: 'LOSS_BIG_WINNER_BONUS', caption: 'LOSS_BIG_WINNER_BONUS', home: 0, away: 5 };
    const RESULT_LOSS_BIG_NO_BONUS = { type: 'done', result: 'LOSS_BIG_NO_BONUS', caption: 'LOSS_BIG_NO_BONUS', home: 0, away: 4 };
    const RESULT_LOSS_BIG_BOTH_BONUS = { type: 'done', result: 'LOSS_BIG_BOTH_BONUS', caption: 'LOSS_BIG_BOTH_BONUS', home: 1, away: 5 };
    const RESULT_LOSS_BIG_HOME_BONUS = { type: 'done', result: 'LOSS_BIG_LOSER_BONUS', caption: 'LOSS_BIG_LOSER_BONUS', home: 1, away: 4 };
    const RESULT_LOSS_SMALL_AWAY_BONUS = { type: 'done', result: 'LOSS_SMALL_WINNER_BONUS', caption: 'LOSS_SMALL_WINNER_BONUS', home: 1, away: 5 };
    const RESULT_LOSS_SMALL_NO_BONUS = { type: 'done', result: 'LOSS_SMALL_NO_BONUS', caption: 'LOSS_SMALL_NO_BONUS', home: 1, away: 4 };
    const RESULT_LOSS_SMALL_BOTH_BONUS = { type: 'done', result: 'LOSS_SMALL_BOTH_BONUS', caption: 'LOSS_SMALL_BOTH_BONUS', home: 2, away: 5 };
    const RESULT_LOSS_SMALL_HOME_BONUS = { type: 'done', result: 'LOSS_SMALL_LOSER_BONUS', caption: 'LOSS_SMALL_LOSER_BONUS', home: 2, away: 4 };

    const UEFA_EURO_2024_RANKING = ['GER', 'POR', 'FRA', 'ESP', 'BEL', 'ENG', 'HUN', 'TUR', 'ROM', 'DEN', 'ALB', 'AUT', 'NED', 'SCO', 'CRO', 'SLO', 'SVK', 'CZE', 'ITA', 'SRB', 'SUI', 'UKR', 'POL', 'GEO'];
    const UEFA_EURO_2024_SORTING_ALGORITHM = [computeMatchPoints, computeGoalDifference, computeGoalsScored, computeGlobalGoalDifference, computeGlobalGoalsScored, computeRandomRanking, makeRankingAlgorithm(UEFA_EURO_2024_RANKING)];
    const FIFA_WORLD_2022_SORTING_ALGORITHM = [computeGlobalMatchPoints, computeGlobalGoalDifference, computeGlobalGoalsScored, computeMatchPoints, computeGoalDifference, computeGoalsScored, computeRandomRanking];

    const WORLD_RUGBY_2023_RANKING = ['IRL', 'RSA', 'FRA', 'NZL', 'SCO', 'ARG', 'FIJ', 'ENG', 'AUS', 'WAL', 'GEO', 'SAM', 'ITA', 'JPN', 'TON', 'POR', 'URU', 'USA', 'ROM', 'ESP', 'NAM', 'CHI'];
    const RUGBY_WORLD_2023_SORTING_ALGORITHM = [computeMatchPoints, computeGlobalGoalDifference, computeGlobalTriesDifference, computeGlobalGoalsScored, computeGlobalTriesScored, makeRankingAlgorithm(WORLD_RUGBY_2023_RANKING)];

    const RULES = {
        IIHF: { results: [RESULT_WIN, RESULT_OT_WIN, RESULT_OT_LOSS, RESULT_LOSS], genFunc: generateRandomResult },
        UEFA: { results: [RESULT_WIN, RESULT_DRAW, RESULT_LOSS], sortingAlgorithm: UEFA_EURO_2024_SORTING_ALGORITHM, genFunc: generateRandomResult },
        FIFA: { results: [RESULT_WIN, RESULT_DRAW, RESULT_LOSS], sortingAlgorithm: FIFA_WORLD_2022_SORTING_ALGORITHM, genFunc: generateRandomResult },
        RWC: {
            results: [
                RESULT_WIN_BIG_HOME_BONUS, RESULT_WIN_BIG_NO_BONUS, RESULT_WIN_BIG_BOTH_BONUS, RESULT_WIN_BIG_AWAY_BONUS,
                RESULT_WIN_SMALL_HOME_BONUS, RESULT_WIN_SMALL_NO_BONUS, RESULT_WIN_SMALL_BOTH_BONUS, RESULT_WIN_SMALL_AWAY_BONUS,
                RESULT_DRAW_HOME_BONUS, RESULT_DRAW_NO_BONUS, RESULT_DRAW_BOTH_BONUS, RESULT_DRAW_AWAY_BONUS,
                RESULT_LOSS_BIG_AWAY_BONUS, RESULT_LOSS_BIG_NO_BONUS, RESULT_LOSS_BIG_BOTH_BONUS, RESULT_LOSS_BIG_HOME_BONUS,
                RESULT_LOSS_SMALL_AWAY_BONUS, RESULT_LOSS_SMALL_NO_BONUS, RESULT_LOSS_SMALL_BOTH_BONUS, RESULT_LOSS_SMALL_HOME_BONUS,
            ], sortingAlgorithm: RUGBY_WORLD_2023_SORTING_ALGORITHM, genFunc: generateRandomRugbyResult
        },
    };

    const FIFA_RANKING = {
        BEL: 1783.38,
        FRA: 1757.3,
        ENG: 1686.78,
        POR: 1666.12,
        ESP: 1648.13,
        ITA: 1642.06,
        DEN: 1631.55,
        GER: 1609.12,
        SUI: 1606.21,
        CRO: 1605.75,
        NED: 1598.04,
        WAL: 1570.36,
        SWE: 1569.81,
        POL: 1549.87,
        AUT: 1523.42,
        UKR: 1514.64,
        SRB: 1512.9,
        TUR: 1505.05,
        SVK: 1475.24,
        HUN: 1468.75,
        RUS: 1462.65,
        CZE: 1458.81,
        NOR: 1452.34,
        ROU: 1449.23,
        SCO: 1441.43,
        IRL: 1427.22,
        NIR: 1425.74,
        GRE: 1418.7,
        ISL: 1415.99,
        FIN: 1410.82,
        BIH: 1404.87,
        MKD: 1374.73,
        SVN: 1369.88,
        MNE: 1368.49,
        ALB: 1362.09,
        BUL: 1339.03,
        ISR: 1283.36,
        BLR: 1276.79,
        ARM: 1273.28,
        GEO: 1259.51,
        LUX: 1244.86,
        CYP: 1240.78,
        AZE: 1168.53,
        FRO: 1165.45,
        EST: 1161.58,
        KVX: 1151.73,
        KAZ: 1147.35,
        LTU: 1102.84,
        LVA: 1081.66,
        AND: 1034.9,
        MLT: 955.89,
        MDA: 948.16,
        LIE: 911.05,
        GIB: 880.16,
        SMR: 804.71
    };

    const ELO_RATING_UEFA = {
        FRA: 2077,
        ESP: 2057,
        POR: 2001,
        BEL: 1988,
        ENG: 1994,
        NED: 1985,
        CRO: 1932,
        ITA: 1957,
        GER: 1938,
        AUT: 1863,
        UKR: 1786,
        DEN: 1827,
        HUN: 1792,
        SUI: 1845,
        SRB: 1788,
        CZE: 1777,
        SCO: 1752,
        TUR: 1757,
        SLO: 1740,
        POL: 1735,
        SVK: 1671,
        GEO: 1666,
        ROM: 1714,
        ALB: 1617
    };

    const ELO_RATING_FIFA = {
        BRA: 2134, // 2150, // 2137, // 2195, // 2185, // 2169,
        ARG: 2137, // 2120, // 2125, // 2118, // 2101, // 2086, // 2141,
        ESP: 1996, // 2007, // 2056, // 2068, // 2045,
        NED: 2073, // 2068, // 2047, // 2036, // 2050, // 2040,
        FRA: 2076, // 2046, // 2018, // 1993, // 2046, // 2022, // 2005,
        BEL: 1948, // 1948, // 2020, // 2007,
        POR: 1999, // 2042, // 1993, // 2044, // 2010, // 2006,
        DEN: 1883, // 1928, // 1952, // 1971,
        GER: 1956, // 1931, // 1919, // 1960,
        URU: 1905, // 1890, // 1924, // 1936,
        SUI: 1878, // 1928, // 1901, // 1911, // 1902,
        CRO: 1935, // 1952, // 1936, // 1945, // 1945, // 1914, // 1922,
        ENG: 1967, // 1995, // 1969, // 1944, // 1957, // 1920,
        SRB: 1835, // 1862, // 1882, // 1898,
        ECU: 1842, // 1885, // 1871, // 1840,
        MEX: 1813, // 1794, // 1809, // 1809,
        IRN: 1779, // 1809, // 1760, // 1817,
        POL: 1802, // 1827, // 1844, // 1814, // 1814,
        USA: 1819, // 1840, // 1810, // 1797, // 1798,
        JPN: 1850, // 1841, // 1792, // 1831, // 1798,
        WAL: 1717, // 1742, // 1791, // 1790,
        KOR: 1788, // 1801, // 1750, // 1798, // 1786,
        CAN: 1712, // 1732, // 1763, // 1776,
        MAR: 1895, // 1925, // 1882, // 1871, // 1851, // 1779, // 1753,
        CRC: 1737, // 1762, // 1723, // 1743,
        AUS: 1772, // 1779, // 1734, // 1702, // 1719,
        TUN: 1747, // 1694, // 1726, // 1687,
        SEN: 1747, // 1773, // 1730, // 1677, // 1687,
        QAT: 1578, // 1589, // 1642, // 1680,
        KSA: 1643, // 1662, // 1692, // 1640,
        CMR: 1679, // 1621, // 1601, // 1610,
        GHA: 1596, // 1611, // 1563, // 1567,
    };

    const WORLD_RUGBY_RATING = {
        IRL: 93.79, // 91.82,
        FRA: 90.59, // 89.22,
        RSA: 89.70, // 91.08,
        NZL: 87.69, // 89.06,
        SCO: 83.43, // 84.01,
        ENG: 83.24, // 79.95,
        WAL: 83.17, // 78.26,
        FIJ: 80.66, // 80.28,
        ARG: 79.31, // 80.86,
        AUS: 76.50, // 79.87,
        ITA: 75.93, // 75.63,
        SAM: 74.47, // 76.19,
        JPN: 73.27, // 73.29,
        GEO: 73.18, // 76.23,
        TON: 70.29, // 70.29,
        POR: 69.75, // 68.61,
        URU: 66.33, // 66.63,
        USA: 66.22,
        ROM: 64.56, // 64.56,
        ESP: 64.05,
        NAM: 61.61, // 61.61,
        CHI: 60.49, // 60.49
    };

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

    function runSimulationMain() {
        rating = ELO_RATING_UEFA;
        scenario = [
            new Group('A', ["GER", "SCO", "HUN", "SUI"], preparePresetMatches({ 'GER-SCO': '5:1', 'HUN-SUI': '1:3', 'GER-HUN': '', 'SCO-SUI': '', 'SUI-GER': '', 'SCO-HUN': '' }), RULES.UEFA),
            new Group('B', ["ESP", "CRO", "ITA", "ALB"], preparePresetMatches({ 'ESP-CRO': '3:0', 'ITA-ALB': '2:1', 'CRO-ALB': '', 'ESP-ITA': '', 'ALB-ESP': '', 'CRO-ITA': '' }), RULES.UEFA),
            new Group('C', ["SLO", "DEN", "SRB", "ENG"], preparePresetMatches({ 'SLO-DEN': '1:1', 'SRB-ENG': '0:1', 'SLO-SRB': '', 'DEN-ENG': '', 'ENG-SLO': '', 'DEN-SRB': '' }), RULES.UEFA),
            new Group('D', ["POL", "NED", "AUT", "FRA"], preparePresetMatches({ 'POL-NED': '1:2', 'AUT-FRA': '', 'POL-AUT': '', 'NED-FRA': '', 'NED-AUT': '', 'FRA-POL': '' }), RULES.UEFA),
            new Group('E', ["BEL", "SVK", "ROM", "UKR"], preparePresetMatches({ 'ROM-UKR': '3:0', 'BEL-SVK': '', 'SVK-UKR': '', 'BEL-ROM': '', 'SVK-ROM': '', 'UKR-BEL': '' }), RULES.UEFA),
            new Group('F', ["TUR", "GEO", "POR", "CZE"], preparePresetMatches({ 'TUR-GEO': '', 'POR-CZE': '', 'GEO-CZE': '', 'TUR-POR': '', 'GEO-POR': '', 'CZE-TUR': '' }), RULES.UEFA),
            new LuckyLoserGroup('LL', ['A#3', 'B#3', 'C#3', 'D#3', 'E#3', 'F#3'], RULES.UEFA),
            new GroupOriginSorting('3P', ['LL#1', 'LL#2', 'LL#3', 'LL#4'], ['ADBC', 'AEBC', 'AFBC', 'DEAB', 'DFAB', 'EFBA', 'EDCA', 'FDCA', 'EFCA', 'EFDA', 'EDBC', 'FDCB', 'FECB', 'FEDB', 'FEDC'], ['1B', '1C', '1E', '1F']),
            new PlayoffTree('_result', ['B#1', '3P#1B', 'A#1', 'C#2', 'F#1', '3P#1F', 'D#2', 'E#2', 'E#1', '3P#1E', 'D#1', 'F#2', 'C#1', '3P#1C', 'A#2', 'B#2'], RULES.UEFA)

            //new PlayoffTree('_result', ['BEL', 'POR', 'ITA', 'AUT', 'FRA', 'SUI', 'CRO', 'ESP', 'SWE', 'UKR', 'ENG', 'GER', 'NED', 'CZE', 'WAL', 'DEN'], RULES.UEFA)
            //new PlayoffTree('_result', ['BEL', 'ITA', 'SUI', 'ESP', 'UKR', 'ENG', 'CZE', 'DEN'], RULES.UEFA)

            /*
            new Group('A', ["QAT", "ECU", "SEN", "NED"], preparePresetMatches({ 'QAT-ECU': '0:2', 'SEN-NED': '0:2', 'QAT-SEN': '1:3', 'NED-ECU': '1:1', 'ECU-SEN': '1:2', 'NED-QAT': '2:0' }), RULES.FIFA),
            new Group('B', ["ENG", "IRN", "USA", "WAL"], preparePresetMatches({ 'ENG-IRN': '6:2', 'USA-WAL': '1:1', 'WAL-IRN': '0:2', 'ENG-USA': '0:0', 'WAL-ENG': '0:3', 'IRN-USA': '0:1' }), RULES.FIFA),
            new Group('C', ["ARG", "KSA", "MEX", "POL"], preparePresetMatches({ 'ARG-KSA': '1:2', 'MEX-POL': '0:0', 'POL-KSA': '2:0', 'ARG-MEX': '2:0', 'POL-ARG': '0:2', 'KSA-MEX': '1:2' }), RULES.FIFA),
            new Group('D', ["FRA", "AUS", "DEN", "TUN"], preparePresetMatches({ 'DEN-TUN': '0:0', 'FRA-AUS': '4:1', 'TUN-AUS': '0:1', 'FRA-DEN': '2:1', 'AUS-DEN': '1:0', 'TUN-FRA': '1:0' }), RULES.FIFA),
            new Group('E', ["ESP", "CRC", "GER", "JPN"], preparePresetMatches({ 'GER-JPN': '1:2', 'ESP-CRC': '7:0', 'JPN-CRC': '0:1', 'ESP-GER': '1:1', 'JPN-ESP': '2:1', 'CRC-GER': '2:4' }), RULES.FIFA),
            new Group('F', ["BEL", "CAN", "MAR", "CRO"], preparePresetMatches({ 'MAR-CRO': '0:0', 'BEL-CAN': '1:0', 'BEL-MAR': '0:2', 'CRO-CAN': '4:1', 'CRO-BEL': '0:0', 'CAN-MAR': '1:2' }), RULES.FIFA),
            new Group('G', ["BRA", "SRB", "SUI", "CMR"], preparePresetMatches({ 'SUI-CMR': '1:0', 'BRA-SRB': '2:0', 'CMR-SRB': '3:3', 'BRA-SUI': '1:0', 'SRB-SUI': '2:3', 'CMR-BRA': '1:0' }), RULES.FIFA),
            new Group('H', ["POR", "GHA", "URU", "KOR"], preparePresetMatches({ 'URU-KOR': '0:0', 'POR-GHA': '3:2', 'KOR-GHA': '2:3', 'POR-URU': '2:0', 'GHA-URU': '0:2', 'KOR-POR': '2:1' }), RULES.FIFA),
            new PlayoffTree('_result', ['A#1', 'B#2', 'C#1', 'D#2', 'E#1', 'F#2', 'G#1', 'H#2', 'B#1', 'A#2', 'D#1', 'C#2', 'F#1', 'E#2', 'H#1', 'G#2'], RULES.FIFA, preparePresetMatches({ 'NED-USA': '3:1', 'ARG-AUS': '2:1', 'FRA-POL': '3:1', 'JPN-CRO': '1:2o', 'BRA-KOR': '4:1', 'ENG-SEN': '3:0', 'MAR-ESP': '1:0o', 'POR-SUI': '6:1', 'CRO-BRA': '2:1o', 'NED-ARG': '2:3o', 'MAR-POR': '1:0', 'ENG-FRA': '1:2', 'ARG-CRO': '3:0', 'FRA-MAR': '2:0' }))
            */

            /*
            new Group('A', ['NZL', 'FRA', 'ITA', 'URU', 'NAM'], preparePresetRugbyMatches( {'FRA-NZL': '27(2):13(2)', 'ITA-NAM': '52(7):8(1)', 'FRA-URU': '27(3):12(2)', 'NZL-NAM': '71(11):3', 'ITA-URU': '38(5):17(2)', 'FRA-NAM': '96(14):0', 'URU-NAM': '35(5):26(2)', 'NZL-ITA': '96(14):17(2)', 'NZL-URU': '73(11):0', 'FRA-ITA': '60(8):7(1)'} ), RULES.RWC),
            new Group('B', ['RSA', 'IRL', 'SCO', 'TON', 'ROM'], preparePresetRugbyMatches( {'IRL-ROM': '82(12):8(1)', 'RSA-SCO': '18(2):3', 'IRL-TON': '59(8):16(1)', 'RSA-ROM': '76(12):0', 'RSA-IRL': '8(1):13(1)', 'SCO-TON': '45(7):17(2)', 'SCO-ROM': '84(12):0', 'RSA-TON': '49(7):18(3)', 'IRL-SCO': '36(6):14(2)', 'TON-ROM': '45(7):24(3)'} ), RULES.RWC),
            new Group('C', ['WAL', 'AUS', 'FIJ', 'GEO', 'POR'], preparePresetRugbyMatches( {'AUS-GEO': '35(4):15(2)', 'WAL-FIJ': '32(4):26(4)', 'WAL-POR': '28(4):8(1)', 'AUS-FIJ': '15(2):22(1)', 'GEO-POR': '18(2):18(2)', 'WAL-AUS': '40(3):6', 'FIJ-GEO': '17(2):12', 'AUS-POR': '34(5):14(2)', 'WAL-GEO': '43(6):19(3)', 'FIJ-POR': '23(2):24(3)'} ), RULES.RWC),
            new Group('D', ['ENG', 'JPN', 'ARG', 'SAM', 'CHI'], preparePresetRugbyMatches( {'ENG-ARG': '27:10(1)', 'JPN-CHI': '42(6):12(2)', 'SAM-CHI': '43(5):10(1)', 'ENG-JPN': '34(4):12', 'ARG-SAM': '19(1):10(1)', 'ENG-CHI': '71(11):0', 'JPN-SAM': '28(3):22(3)', 'ARG-CHI': '59(8):5(1)', 'ENG-SAM': '18(2):17(2)', 'JPN-ARG': '27(3):39(5)'} ), RULES.RWC),
            new PlayoffTree('_result', ['C#1', 'D#2', 'B#1', 'A#2', 'D#1', 'C#2', 'A#1', 'B#2'], RULES.FIFA, preparePresetRugbyMatches({ }))
            */
        ];

        validateScenario(scenario, rating);

        doTerminate = false;

        simulationLoop();
    }

    function simulationLoop() {
        let simulationCount = 0;
        let lastUpdate = Date.now();
        let teamPlacements = {};
        let phaseTeamCounts = {};
        let interestingResults = [];

        while (!doTerminate && (!iterationLimit || simulationCount < iterationLimit)) {
            let now = Date.now();
            if (now - lastUpdate > 1000) {
                postMessage({
                    type: 'update',
                    simulationCount: simulationCount,
                    results: {
                        teamPlacements: teamPlacements,
                        phaseTeamCounts: phaseTeamCounts,
                        interestingResults: { count: interestingResults.length }
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

            let sfTeams = results.stageTeams[results.stageTeams.length - 5].slice();
            sfTeams.sort();
            var id = sfTeams.join('+');
            let currCount = phaseTeamCounts[id] || 0;
            phaseTeamCounts[id] = currCount + 1;

            let winner = results.stageTeams[results.stageTeams.length - 1][0];
            if (winner === 'BEL' || winner === 'SCO' || winner === 'TUR' || winner === 'AUT' || winner === 'ENG' || winner === 'HUN' || winner === 'ALB' || winner === 'ROM' || winner === 'SUI' || winner === 'SRB' || winner === 'SLO' || winner === 'CRO' || winner === 'GEO' || winner === 'UKR' || winner === 'POL') interestingResults.push(scenarioResults.full);

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
                interestingResults: { count: interestingResults.length }
            }
        });
        postMessage({
            type: 'exit',
            id: workerId,
        });
        close();
    }

})();
