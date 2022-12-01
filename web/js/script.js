(function () {
    const ENTRY_TO_PLAY = { type: 'toplay' };
    const RESULT_WIN = { type: 'done', result: 'W', caption: 'Win', home: 3, away: 0 };
    const RESULT_DRAW = { type: 'done', result: 'D', caption: 'Draw', home: 1, away: 1 };
    const RESULT_OT_WIN = { type: 'done', result: 'OW', caption: 'OT win', home: 2, away: 1 };
    const RESULT_OT_LOSS = { type: 'done', result: 'OL', caption: 'OT loss', home: 1, away: 2 };
    const RESULT_LOSS = { type: 'done', result: 'L', caption: 'Loss', home: 0, away: 3 };

    const RULES = {
        IIHF: { results: [RESULT_WIN, RESULT_OT_WIN, RESULT_OT_LOSS, RESULT_LOSS] },
        UEFA: { results: [RESULT_WIN, RESULT_DRAW, RESULT_LOSS] },
        FIFA: { results: [RESULT_WIN, RESULT_DRAW, RESULT_LOSS] },
    };

    const UEFA_COUNTRY_COEFF_2021 = {
        ENG: 24.357,
        ESP: 19.500,
        ITA: 16.285,
        GER: 15.214,
        FRA: 7.916,
        POR: 9.600,
        NED: 9.200,
        RUS: 4.333,
        BEL: 6.000,
        AUT: 6.700,
        SCO: 8.500,
        UKR: 6.800,
        TUR: 3.100,
        DEN: 4.125,
        CYP: 4.000,
        SRB: 5.500,
        CZE: 6.600,
        CRO: 5.900,
        SUI: 5.125,
        GRE: 5.100,
        ISR: 7.000,
        NOR: 6.500,
        SWE: 2.500,
        BUL: 4.000,
        ROM: 3.750,
        AZE: 2.500,
        KAZ: 1.000,
        HUN: 4.250,
        BLR: 1.500,
        POL: 4.000,
        SLO: 2.250,
        SVK: 1.500,
        LIE: 0.500,
        LTH: 1.625,
        LUX: 1.000,
        BOS: 2.625,
        IRE: 1.875,
        MKD: 1.750,
        ARM: 1.375,
        LAT: 1.375,
        ALB: 2.000,
        NIR: 2.833,
        GEO: 1.750,
        FIN: 1.375,
        MOL: 1.375,
        MAL: 1.500,
        FAR: 2.750,
        KOS: 1.833,
        GIB: 1.666,
        MNG: 1.625,
        WAL: 1.500,
        ICE: 0.625,
        EST: 1.375,
        AND: 0.666,
        SMA: 0.500,
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

    const POINTS_FORTUNA_LIGA_2021 = {
        SLA: 86,
        SPA: 74,
        JAB: 69,
        SLO: 63,
        PLZ: 58,
        LIB: 52,
        PAR: 52,
        BAN: 49,
        OLO: 45,
        BOH: 43,
        MBO: 39,
        KAR: 39,
        CBU: 38,
        ZLI: 32,
        TEP: 30,
        HRK: 26
    };

    const FOOTBALL_ELO_RATINGS_2022 = {
        BRA: 2195, // 2185, // 2169,
        ARG: 2118, // 2101, // 2086, // 2141,
        ESP: 2056, // 2068, // 2045,
        NED: 2047, // 2036, // 2050, // 2040,
        FRA: 1993, // 2046, // 2022, // 2005,
        BEL: 1948, // 1948, // 2020, // 2007,
        POR: 2044, // 2010, // 2006,
        DEN: 1883, // 1928, // 1952, // 1971,
        GER: 1931, // 1919, // 1960,
        URU: 1890, // 1924, // 1936,
        SUI: 1901, // 1911, // 1902,
        CRO: 1945, // 1945, // 1914, // 1922,
        ENG: 1969, // 1944, // 1957, // 1920,
        SRB: 1862, // 1882, // 1898,
        ECU: 1842, // 1885, // 1871, // 1840,
        MEX: 1813, // 1794, // 1809, // 1809,
        IRN: 1779, // 1809, // 1760, // 1817,
        POL: 1827, // 1844, // 1814, // 1814,
        USA: 1840, // 1810, // 1797, // 1798,
        JPN: 1792, // 1831, // 1798,
        WAL: 1717, // 1742, // 1791, // 1790,
        KOR: 1750, // 1798, // 1786,
        CAN: 1712, // 1732, // 1763, // 1776,
        MAR: 1871, // 1851, // 1779, // 1753,
        CRC: 1762, // 1723, // 1743,
        AUS: 1779, // 1734, // 1702, // 1719,
        TUN: 1747, // 1694, // 1726, // 1687,
        SEN: 1773, // 1730, // 1677, // 1687,
        QAT: 1578, // 1589, // 1642, // 1680,
        KSA: 1643, // 1662, // 1692, // 1640,
        CMR: 1621, // 1601, // 1610,
        GHA: 1611, // 1563, // 1567,
    };

    const PRESETS = {
        "UEFA 2020 Group A": { teams: ["TUR", "ITA", "WAL", "SUI"], matches: preparePresetMatches({ 'TUR-ITA': '', 'WAL-SUI': '', 'TUR-WAL': '', 'ITA-SUI': '', 'SUI-TUR': '', 'ITA-WAL': '' }), rules: RULES.UEFA, teamParameters: FIFA_RANKING },
        "UEFA 2020 Group B": { teams: ["DEN", "FIN", "BEL", "RUS"], matches: preparePresetMatches({ 'DEN-FIN': '', 'BEL-RUS': '', 'FIN-RUS': '', 'DEN-BEL': '', 'RUS-DEN': '', 'FIN-BEL': '' }), rules: RULES.UEFA, teamParameters: FIFA_RANKING },
        "UEFA 2020 Group C": { teams: ["NED", "UKR", "AUT", "MKD"], matches: preparePresetMatches({ 'AUT-MKD': '', 'NED-UKR': '', 'UKR-MKD': '', 'NED-AUT': '', 'MKD-NED': '', 'UKR-AUT': '' }), rules: RULES.UEFA, teamParameters: FIFA_RANKING },
        "UEFA 2020 Group D": { teams: ["ENG", "CRO", "CZE", "SCO"], matches: preparePresetMatches({ 'ENG-CRO': '', 'SCO-CZE': '', 'CRO-CZE': '', 'ENG-SCO': '', 'CRO-SCO': '', 'CZE-ENG': '' }), rules: RULES.UEFA, teamParameters: FIFA_RANKING },
        "UEFA 2020 Group E": { teams: ["ESP", "SWE", "POL", "SVK"], matches: preparePresetMatches({ 'POL-SVK': '', 'ESP-SWE': '', 'SWE-SVK': '', 'ESP-POL': '', 'SVK-ESP': '', 'SWE-POL': '' }), rules: RULES.UEFA, teamParameters: FIFA_RANKING },
        "UEFA 2020 Group F": { teams: ["FRA", "GER", "HUN", "POR"], matches: preparePresetMatches({ 'HUN-POR': '', 'FRA-GER': '', 'HUN-FRA': '', 'POR-GER': '', 'POR-FRA': '', 'GER-HUN': '' }), rules: RULES.UEFA, teamParameters: FIFA_RANKING },
        "Fortuna:LIGA 2021/22": { teams: Object.keys(POINTS_FORTUNA_LIGA_2021), matches: prepareAllMatches(Object.keys(POINTS_FORTUNA_LIGA_2021)), rules: RULES.UEFA, teamParameters: POINTS_FORTUNA_LIGA_2021 },

        "FIFA 2022 Group A": { teams: ["QAT", "ECU", "SEN", "NED"], matches: preparePresetMatches({ 'QAT-ECU': '', 'SEN-NED': '', 'QAT-SEN': '', 'NED-ECU': '', 'ECU-SEN': '', 'NED-QAT': '' }), rules: RULES.FIFA, teamParameters: FOOTBALL_ELO_RATINGS_2022 },
        "FIFA 2022 Group C": { teams: ["ARG", "KSA", "MEX", "POL"], matches: preparePresetMatches({ 'ARG-KSA': 'L', 'MEX-POL': 'D', 'POL-KSA': 'W', 'ARG-MEX': 'W', 'POL-ARG': '', 'KSA-MEX': '' }), rules: RULES.FIFA, teamParameters: FOOTBALL_ELO_RATINGS_2022 },
        "FIFA 2022 Group E": { teams: ["ESP", "CRC", "GER", "JPN"], matches: preparePresetMatches({ 'GER-JPN': 'L', 'ESP-CRC': 'W', 'JPN-CRC': 'L', 'ESP-GER': 'D', 'JPN-ESP': '', 'CRC-GER': '' }), rules: RULES.FIFA, teamParameters: FOOTBALL_ELO_RATINGS_2022 },
    };

    var simulationWorker;
    var simulationResults;

    var rules = {};
    var teams = [];
    var teamParameters = {};
    var teamPoints = {};
    var matches = {};

    function init() {
        document.getElementById('startSimulation').addEventListener('click', startSimulation);
        document.getElementById('stopSimulation').addEventListener('click', stopSimulation);
        loadPresets();
        refreshTeams();
        sortTeams();
    }

    function addAlert(type, msg) {
        var alertElem = document.createElement('div');
        document.getElementById('alertcontainer').append(alertElem);
        alertElem.outerHTML = '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' + msg + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    }

    function setButtonEnabled(id, enabled) {
        var btn = document.getElementById(id);
        if (enabled) {
            btn.removeAttribute('disabled');
        } else {
            btn.setAttribute('disabled', 'disabled');
        }
    }

    function preparePresetMatches(matches) {
        let result = {};
        for (let m of Object.keys(matches)) {
            switch (matches[m]) {
                case '':
                    r = ENTRY_TO_PLAY;
                    break;

                case 'W':
                    r = RESULT_WIN;
                    break;

                case 'OW':
                    r = RESULT_OT_WIN;
                    break;

                case 'OL':
                    r = RESULT_OT_LOSS;
                    break;

                case 'L':
                    r = RESULT_LOSS;
                    break;

                case 'D':
                    r = RESULT_DRAW;
                    break;

                default:
                    throw 'Invalid preset match result';
            }
            result[m] = r;
        }
        return result;
    }

    function prepareAllMatches(teams) {
        let result = {};
        for (let home of teams) {
            for (let away of teams) {
                if (home !== away) result[home + '-' + away] = ENTRY_TO_PLAY;
            }
        }
        return result;
    }

    function loadPresets() {
        var ul = document.getElementById('dropdownPresetList');
        ul.innerText = '';
        for (let preset of Object.keys(PRESETS)) {
            let li = document.createElement('li');
            let a = document.createElement('a');
            a.className = 'dropdown-item';
            a.setAttribute('href', '#');
            a.innerText = preset;
            let p = preset;
            a.addEventListener('click', function () {
                let chosen = PRESETS[p];
                rules = chosen.rules;
                teams = chosen.teams.slice();
                teamParameters = JSON.parse(JSON.stringify(chosen.teamParameters));
                matches = JSON.parse(JSON.stringify(chosen.matches));
                refreshTeams();
            });
            li.append(a);
            ul.append(li);
        }
    }

    function addTeam() {
        var addedTeam = window.prompt('Team?');
        if (!addedTeam) return;

        addedTeam = addedTeam.trim().toUpperCase();
        if (!addedTeam) return;
        if (!/^[A-Z]{2,15}$/.test(addedTeam)) {
            addAlert('danger', 'Invalid team code');
            return;
        }

        if (teams.indexOf(addedTeam) >= 0) {
            addAlert('danger', 'Team ' + addedTeam + ' already exists');
            return;
        }

        teams.push(addedTeam);
        refreshTeams();
    }

    function removeTeam(team) {
        if (!window.confirm("Really remove " + team + "?")) return;

        var index = teams.indexOf(team);
        if (index < 0) return;
        teams.splice(index, 1);

        for (let match of Object.keys(matches)) {
            if (match.startsWith(team + '-') || match.endsWith('-' + team)) {
                matches[match] = undefined;
            }
        }

        refreshTeams();
    }

    function configureTeamParams(team) {
        let param = window.prompt('Team parameter for ' + team + '?', teamParameters[team] || '0');
        if (!param) return;

        teamParameters[team] = +param;
        refreshTeams();
    }

    function refreshTeams() {
        let container = document.getElementById('teams');
        container.innerText = '';
        for (let team of teams) {
            let a = document.createElement('a');
            a.setAttribute('href', '#');
            a.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
            a.innerText = team;

            let t = team;

            let badge = document.createElement('span');
            badge.className = 'badge bg-primary rounded-pill';
            badge.innerText = teamParameters[team] || '0';
            badge.addEventListener('click', function (e) { configureTeamParams(t); e.stopPropagation(); });
            a.append(badge);

            a.addEventListener('click', function () { removeTeam(t); });
            container.append(a);
        }
        let btn = document.createElement('a');
        btn.setAttribute('href', '#');
        btn.className = 'list-group-item list-group-item-action list-group-item-primary';
        btn.innerText = 'Add team';
        btn.addEventListener('click', addTeam);
        container.append(btn);

        refreshTeamTable();
    }

    function sortTeams() {
        teams = SimulationCommon.sortGroup(teams, matches);
        refreshTeams();
        refreshTeamTable();
    }

    function refreshTeamTable() {
        let matchTable = document.getElementById('matchTable');
        matchTable.innerText = '';
        let matchHeadRow = document.createElement('tr');
        matchHeadRow.append(document.createElement('th'));
        let simulationTable = document.getElementById('simulationTable');
        simulationTable.innerText = '';
        let simulationHeadRow = document.createElement('tr');
        simulationHeadRow.append(document.createElement('th'));
        let i = 0;
        for (let team of teams) {
            let th = document.createElement('th');
            th.innerText = team;
            matchHeadRow.append(th);

            if (i > 0) {
                let th = document.createElement('th');
                th.innerText = '' + i;
                simulationHeadRow.append(th);
            }
            ++i;
        }
        let scoreTh = document.createElement('th');
        scoreTh.className = 'pointsCol';
        scoreTh.innerHTML = '<a href="#">Pts</a>';
        scoreTh.addEventListener('click', sortTeams);
        matchHeadRow.append(scoreTh);
        matchTable.append(matchHeadRow);
        simulationTable.append(simulationHeadRow);

        for (let home of teams) {
            let matchTr = document.createElement('tr');
            let th = document.createElement('th');
            th.innerText = home;
            matchTr.append(th);

            let simulationTr = document.createElement('tr');
            th = document.createElement('th');
            th.id = 'simulation-row-' + home;
            th.innerText = home;
            simulationTr.append(th);

            let points = 0;
            let i = 0;
            for (let away of teams) {
                let td = document.createElement('td');
                if (home === away) {
                    td.innerText = "—";
                } else {
                    td.append(createMatchDropdown(home, away, 'done'));
                }
                matchTr.append(td);
                points += getPoints(home, away);

                if (i > 0) {
                    let simulationTd = document.createElement('td');
                    let pos = i;
                    simulationTd.id = 'simulation-' + home + '-' + i;
                    simulationTd.addEventListener('click', function () { showSimulationDetail(home, pos); });
                    simulationTr.append(simulationTd);
                }
                ++i;
            }
            let scoreTd = document.createElement('td');
            scoreTd.className = 'pointsCol';
            teamPoints[home] = points;
            scoreTd.innerText = '' + points;
            matchTr.append(scoreTd);
            matchTable.append(matchTr);

            simulationTable.append(simulationTr);
        }
    }

    function formatOrdinal(num) {
        var tail = num % 100;
        if (tail > 3 && tail < 21) {
            return num + 'th';
        }
        var digit = num % 10;
        switch (digit) {
            case 1:
                return num + 'st';
            case 2:
                return num + 'nd';
            case 3:
                return num + 'rd';
            default:
                return num + 'th';
        }
    }

    function appendSimulatedMatch(tr, count, total, matches) {
        let td = document.createElement('td');
        td.innerText = count ? (Math.round(100 * count / total) + ' %') : '—';
        td.setAttribute('title', JSON.stringify(matches));
        tr.append(td);
    }

    function renderSimulationDetailMatchTable(elemId, simulatedMatches, total) {
        var detail = document.getElementById(elemId);
        detail.innerText = '';

        var headRow = document.createElement('tr');
        var caption = ['<th>Match</th>'];
        for (let r of rules.results) {
            caption.push('<th>');
            caption.push(r.caption);
            caption.push('</th>');
        }
        headRow.innerHTML = caption.join('');
        detail.append(headRow);

        for (let id of Object.keys(matches)) {
            let match = matches[id];
            if (match.type !== 'toplay') continue;

            let simulatedMatch = simulatedMatches[id] || {};
            let tr = document.createElement('tr');

            let th = document.createElement('th');
            th.innerText = id;
            tr.append(th);

            for (let r of rules.results) {
                appendSimulatedMatch(tr, simulatedMatch[r.result], total, simulatedMatch[r.result + '-matches']);
            }

            detail.append(tr);
        }
    }

    function showSimulationDetail(team, place) {
        if (!simulationResults) return;

        document.getElementById('simulationDetailTeam').innerText = team;
        document.getElementById('simulationDetailPlace').innerText = formatOrdinal(place);

        var total = simulationResults.simulationCount;
        var teamResults = simulationResults.results[team][place - 1];
        var successTotal = teamResults.count;
        renderSimulationDetailMatchTable('simulationSuccessMatches', teamResults.successMatches, successTotal);
        renderSimulationDetailMatchTable('simulationFailMatches', teamResults.failMatches, total - successTotal);

        var offcanvas = new bootstrap.Offcanvas(document.getElementById('simulationDetailOffCanvas'));
        offcanvas.show();
    }

    function refreshSimulationResults(results, total) {
        if (!simulationResults) return;

        var results = simulationResults.results;
        var total = simulationResults.simulationCount;
        for (let team of Object.keys(results)) {
            let data = results[team];
            for (let i = 0; i < teams.length - 1; ++i) {
                let cell = document.getElementById('simulation-' + team + '-' + (i + 1));
                cell.innerText = total > 0 ? Math.round(100 * data[i].count / total) + ' %' : '—';
            }
        }
    }

    function getPoints(home, away) {
        return getPointsOneSide(home, away, 'home') + getPointsOneSide(away, home, 'away');
    }

    function getPointsOneSide(a, b, side) {
        var matchId = a + '-' + b;
        var matchEntry = matches[matchId];
        return matchEntry && matchEntry.type === 'done' ? matchEntry[side] : 0;
    }

    function createMatchDropdown(home, away) {
        var matchId = home + '-' + away;
        var entry = matches[matchId];
        var resultType = entry ? entry.type : 'none';

        var typeColor, typeName;
        switch (resultType) {
            case 'none':
                typeColor = 'secondary';
                typeName = 'No match';
                break;
            case 'done':
                typeColor = 'info';
                typeName = entry.caption;
                break;
            case 'toplay':
                typeColor = 'primary';
                typeName = 'To play';
                break;
        }
        var div = document.createElement('div');
        div.className = 'dropdown';
        var a = document.createElement('a');
        a.className = 'btn dropdown-toggle btn-' + typeColor;
        a.id = 'dropdown-match-' + matchId;
        a.setAttribute('href', '#');
        a.setAttribute('role', 'button');
        a.setAttribute('data-bs-toggle', 'dropdown');
        a.setAttribute('aria-expanded', 'false');
        a.innerText = typeName;
        div.append(a);
        var ul = document.createElement('ul');
        ul.className = 'dropdown-menu';
        ul.setAttribute('aria-labelledby', a.id);

        ul.append(createMatchResultOption('No match', matchId, null));
        ul.append(createMatchResultOption('To play', matchId, ENTRY_TO_PLAY));

        var divider = document.createElement('li');
        divider.innerHTML = '<hr class="dropdown-divider" />';
        ul.append(divider)

        for (let r of rules.results) {
            ul.append(createMatchResultOption(r.caption, matchId, r));
        }

        div.append(ul);
        return div;
    }

    function createMatchResultOption(caption, matchId, entry) {
        var result = document.createElement('li');
        var a = document.createElement('a');
        a.className = 'dropdown-item';
        a.setAttribute('href', '#');
        a.innerText = caption;
        a.addEventListener('click', function () {
            matches[matchId] = entry;
            refreshTeamTable();
        });
        result.append(a);
        return result;
    }

    function startSimulation() {
        setButtonEnabled('startSimulation', false);
        setButtonEnabled('stopSimulation', true);
        simulationWorker = new Worker('js/simulationWorker.js');
        simulationWorker.onmessage = function (e) {
            var msg = e.data;
            simulationResults = msg;
            document.getElementById('simulationStats').innerText = 'After ' + msg.simulationCount + ' simulations (' + Math.round(msg.simulationTime / 1000) + ' sec)';
            refreshSimulationResults();
        }
        simulationWorker.postMessage({ request: 'start', teams: teams, teamParameters: teamParameters, matches: matches, rules: rules });
    }

    function stopSimulation() {
        setButtonEnabled('stopSimulation', false);
        if (simulationWorker) {
            simulationWorker.postMessage({ request: 'stop' });
        }
        setTimeout(forceStopSimulation, 1000);
    }

    function forceStopSimulation() {
        if (simulationWorker) {
            simulationWorker.terminate();
            simulationWorker = null;
        }

        setButtonEnabled('startSimulation', true);
    }

    init();
})();
