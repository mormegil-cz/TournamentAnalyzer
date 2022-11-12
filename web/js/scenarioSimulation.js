const {
    parentPort, workerData
} = require('worker_threads');

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
                    throw 'Invalid preset match overtime result';
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

const crypto = require('crypto');

const INV_32 = 1.0 / 0x100000000;

function randomNumber() {
    var buffer = new ArrayBuffer(4);
    var view = new DataView(buffer);
    crypto.randomFillSync(view);
    return view.getUint32() * INV_32;
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

    var expWin = 1 / (Math.pow(10, -Math.abs(homeParam - awayParam) / 400) + 1)
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
                throw 'Unable to sort group';
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
        throw 'Abstract method error';
    }
}

class ScenarioPartResult {
    getTeam(_specifier) {
        throw 'Abstract method error';
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
            matchResults[id] = matchResult.type === 'toplay' ? generateRandomResult(this.getTeam(teams[0], scenarioResults), this.getTeam(teams[1], scenarioResults), this.rules, simulationParameters) : matchResult;
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
        throw 'No ordering found!';
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
                throw 'Unsupported specifier';
        }
    }
}

class PlayoffTree extends ScenarioPart {
    constructor(id, teams, rules) {
        if (teams.length === 0 || teams.length % 2 !== 0) throw 'Invalid number of playoff teams';

        super(id);
        this.teams = teams;
        this.rules = rules;
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
                let matchResult;
                do {
                    matchResult = generateRandomResult(homeTeam, awayTeam, this.rules, simulationParameters);
                } while (matchResult.home === matchResult.away);
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

const UEFA_EURO_2020_RANKING = ['BEL', 'ITA', 'ENG', 'GER', 'ESP', 'UKR', 'FRA', 'POL', 'SUI', 'CRO', 'NED', 'RUS', 'POR', 'TUR', 'DEN', 'AUT', 'SWE', 'CZE', 'WAL', 'FIN', 'SRB', 'SVK', 'IRL', 'ISL', 'NIR', 'NOR', 'KVX', 'GRE', 'SCO', 'MKD', 'HUN', 'SVN', 'ROU', 'GEO', 'ALB', 'BIH', 'BUL', 'LUX', 'BLR', 'CYP', 'ARM', 'ISR', 'KAZ', 'MNE', 'AZE', 'AND', 'LTU', 'EST', 'FRO', 'GIB', 'MDA', 'MLT', 'LVA', 'LIE', 'SMR'];
const UEFA_EURO_2020_SORTING_ALGORITHM = [computeMatchPoints, computeGoalDifference, computeGoalsScored, computeGlobalGoalDifference, computeGlobalGoalsScored, computeRandomRanking, makeRankingAlgorithm(UEFA_EURO_2020_RANKING)];

const RULES = {
    IIHF: { results: [RESULT_WIN, RESULT_OT_WIN, RESULT_OT_LOSS, RESULT_LOSS] },
    UEFA: { results: [RESULT_WIN, RESULT_DRAW, RESULT_LOSS], sortingAlgorithm: UEFA_EURO_2020_SORTING_ALGORITHM },
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
    BEL: 2158,
    FRA: 2074,
    ITA: 2061,
    ESP: 2027,
    POR: 2006,
    ENG: 2001,
    DEN: 1963,
    NED: 1922,
    GER: 1916,
    SUI: 1907,
    SWE: 1864,
    CZE: 1854,
    CRO: 1825,
    WAL: 1822,
    UKR: 1819,
    SRB: 1784,
    AUT: 1778,
    POL: 1762,
    HUN: 1755,
    NOR: 1738,
    TUR: 1731,
    RUS: 1730,
    FIN: 1706,
    SVK: 1670,
    GRE: 1661,
    SCO: 1629,
    ROU: 1629,
    BIH: 1628,
    IRL: 1622,
    SLO: 1617,
    ISL: 1612,
    ARM: 1584,
    NIR: 1567,
    MKD: 1564,
    ALB: 1556,
    GEO: 1527,
    MNE: 1518,
    BUL: 1500,
    BLR: 1491,
    KOS: 1482,
    EST: 1405,
    LUX: 1386,
    AZE: 1375,
    CYP: 1365,
    KAZ: 1347,
    LTU: 1319,
    LAT: 1281,
    FRO: 1263,
    MDA: 1220,
    MLT: 1219,
    LIE: 1093,
    GIB: 1089,
    AND: 1026,
    SMR: 827
};

const ELO_RATING_FIFA = {
    BRA: 2169,
    ARG: 2141,
    ESP: 2045,
    NED: 2040,
    BEL: 2025,
    FRA: 2005,
    POR: 2004,
    DEN: 1971,
    GER: 1960,
    URU: 1936,
    SUI: 1929,
    CRO: 1922,
    ENG: 1920,
    SRB: 1892,
    ECU: 1840,
    MEX: 1821,
    IRN: 1817,
    POL: 1809,
    USA: 1798,
    JPN: 1798,
    WAL: 1790,
    KOR: 1786,
    CAN: 1765,
    MAR: 1753,
    CRC: 1743,
    AUS: 1719,
    TUN: 1687,
    SEN: 1687,
    QAT: 1680,
    KSA: 1640,
    CMR: 1609,
    GHA: 1540,
};

function executeScenario(scenario, simulationParameters) {
    let scenarioResults = {};
    for (let part of scenario) {
        scenarioResults[part.id] = part.execute(scenarioResults, simulationParameters);
    }
    // console.dir(scenarioResults, { depth: null });
    return { result: scenarioResults._result, full: scenarioResults };
}

function runSimulationMain(iterations) {
    const scenario = [
    /*
        new Group('A', ["TUR", "ITA", "WAL", "SUI"], preparePresetMatches({ 'TUR-ITA': '0:3', 'WAL-SUI': '1:1', 'TUR-WAL': '0:2', 'ITA-SUI': '3:0', 'SUI-TUR': '3:1', 'ITA-WAL': '1:0' }), RULES.UEFA),
        new Group('B', ["DEN", "FIN", "BEL", "RUS"], preparePresetMatches({ 'DEN-FIN': '0:1', 'BEL-RUS': '3:0', 'FIN-RUS': '0:1', 'DEN-BEL': '1:2', 'RUS-DEN': '1:4', 'FIN-BEL': '0:2' }), RULES.UEFA),
        new Group('C', ["NED", "UKR", "AUT", "MKD"], preparePresetMatches({ 'AUT-MKD': '3:1', 'NED-UKR': '3:2', 'UKR-MKD': '2:1', 'NED-AUT': '2:0', 'MKD-NED': '0:3', 'UKR-AUT': '0:1' }), RULES.UEFA),
        new Group('D', ["ENG", "CRO", "CZE", "SCO"], preparePresetMatches({ 'ENG-CRO': '1:0', 'SCO-CZE': '0:2', 'CRO-CZE': '1:1', 'ENG-SCO': '0:0', 'CRO-SCO': '3:1', 'CZE-ENG': '0:1' }), RULES.UEFA),
        new Group('E', ["ESP", "SWE", "POL", "SVK"], preparePresetMatches({ 'POL-SVK': '1:2', 'ESP-SWE': '0:0', 'SWE-SVK': '1:0', 'ESP-POL': '1:1', 'SVK-ESP': '0:5', 'SWE-POL': '3:2' }), RULES.UEFA),
        new Group('F', ["FRA", "GER", "HUN", "POR"], preparePresetMatches({ 'HUN-POR': '0:3', 'FRA-GER': '1:0', 'HUN-FRA': '1:1', 'POR-GER': '2:4', 'POR-FRA': '2:2', 'GER-HUN': '2:2' }), RULES.UEFA),
        new LuckyLoserGroup('LL', ['A#3', 'B#3', 'C#3', 'D#3', 'E#3', 'F#3'], RULES.UEFA),
        new GroupOriginSorting('3P', ['LL#1', 'LL#2', 'LL#3', 'LL#4'], ['ADBC', 'AEBC', 'AFBC', 'DEAB', 'DFAB', 'EFBA', 'EDCA', 'FDCA', 'EFCA', 'EFDA', 'EDBC', 'FDCB', 'FECB', 'FEDB', 'FEDC'], ['1B', '1C', '1E', '1F']),
        new PlayoffTree('_result', ['B#1', '3P#1B', 'A#1', 'C#2', 'F#1', '3P#1F', 'D#2', 'E#2', 'E#1', '3P#1E', 'D#1', 'F#2', 'C#1', '3P#1C', 'A#2', 'B#2'], RULES.UEFA)
    */

        //new PlayoffTree('_result', ['BEL', 'POR', 'ITA', 'AUT', 'FRA', 'SUI', 'CRO', 'ESP', 'SWE', 'UKR', 'ENG', 'GER', 'NED', 'CZE', 'WAL', 'DEN'], RULES.UEFA)
        //new PlayoffTree('_result', ['BEL', 'ITA', 'SUI', 'ESP', 'UKR', 'ENG', 'CZE', 'DEN'], RULES.UEFA)

        new Group('A', ["QAT", "ECU", "SEN", "NED"], preparePresetMatches({ 'QAT-ECU': '', 'SEN-NED': '', 'QAT-SEN': '', 'NED-ECU': '', 'ECU-SEN': '', 'NED-QAT': '' }), RULES.FIFA),
    ];
    
    let teamPlacements = {};
    let phaseTeamCounts = {};
    let interestingResults = {};

    for (let i = 0; i < iterations; ++i) {
        let scenarioResults = executeScenario(scenario, ELO_RATING_FIFA);
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
        let r16Teams = results.stageTeams[0];
        let czePartner = null;
        for (let t = 0; t < r16Teams.length; ++t) {
            if (r16Teams[t] === 'CZE') {
                czePartner = r16Teams[t % 2 ? t - 1 : t + 1];
                break;
            }
        }
        if (czePartner) {
            let currCount = interestingResults[czePartner] || 0;
            interestingResults[czePartner] = currCount + 1;
        }
        let sfTeams = results.stageTeams[results.stageTeams.length - 2].slice();
        sfTeams.sort();
        var id = sfTeams.join('+');
        let currCount = phaseTeamCounts[id] || 0;
        phaseTeamCounts[id] = currCount + 1;
    }

    parentPort.postMessage({
        type: 'done',
        teamPlacements: teamPlacements,
        phaseTeamCounts: phaseTeamCounts,
        interestingResults: interestingResults
    });
}

runSimulationMain(workerData.iterations);
