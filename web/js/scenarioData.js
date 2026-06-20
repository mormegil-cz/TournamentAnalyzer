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
const FIFA_WORLD_2026_RANKING = ['FRA', 'ESP', 'ARG', 'ENG', 'POR', 'BRA', 'NED', 'MAR', 'BEL', 'GER', 'CRO', 'COL', 'SEN', 'MEX', 'USA', 'URU', 'JPN', 'SUI', 'IRN', 'TUR', 'ECU', 'AUT', 'KOR', 'AUS', 'ALG', 'EGY', 'CAN', 'NOR', 'SWE', 'PAN', 'CIV', 'PAR', 'CZE', 'SCO', 'TUN', 'COD', 'UZB', 'QAT', 'IRQ', 'RSA', 'KSA', 'JOR', 'BIH', 'CPV', 'GHA', 'CUW', 'HAI', 'NZL'];
const UEFA_EURO_2024_SORTING_ALGORITHM_DEF = ['computeMatchPoints', 'computeGoalDifference', 'computeGoalsScored', 'computeGlobalGoalDifference', 'computeGlobalGoalsScored', {type: 'ranking', ranking: UEFA_EURO_2024_RANKING}];
const FIFA_WORLD_2022_SORTING_ALGORITHM_DEF = ['computeGlobalMatchPoints', 'computeGlobalGoalDifference', 'computeGlobalGoalsScored', 'computeMatchPoints', 'computeGoalDifference', 'computeGoalsScored', 'computeRandomRanking'];
const FIFA_WORLD_2026_SORTING_ALGORITHM_DEF = ['computeMatchPoints', 'computeGoalDifference', 'computeGoalsScored', 'computeGlobalGoalDifference', 'computeGlobalGoalsScored', {type: 'ranking', ranking: FIFA_WORLD_2026_RANKING}];

const WORLD_RUGBY_2023_RANKING = ['IRL', 'RSA', 'FRA', 'NZL', 'SCO', 'ARG', 'FIJ', 'ENG', 'AUS', 'WAL', 'GEO', 'SAM', 'ITA', 'JPN', 'TON', 'POR', 'URU', 'USA', 'ROM', 'ESP', 'NAM', 'CHI'];
const RUGBY_WORLD_2023_SORTING_ALGORITHM_DEF = ['computeMatchPoints', 'computeGlobalGoalDifference', 'computeGlobalTriesDifference', 'computeGlobalGoalsScored', 'computeGlobalTriesScored', {type: 'ranking', ranking: WORLD_RUGBY_2023_RANKING}];

const IIHF_2026_RANKING = ['USA', 'SUI', 'CAN', 'SWE', 'CZE', 'FIN', 'GER', 'DEN', 'SVK', 'LAT', 'AUT', 'NOR', 'SLO', 'HUN', 'GBR', 'ITA'];
const IIHF_2026_SORTING_ALGORITHM_DEF = ['computeMatchPoints', 'computeGoalDifference', 'computeGoalsScored', {type: 'ranking', ranking: IIHF_2026_RANKING}];

const RULES = {
    IIHF: { results: [RESULT_WIN, RESULT_OT_WIN, RESULT_OT_LOSS, RESULT_LOSS], sortingAlgorithmDefinition: IIHF_2026_SORTING_ALGORITHM_DEF, genFuncName: 'generateRandomResult' },
    UEFA: { results: [RESULT_WIN, RESULT_DRAW, RESULT_LOSS], sortingAlgorithmDefinition: UEFA_EURO_2024_SORTING_ALGORITHM_DEF, genFuncName: 'generateRandomResult' },
    FIFA: { results: [RESULT_WIN, RESULT_DRAW, RESULT_LOSS], sortingAlgorithmDefinition: FIFA_WORLD_2026_SORTING_ALGORITHM_DEF, genFuncName: 'generateRandomResult' },
    RWC: {
        results: [
            RESULT_WIN_BIG_HOME_BONUS, RESULT_WIN_BIG_NO_BONUS, RESULT_WIN_BIG_BOTH_BONUS, RESULT_WIN_BIG_AWAY_BONUS,
            RESULT_WIN_SMALL_HOME_BONUS, RESULT_WIN_SMALL_NO_BONUS, RESULT_WIN_SMALL_BOTH_BONUS, RESULT_WIN_SMALL_AWAY_BONUS,
            RESULT_DRAW_HOME_BONUS, RESULT_DRAW_NO_BONUS, RESULT_DRAW_BOTH_BONUS, RESULT_DRAW_AWAY_BONUS,
            RESULT_LOSS_BIG_AWAY_BONUS, RESULT_LOSS_BIG_NO_BONUS, RESULT_LOSS_BIG_BOTH_BONUS, RESULT_LOSS_BIG_HOME_BONUS,
            RESULT_LOSS_SMALL_AWAY_BONUS, RESULT_LOSS_SMALL_NO_BONUS, RESULT_LOSS_SMALL_BOTH_BONUS, RESULT_LOSS_SMALL_HOME_BONUS,
        ], sortingAlgorithmDefinition: RUGBY_WORLD_2023_SORTING_ALGORITHM_DEF, genFuncName: 'generateRandomRugbyResult'
    },
};

const FIFA_RANKING = {
    'FRA': 1877.32,
    'ESP': 1876.40,
    'ARG': 1874.81,
    'ENG': 1825.97,
    'POR': 1763.83,
    'BRA': 1761.16,
    'NED': 1757.87,
    'MAR': 1755.87,
    'BEL': 1734.71,
    'GER': 1730.37,
    'CRO': 1717.07,
    'COL': 1693.09,
    'SEN': 1688.99,
    'MEX': 1681.03,
    'USA': 1674.22,
    'URU': 1670.45,
    'JPN': 1661.88,
    'SUI': 1655.72,
    'IRN': 1637.44,
    'TUR': 1635.16,
    'ECU': 1631.22,
    'AUT': 1629.54,
    'KOR': 1624.67,
    'AUS': 1605.11,
    'ALG': 1599.42,
    'EGY': 1593.86,
    'CAN': 1588.11,
    'NOR': 1583.54,
    'SWE': 1577.83,
    'PAN': 1569.08,
    'CIV': 1566.39,
    'PAR': 1538.91,
    'CZE': 1534.92,
    'SCO': 1528.76,
    'TUN': 1523.57,
    'COD': 1511.18,
    'UZB': 1498.47,
    'QAT': 1471.25,
    'IRQ': 1463.12,
    'RSA': 1450.88,
    'KSA': 1448.33,
    'JOR': 1439.67,
    'BIH': 1431.04,
    'CPV': 1415.06,
    'GHA': 1392.14,
    'CUW': 1351.72,
    'HAI': 1348.11,
    'NZL': 1340.29,
};

const RECENT_COEFFICIENT = 0.5;
function emphasizeRecentCoeff(current, start) {
    return current + RECENT_COEFFICIENT * (current - start);
}

const ELO_RATING_UEFA = {
    FRA: emphasizeRecentCoeff(2061, 2077),
    ESP: emphasizeRecentCoeff(2079, 2057),
    POR: emphasizeRecentCoeff(1964, 2003),
    BEL: emphasizeRecentCoeff(1951, 1988),
    ENG: emphasizeRecentCoeff(1968, 1981),
    NED: emphasizeRecentCoeff(1959, 1974),
    CRO: emphasizeRecentCoeff(1916, 1969),
    ITA: emphasizeRecentCoeff(1937, 1950),
    GER: emphasizeRecentCoeff(1939, 1920),
    AUT: emphasizeRecentCoeff(1910, 1863),
    UKR: emphasizeRecentCoeff(1816, 1853),
    DEN: emphasizeRecentCoeff(1834, 1834),
    HUN: emphasizeRecentCoeff(1801, 1832),
    SUI: emphasizeRecentCoeff(1852, 1805),
    SRB: emphasizeRecentCoeff(1789, 1801),
    CZE: emphasizeRecentCoeff(1732, 1777),
    SCO: emphasizeRecentCoeff(1735, 1770),
    TUR: emphasizeRecentCoeff(1785, 1749),
    SLO: emphasizeRecentCoeff(1758, 1733),
    POL: emphasizeRecentCoeff(1730, 1746),
    SVK: emphasizeRecentCoeff(1694, 1671),
    GEO: emphasizeRecentCoeff(1714, 1666),
    ROM: emphasizeRecentCoeff(1698, 1647),
    ALB: emphasizeRecentCoeff(1631, 1624)
};

const ELO_RATING_FIFA = {
    'ESP': emphasizeRecentCoeff(2129, 2165),
    'ARG': emphasizeRecentCoeff(2128, 2113),
    'FRA': emphasizeRecentCoeff(2084, 2081),
    'ENG': emphasizeRecentCoeff(2055, 2020),
    'POR': emphasizeRecentCoeff(1967, 1984),
    'BRA': emphasizeRecentCoeff(1978, 1984),
    'COL': emphasizeRecentCoeff(1998, 1975),
    'NED': emphasizeRecentCoeff(1944, 1961),
    'ECU': emphasizeRecentCoeff(1890, 1933),
    'CRO': emphasizeRecentCoeff(1881, 1930),
    'GER': emphasizeRecentCoeff(1939, 1923),
    'NOR': emphasizeRecentCoeff(1929, 1912),
    'JPN': emphasizeRecentCoeff(1910, 1904),
    'TUR': emphasizeRecentCoeff(1849, 1902),
    'URU': emphasizeRecentCoeff(1870, 1892),
    'SUI': emphasizeRecentCoeff(1885, 1889),
    'SEN': emphasizeRecentCoeff(1839, 1878),
    'BEL': emphasizeRecentCoeff(1879, 1867),
    'MEX': emphasizeRecentCoeff(1896, 1860),
    'PAR': emphasizeRecentCoeff(1780, 1833),
    'AUT': emphasizeRecentCoeff(1857, 1827),
    'MAR': emphasizeRecentCoeff(1840, 1822),
    'CAN': emphasizeRecentCoeff(1777, 1784),
    'AUS': emphasizeRecentCoeff(1839, 1783),
    'SCO': emphasizeRecentCoeff(1794, 1767),
    'IRN': emphasizeRecentCoeff(1756, 1760),
    'KOR': emphasizeRecentCoeff(1771, 1752),
    'ALG': emphasizeRecentCoeff(1759, 1743),
    'PAN': emphasizeRecentCoeff(1683, 1737),
    'UZB': emphasizeRecentCoeff(1698, 1727),
    'CZE': emphasizeRecentCoeff(1696, 1726),
    'USA': emphasizeRecentCoeff(1780, 1721),
    'SWE': emphasizeRecentCoeff(1755, 1719),
    'JOR': emphasizeRecentCoeff(1653, 1690),
    'EGY': emphasizeRecentCoeff(1711, 1689),
    'CIV': emphasizeRecentCoeff(1743, 1676),
    'COD': emphasizeRecentCoeff(1674, 1655),
    'TUN': emphasizeRecentCoeff(1585, 1636),
    'IRQ': emphasizeRecentCoeff(1592, 1607),
    'BIH': emphasizeRecentCoeff(1596, 1594),
    'NZL': emphasizeRecentCoeff(1578, 1585),
    'KSA': emphasizeRecentCoeff(1598, 1568),
    'CPV': emphasizeRecentCoeff(1606, 1549),
    'HAI': emphasizeRecentCoeff(1536, 1532),
    'RSA': emphasizeRecentCoeff(1527, 1524),
    'GHA': emphasizeRecentCoeff(1557, 1503),
    'CUW': emphasizeRecentCoeff(1427, 1436),
    'QAT': emphasizeRecentCoeff(1437, 1425),
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

const ELO_RATING_IIHF = {
    'USA': emphasizeRecentCoeff(2538, 2717),
    'CAN': emphasizeRecentCoeff(2693, 2654),
    'SWE': emphasizeRecentCoeff(2444, 2598),
    'FIN': emphasizeRecentCoeff(2564, 2454),
    'CZE': emphasizeRecentCoeff(2345, 2418),
    'SUI': emphasizeRecentCoeff(2514, 2378),
    'SVK': emphasizeRecentCoeff(2216, 2249),
    'GER': emphasizeRecentCoeff(2211, 2209),
    'LAT': emphasizeRecentCoeff(2199, 2150),
    'DEN': emphasizeRecentCoeff(2056, 2105),
    'AUT': emphasizeRecentCoeff(2031, 1991),
    'NOR': emphasizeRecentCoeff(2158, 1979),
    'SLO': emphasizeRecentCoeff(1916, 1890),
    'GBR': emphasizeRecentCoeff(1727, 1813),
    'ITA': emphasizeRecentCoeff(1745, 1784),
    'HUN': emphasizeRecentCoeff(1707, 1674)
};

const SCENARIO_DEFINITION_IIHF_2026 = {
    rules: RULES.IIHF,
    scenario: [
        { type: 'group', label: 'A', params: {members: ['USA', 'SUI', 'FIN', 'GER', 'LAT', 'AUT', 'HUN', 'GBR'], matches: { 'FIN-GER': '3:1', 'USA-SUI': '1:3', 'GBR-AUT': '2:5', 'HUN-FIN': '1:4', 'SUI-LAT': '4:2', 'GBR-USA': '1:5', 'AUT-HUN': '4:2', 'GER-LAT': '0:2', 'FIN-USA': '2:6', 'GER-SUI': '1:6', 'LAT-AUT': '1:3', 'HUN-GBR': '5:0', 'AUT-SUI': '0:9', 'USA-GER': '4:3o', 'FIN-LAT': '7:1', 'SUI-GBR': '4:1', 'GER-HUN': '6:2', 'FIN-GBR': '4:0', 'LAT-USA': '4:2', 'SUI-HUN': '9:0', 'AUT-GER': '2:6', 'GBR-LAT': '0:6', 'FIN-AUT': '5:2', 'USA-HUN': '7:3', 'GER-GBR': '6:3', 'HUN-LAT': '1:8', 'USA-AUT': '4:1', 'SUI-FIN': '4:2'} } },
        { type: 'group', label: 'B', params: {members: ['CAN', 'SWE', 'CZE', 'DEN', 'SVK', 'NOR', 'SLO', 'ITA'], matches: { 'CAN-SWE': '5:3', 'CZE-DEN': '4:1', 'SVK-NOR': '2:1', 'ITA-CAN': '0:6', 'SLO-CZE': '3:2o', 'ITA-SVK': '1:4', 'DEN-SWE': '2:6', 'NOR-SLO': '4:0', 'CAN-DEN': '5:1', 'SWE-CZE': '3:4', 'ITA-NOR': '0:4', 'SLO-SVK': '4:5o', 'CZE-ITA': '3:1', 'SWE-SLO': '6:0', 'CAN-NOR': '6:5o', 'DEN-SVK': '1:5', 'CAN-SLO': '3:1', 'SWE-ITA': '3:0', 'DEN-SLO': '4:0', 'SVK-CZE': '2:3', 'NOR-SWE': '3:2', 'DEN-ITA': '3:2o', 'SVK-CAN': '1:5', 'CZE-NOR': '1:4', 'SLO-ITA': '5:1', 'NOR-DEN': '4:3o', 'SWE-SVK': '4:2', 'CZE-CAN': '2:3'} } },

        { type: 'playoffround', label: 'QF', params: { members: ['A#1', 'A#2', 'A#3', 'A#4', 'B#1', 'B#2', 'B#3', 'B#4'], matches: { 'A#1-B#4': '', 'A#2-B#3': '', 'A#3-B#2': '', 'A#4-B#1': ''}, ordering: ['A#1', 'B#1', 'A#2', 'B#2', 'A#3', 'B#3', 'A#4', 'B#4']}},
        { type: 'playofftree', label: '_result', params: {members: ['QF#1', 'QF#4', 'QF#2', 'QF#3'], knownResults: {} } }
    ]
}

/*
const SCENARIO_DEFINITION_UEFA_2024 = {
    rules: RULES.UEFA,
    scenario: [
        //
        { type: 'group', label: 'A', params: {members: ["GER", "SCO", "HUN", "SUI"], matches: { 'GER-SCO': '5:1', 'HUN-SUI': '1:3', 'GER-HUN': '2:0', 'SCO-SUI': '1:1', 'SUI-GER': '1:1', 'SCO-HUN': '0:1' } } },
        { type: 'group', label: 'B', params: {members: ["ESP", "CRO", "ITA", "ALB"], matches: { 'ESP-CRO': '3:0', 'ITA-ALB': '2:1', 'CRO-ALB': '2:2', 'ESP-ITA': '1:0', 'ALB-ESP': '0:1', 'CRO-ITA': '1:1' } } },
        { type: 'group', label: 'C', params: {members: ["SLO", "DEN", "SRB", "ENG"], matches: { 'SLO-DEN': '1:1', 'SRB-ENG': '0:1', 'SLO-SRB': '1:1', 'DEN-ENG': '1:1', 'ENG-SLO': '0:0', 'DEN-SRB': '0:0' } } },
        { type: 'group', label: 'D', params: {members: ["POL", "NED", "AUT", "FRA"], matches: { 'POL-NED': '1:2', 'AUT-FRA': '0:1', 'POL-AUT': '1:3', 'NED-FRA': '0:0', 'NED-AUT': '2:3', 'FRA-POL': '1:1' } } },
        { type: 'group', label: 'E', params: {members: ["BEL", "SVK", "ROM", "UKR"], matches: { 'ROM-UKR': '3:0', 'BEL-SVK': '0:1', 'SVK-UKR': '1:2', 'BEL-ROM': '2:0', 'SVK-ROM': '1:1', 'UKR-BEL': '0:0' } } },
        { type: 'group', label: 'F', params: {members: ["TUR", "GEO", "POR", "CZE"], matches: { 'TUR-GEO': '3:1', 'POR-CZE': '2:1', 'GEO-CZE': '1:1', 'TUR-POR': '0:3', 'GEO-POR': '0:2', 'CZE-TUR': '1:2' } } },

        { type: 'luckylosergroup', label: 'LL', params: {members: ['A#3', 'B#3', 'C#3', 'D#3', 'E#3', 'F#3'] } },
        { type: 'grouporiginsorting', label: '3P', params: {members: ['LL#1', 'LL#2', 'LL#3', 'LL#4'], orderings: ['ADBC', 'AEBC', 'AFBC', 'DEAB', 'DFAB', 'EFBA', 'EDCA', 'FDCA', 'EFCA', 'EFDA', 'EDBC', 'FDCB', 'FECB', 'FEDB', 'FEDC'], naming: ['1B', '1C', '1E', '1F'] } },
        { type: 'playofftree', label: '_result', params: {members: ['B#1', '3P#1B', 'A#1', 'C#2', 'F#1', '3P#1F', 'D#2', 'E#2', 'E#1', '3P#1E', 'D#1', 'F#2', 'C#1', '3P#1C', 'A#2', 'B#2'], knownResults: {} } }
        //
        {"type":"playofftree","label":"_result","params":{"members":["ESP","GEO","GER","DEN","POR","SLO","FRA","BEL","ROM","NED","AUT","TUR","ENG","SVK","SUI","ITA"],"knownResults":{}}}
    ]
};
*/

    //new PlayoffTree('_result', ['BEL', 'POR', 'ITA', 'AUT', 'FRA', 'SUI', 'CRO', 'ESP', 'SWE', 'UKR', 'ENG', 'GER', 'NED', 'CZE', 'WAL', 'DEN'], RULES.UEFA)
    //new PlayoffTree('_result', ['BEL', 'ITA', 'SUI', 'ESP', 'UKR', 'ENG', 'CZE', 'DEN'], RULES.UEFA)

    /*
const SCENARIO_FIFA_2022 = [
    new Group('A', ["QAT", "ECU", "SEN", "NED"], preparePresetMatches({ 'QAT-ECU': '0:2', 'SEN-NED': '0:2', 'QAT-SEN': '1:3', 'NED-ECU': '1:1', 'ECU-SEN': '1:2', 'NED-QAT': '2:0' }), RULES.FIFA),
    new Group('B', ["ENG", "IRN", "USA", "WAL"], preparePresetMatches({ 'ENG-IRN': '6:2', 'USA-WAL': '1:1', 'WAL-IRN': '0:2', 'ENG-USA': '0:0', 'WAL-ENG': '0:3', 'IRN-USA': '0:1' }), RULES.FIFA),
    new Group('C', ["ARG", "KSA", "MEX", "POL"], preparePresetMatches({ 'ARG-KSA': '1:2', 'MEX-POL': '0:0', 'POL-KSA': '2:0', 'ARG-MEX': '2:0', 'POL-ARG': '0:2', 'KSA-MEX': '1:2' }), RULES.FIFA),
    new Group('D', ["FRA", "AUS", "DEN", "TUN"], preparePresetMatches({ 'DEN-TUN': '0:0', 'FRA-AUS': '4:1', 'TUN-AUS': '0:1', 'FRA-DEN': '2:1', 'AUS-DEN': '1:0', 'TUN-FRA': '1:0' }), RULES.FIFA),
    new Group('E', ["ESP", "CRC", "GER", "JPN"], preparePresetMatches({ 'GER-JPN': '1:2', 'ESP-CRC': '7:0', 'JPN-CRC': '0:1', 'ESP-GER': '1:1', 'JPN-ESP': '2:1', 'CRC-GER': '2:4' }), RULES.FIFA),
    new Group('F', ["BEL", "CAN", "MAR", "CRO"], preparePresetMatches({ 'MAR-CRO': '0:0', 'BEL-CAN': '1:0', 'BEL-MAR': '0:2', 'CRO-CAN': '4:1', 'CRO-BEL': '0:0', 'CAN-MAR': '1:2' }), RULES.FIFA),
    new Group('G', ["BRA", "SRB", "SUI", "CMR"], preparePresetMatches({ 'SUI-CMR': '1:0', 'BRA-SRB': '2:0', 'CMR-SRB': '3:3', 'BRA-SUI': '1:0', 'SRB-SUI': '2:3', 'CMR-BRA': '1:0' }), RULES.FIFA),
    new Group('H', ["POR", "GHA", "URU", "KOR"], preparePresetMatches({ 'URU-KOR': '0:0', 'POR-GHA': '3:2', 'KOR-GHA': '2:3', 'POR-URU': '2:0', 'GHA-URU': '0:2', 'KOR-POR': '2:1' }), RULES.FIFA),
    new PlayoffTree('_result', ['A#1', 'B#2', 'C#1', 'D#2', 'E#1', 'F#2', 'G#1', 'H#2', 'B#1', 'A#2', 'D#1', 'C#2', 'F#1', 'E#2', 'H#1', 'G#2'], RULES.FIFA, preparePresetMatches({ 'NED-USA': '3:1', 'ARG-AUS': '2:1', 'FRA-POL': '3:1', 'JPN-CRO': '1:2o', 'BRA-KOR': '4:1', 'ENG-SEN': '3:0', 'MAR-ESP': '1:0o', 'POR-SUI': '6:1', 'CRO-BRA': '2:1o', 'NED-ARG': '2:3o', 'MAR-POR': '1:0', 'ENG-FRA': '1:2', 'ARG-CRO': '3:0', 'FRA-MAR': '2:0' }))
];

const SCENARIO_UEFA_2018 = [
    new Group('A', ['NZL', 'FRA', 'ITA', 'URU', 'NAM'], preparePresetRugbyMatches( {'FRA-NZL': '27(2):13(2)', 'ITA-NAM': '52(7):8(1)', 'FRA-URU': '27(3):12(2)', 'NZL-NAM': '71(11):3', 'ITA-URU': '38(5):17(2)', 'FRA-NAM': '96(14):0', 'URU-NAM': '35(5):26(2)', 'NZL-ITA': '96(14):17(2)', 'NZL-URU': '73(11):0', 'FRA-ITA': '60(8):7(1)'} ), RULES.RWC),
    new Group('B', ['RSA', 'IRL', 'SCO', 'TON', 'ROM'], preparePresetRugbyMatches( {'IRL-ROM': '82(12):8(1)', 'RSA-SCO': '18(2):3', 'IRL-TON': '59(8):16(1)', 'RSA-ROM': '76(12):0', 'RSA-IRL': '8(1):13(1)', 'SCO-TON': '45(7):17(2)', 'SCO-ROM': '84(12):0', 'RSA-TON': '49(7):18(3)', 'IRL-SCO': '36(6):14(2)', 'TON-ROM': '45(7):24(3)'} ), RULES.RWC),
    new Group('C', ['WAL', 'AUS', 'FIJ', 'GEO', 'POR'], preparePresetRugbyMatches( {'AUS-GEO': '35(4):15(2)', 'WAL-FIJ': '32(4):26(4)', 'WAL-POR': '28(4):8(1)', 'AUS-FIJ': '15(2):22(1)', 'GEO-POR': '18(2):18(2)', 'WAL-AUS': '40(3):6', 'FIJ-GEO': '17(2):12', 'AUS-POR': '34(5):14(2)', 'WAL-GEO': '43(6):19(3)', 'FIJ-POR': '23(2):24(3)'} ), RULES.RWC),
    new Group('D', ['ENG', 'JPN', 'ARG', 'SAM', 'CHI'], preparePresetRugbyMatches( {'ENG-ARG': '27:10(1)', 'JPN-CHI': '42(6):12(2)', 'SAM-CHI': '43(5):10(1)', 'ENG-JPN': '34(4):12', 'ARG-SAM': '19(1):10(1)', 'ENG-CHI': '71(11):0', 'JPN-SAM': '28(3):22(3)', 'ARG-CHI': '59(8):5(1)', 'ENG-SAM': '18(2):17(2)', 'JPN-ARG': '27(3):39(5)'} ), RULES.RWC),
    new PlayoffTree('_result', ['C#1', 'D#2', 'B#1', 'A#2', 'D#1', 'C#2', 'A#1', 'B#2'], RULES.FIFA, preparePresetRugbyMatches({ }))
];
    */

const SCENARIO_FIFA_2026 = {
    rules: RULES.FIFA,
    scenario: [
        { type: 'group', label: 'A', params: {members: ['MEX', 'RSA', 'KOR', 'CZE'], matches: { 'MEX-RSA': '2:0', 'KOR-CZE': '2:1', 'CZE-RSA': '1:1', 'MEX-KOR': '1:0', 'CZE-MEX': '', 'RSA-KOR': '' } } },
        { type: 'group', label: 'B', params: {members: ['CAN', 'BIH', 'QAT', 'SUI'], matches: { 'CAN-BIH': '1:1', 'QAT-SUI': '1:1', 'SUI-BIH': '4:1', 'CAN-QAT': '6:0', 'SUI-CAN': '', 'BIH-QAT': '' } } },
        { type: 'group', label: 'C', params: {members: ['BRA', 'MAR', 'HAI', 'SCO'], matches: { 'BRA-MAR': '1:1', 'HAI-SCO': '0:1', 'SCO-MAR': '', 'BRA-HAI': '', 'SCO-BRA': '', 'MAR-HAI': '' } } },
        { type: 'group', label: 'D', params: {members: ['USA', 'PAR', 'AUS', 'TUR'], matches: { 'USA-PAR': '4:1', 'AUS-TUR': '2:0', 'USA-AUS': '', 'TUR-PAR': '', 'TUR-USA': '', 'PAR-AUS': '' } } },
        { type: 'group', label: 'E', params: {members: ['GER', 'CUW', 'CIV', 'ECU'], matches: { 'GER-CUW': '7:1', 'CIV-ECU': '1:0', 'GER-CIV': '', 'ECU-CUW': '', 'CUW-CIV': '', 'ECU-GER': '' } } },
        { type: 'group', label: 'F', params: {members: ['NED', 'JPN', 'SWE', 'TUN'], matches: { 'NED-JPN': '2:2', 'SWE-TUN': '5:1', 'NED-SWE': '', 'TUN-JPN': '', 'JPN-SWE': '', 'TUN-NED': '' } } },
        { type: 'group', label: 'G', params: {members: ['BEL', 'EGY', 'IRN', 'NZL'], matches: { 'BEL-EGY': '1:1', 'IRN-NZL': '2:2', 'BEL-IRN': '', 'NZL-EGY': '', 'EGY-IRN': '', 'NZL-BEL': '' } } },
        { type: 'group', label: 'H', params: {members: ['ESP', 'CPV', 'KSA', 'URU'], matches: { 'ESP-CPV': '0:0', 'KSA-URU': '1:1', 'ESP-KSA': '', 'URU-CPV': '', 'CPV-KSA': '', 'URU-ESP': '' } } },
        { type: 'group', label: 'I', params: {members: ['FRA', 'SEN', 'IRQ', 'NOR'], matches: { 'FRA-SEN': '3:1', 'IRQ-NOR': '1:4', 'FRA-IRQ': '', 'NOR-SEN': '', 'NOR-FRA': '', 'SEN-IRQ': '' } } },
        { type: 'group', label: 'J', params: {members: ['ARG', 'ALG', 'AUT', 'JOR'], matches: { 'ARG-ALG': '3:0', 'AUT-JOR': '3:1', 'ARG-AUT': '', 'JOR-ALG': '', 'ALG-AUT': '', 'JOR-ARG': '' } } },
        { type: 'group', label: 'K', params: {members: ['POR', 'COD', 'UZB', 'COL'], matches: { 'POR-COD': '1:1', 'UZB-COL': '1:3', 'POR-UZB': '', 'COL-COD': '', 'COL-POR': '', 'COD-UZB': '' } } },
        { type: 'group', label: 'L', params: {members: ['ENG', 'CRO', 'GHA', 'PAN'], matches: { 'ENG-CRO': '4:2', 'GHA-PAN': '1:0', 'ENG-GHA': '', 'PAN-CRO': '', 'PAN-ENG': '', 'CRO-GHA': '' } } },

        { type: 'luckylosergroup', label: 'LL', params: {members: ['A#3', 'B#3', 'C#3', 'D#3', 'E#3', 'F#3', 'G#3', 'H#3', 'I#3', 'J#3', 'K#3', 'L#3'] } },
        { type: 'grouporiginsorting', label: '3P', params: {members: ['LL#1', 'LL#2', 'LL#3', 'LL#4', 'LL#5', 'LL#6', 'LL#7', 'LL#8'], orderings: ['EJIFHGLK', 'HGIDJFLK', 'EJIDHGLK', 'EJIDHFLK', 'EGIDJFLK', 'EGJDHFLK', 'EGIDHFLK', 'EGJDHFLI', 'EGJDHFIK', 'HGICJFLK', 'EJICHGLK', 'EJICHFLK', 'EGICJFLK', 'EGJCHFLK', 'EGICHFLK', 'EGJCHFLI', 'EGJCHFIK', 'HGICJDLK', 'CJIDHFLK', 'CGIDJFLK', 'CGJDHFLK', 'CGIDHFLK', 'CGJDHFLI', 'CGJDHFIK', 'EJICHDLK', 'EGICJDLK', 'EGJCHDLK', 'EGICHDLK', 'EGJCHDLI', 'EGJCHDIK', 'CJEDIFLK', 'CJEDHFLK', 'CEIDHFLK', 'CJEDHFLI', 'CJEDHFIK', 'CGEDJFLK', 'CGEDIFLK', 'CGEDJFLI', 'CGEDJFIK', 'CGEDHFLK', 'CGJDHFLE', 'CGJDHFEK', 'CGEDHFLI', 'CGEDHFIK', 'CGJDHFEI', 'HJBFIGLK', 'EJIBHGLK', 'EJBFIHLK', 'EJBFIGLK', 'EJBFHGLK', 'EGBFIHLK', 'EJBFHGLI', 'EJBFHGIK', 'HJBDIGLK', 'HJBDIFLK', 'IGBDJFLK', 'HGBDJFLK', 'HGBDIFLK', 'HGBDJFLI', 'HGBDJFIK', 'EJBDIHLK', 'EJBDIGLK', 'EJBDHGLK', 'EGBDIHLK', 'EJBDHGLI', 'EJBDHGIK', 'EJBDIFLK', 'EJBDHFLK', 'EIBDHFLK', 'EJBDHFLI', 'EJBDHFIK', 'EGBDJFLK', 'EGBDIFLK', 'EGBDJFLI', 'EGBDJFIK', 'EGBDHFLK', 'HGBDJFLE', 'HGBDJFEK', 'EGBDHFLI', 'EGBDHFIK', 'HGBDJFEI', 'HJBCIGLK', 'HJBCIFLK', 'IGBCJFLK', 'HGBCJFLK', 'HGBCIFLK', 'HGBCJFLI', 'HGBCJFIK', 'EJBCIHLK', 'EJBCIGLK', 'EJBCHGLK', 'EGBCIHLK', 'EJBCHGLI', 'EJBCHGIK', 'EJBCIFLK', 'EJBCHFLK', 'EIBCHFLK', 'EJBCHFLI', 'EJBCHFIK', 'EGBCJFLK', 'EGBCIFLK', 'EGBCJFLI', 'EGBCJFIK', 'EGBCHFLK', 'HGBCJFLE', 'HGBCJFEK', 'EGBCHFLI', 'EGBCHFIK', 'HGBCJFEI', 'HJBCIDLK', 'IGBCJDLK', 'HGBCJDLK', 'HGBCIDLK', 'HGBCJDLI', 'HGBCJDIK', 'CJBDIFLK', 'CJBDHFLK', 'CIBDHFLK', 'CJBDHFLI', 'CJBDHFIK', 'CGBDJFLK', 'CGBDIFLK', 'CGBDJFLI', 'CGBDJFIK', 'CGBDHFLK', 'CGBDHFLJ', 'HGBCJFDK', 'CGBDHFLI', 'CGBDHFIK', 'HGBCJFDI', 'EJBCIDLK', 'EJBCHDLK', 'EIBCHDLK', 'EJBCHDLI', 'EJBCHDIK', 'EGBCJDLK', 'EGBCIDLK', 'EGBCJDLI', 'EGBCJDIK', 'EGBCHDLK', 'HGBCJDLE', 'HGBCJDEK', 'EGBCHDLI', 'EGBCHDIK', 'HGBCJDEI', 'CJBDEFLK', 'CEBDIFLK', 'CJBDEFLI', 'CJBDEFIK', 'CEBDHFLK', 'CJBDHFLE', 'CJBDHFEK', 'CEBDHFLI', 'CEBDHFIK', 'CJBDHFEI', 'CGBDEFLK', 'CGBDJFLE', 'CGBDJFEK', 'CGBDEFLI', 'CGBDEFIK', 'CGBDJFEI', 'CGBDHFLE', 'CGBDHFEK', 'HGBCJFDE', 'CGBDHFEI', 'HJIFAGLK', 'EJIAHGLK', 'EJIFAHLK', 'EJIFAGLK', 'EGJFAHLK', 'EGIFAHLK', 'EGJFAHLI', 'EGJFAHIK', 'HJIDAGLK', 'HJIDAFLK', 'IGJDAFLK', 'HGJDAFLK', 'HGIDAFLK', 'HGJDAFLI', 'HGJDAFIK', 'EJIDAHLK', 'EJIDAGLK', 'EGJDAHLK', 'EGIDAHLK', 'EGJDAHLI', 'EGJDAHIK', 'EJIDAFLK', 'HJEDAFLK', 'HEIDAFLK', 'HJEDAFLI', 'HJEDAFIK', 'EGJDAFLK', 'EGIDAFLK', 'EGJDAFLI', 'EGJDAFIK', 'HGEDAFLK', 'HGJDAFLE', 'HGJDAFEK', 'HGEDAFLI', 'HGEDAFIK', 'HGJDAFEI', 'HJICAGLK', 'HJICAFLK', 'IGJCAFLK', 'HGJCAFLK', 'HGICAFLK', 'HGJCAFLI', 'HGJCAFIK', 'EJICAHLK', 'EJICAGLK', 'EGJCAHLK', 'EGICAHLK', 'EGJCAHLI', 'EGJCAHIK', 'EJICAFLK', 'HJECAFLK', 'HEICAFLK', 'HJECAFLI', 'HJECAFIK', 'EGJCAFLK', 'EGICAFLK', 'EGJCAFLI', 'EGJCAFIK', 'HGECAFLK', 'HGJCAFLE', 'HGJCAFEK', 'HGECAFLI', 'HGECAFIK', 'HGJCAFEI', 'HJICADLK', 'IGJCADLK', 'HGJCADLK', 'HGICADLK', 'HGJCADLI', 'HGJCADIK', 'CJIDAFLK', 'HJFCADLK', 'HFICADLK', 'HJFCADLI', 'HJFCADIK', 'CGJDAFLK', 'CGIDAFLK', 'CGJDAFLI', 'CGJDAFIK', 'HGFCADLK', 'CGJDAFLH', 'HGJCAFDK', 'HGFCADLI', 'HGFCADIK', 'HGJCAFDI', 'EJICADLK', 'HJECADLK', 'HEICADLK', 'HJECADLI', 'HJECADIK', 'EGJCADLK', 'EGICADLK', 'EGJCADLI', 'EGJCADIK', 'HGECADLK', 'HGJCADLE', 'HGJCADEK', 'HGECADLI', 'HGECADIK', 'HGJCADEI', 'CJEDAFLK', 'CEIDAFLK', 'CJEDAFLI', 'CJEDAFIK', 'HEFCADLK', 'HJFCADLE', 'HJECAFDK', 'HEFCADLI', 'HEFCADIK', 'HJECAFDI', 'CGEDAFLK', 'CGJDAFLE', 'CGJDAFEK', 'CGEDAFLI', 'CGEDAFIK', 'CGJDAFEI', 'HGFCADLE', 'HGECAFDK', 'HGJCAFDE', 'HGECAFDI', 'HJBAIGLK', 'HJBAIFLK', 'IJBFAGLK', 'HJBFAGLK', 'HGBAIFLK', 'HJBFAGLI', 'HJBFAGIK', 'EJBAIHLK', 'EJBAIGLK', 'EJBAHGLK', 'EGBAIHLK', 'EJBAHGLI', 'EJBAHGIK', 'EJBAIFLK', 'EJBFAHLK', 'EIBFAHLK', 'EJBFAHLI', 'EJBFAHIK', 'EJBFAGLK', 'EGBAIFLK', 'EJBFAGLI', 'EJBFAGIK', 'EGBFAHLK', 'HJBFAGLE', 'HJBFAGEK', 'EGBFAHLI', 'EGBFAHIK', 'HJBFAGEI', 'IJBDAHLK', 'IJBDAGLK', 'HJBDAGLK', 'IGBDAHLK', 'HJBDAGLI', 'HJBDAGIK', 'IJBDAFLK', 'HJBDAFLK', 'HIBDAFLK', 'HJBDAFLI', 'HJBDAFIK', 'FJBDAGLK', 'IGBDAFLK', 'FJBDAGLI', 'FJBDAGIK', 'HGBDAFLK', 'HGBDAFLJ', 'HGBDAFJK', 'HGBDAFLI', 'HGBDAFIK', 'HGBDAFIJ', 'EJBAIDLK', 'EJBDAHLK', 'EIBDAHLK', 'EJBDAHLI', 'EJBDAHIK', 'EJBDAGLK', 'EGBAIDLK', 'EJBDAGLI', 'EJBDAGIK', 'EGBDAHLK', 'HJBDAGLE', 'HJBDAGEK', 'EGBDAHLI', 'EGBDAHIK', 'HJBDAGEI', 'EJBDAFLK', 'EIBDAFLK', 'EJBDAFLI', 'EJBDAFIK', 'HEBDAFLK', 'HJBDAFLE', 'HJBDAFEK', 'HEBDAFLI', 'HEBDAFIK', 'HJBDAFEI', 'EGBDAFLK', 'EGBDAFLJ', 'EGBDAFJK', 'EGBDAFLI', 'EGBDAFIK', 'EGBDAFIJ', 'HGBDAFLE', 'HGBDAFEK', 'HGBDAFEJ', 'HGBDAFEI', 'IJBCAHLK', 'IJBCAGLK', 'HJBCAGLK', 'IGBCAHLK', 'HJBCAGLI', 'HJBCAGIK', 'IJBCAFLK', 'HJBCAFLK', 'HIBCAFLK', 'HJBCAFLI', 'HJBCAFIK', 'CJBFAGLK', 'IGBCAFLK', 'CJBFAGLI', 'CJBFAGIK', 'HGBCAFLK', 'HGBCAFLJ', 'HGBCAFJK', 'HGBCAFLI', 'HGBCAFIK', 'HGBCAFIJ', 'EJBAICLK', 'EJBCAHLK', 'EIBCAHLK', 'EJBCAHLI', 'EJBCAHIK', 'EJBCAGLK', 'EGBAICLK', 'EJBCAGLI', 'EJBCAGIK', 'EGBCAHLK', 'HJBCAGLE', 'HJBCAGEK', 'EGBCAHLI', 'EGBCAHIK', 'HJBCAGEI', 'EJBCAFLK', 'EIBCAFLK', 'EJBCAFLI', 'EJBCAFIK', 'HEBCAFLK', 'HJBCAFLE', 'HJBCAFEK', 'HEBCAFLI', 'HEBCAFIK', 'HJBCAFEI', 'EGBCAFLK', 'EGBCAFLJ', 'EGBCAFJK', 'EGBCAFLI', 'EGBCAFIK', 'EGBCAFIJ', 'HGBCAFLE', 'HGBCAFEK', 'HGBCAFEJ', 'HGBCAFEI', 'IJBCADLK', 'HJBCADLK', 'HIBCADLK', 'HJBCADLI', 'HJBCADIK', 'CJBDAGLK', 'IGBCADLK', 'CJBDAGLI', 'CJBDAGIK', 'HGBCADLK', 'HGBCADLJ', 'HGBCADJK', 'HGBCADLI', 'HGBCADIK', 'HGBCADIJ', 'CJBDAFLK', 'CIBDAFLK', 'CJBDAFLI', 'CJBDAFIK', 'HFBCADLK', 'CJBDAFLH', 'HJBCAFDK', 'HFBCADLI', 'HFBCADIK', 'HJBCAFDI', 'CGBDAFLK', 'CGBDAFLJ', 'CGBDAFJK', 'CGBDAFLI', 'CGBDAFIK', 'CGBDAFIJ', 'CGBDAFLH', 'HGBCAFDK', 'HGBCAFDJ', 'HGBCAFDI', 'EJBCADLK', 'EIBCADLK', 'EJBCADLI', 'EJBCADIK', 'HEBCADLK', 'HJBCADLE', 'HJBCADEK', 'HEBCADLI', 'HEBCADIK', 'HJBCADEI', 'EGBCADLK', 'EGBCADLJ', 'EGBCADJK', 'EGBCADLI', 'EGBCADIK', 'EGBCADIJ', 'HGBCADLE', 'HGBCADEK', 'HGBCADEJ', 'HGBCADEI', 'CEBDAFLK', 'CJBDAFLE', 'CJBDAFEK', 'CEBDAFLI', 'CEBDAFIK', 'CJBDAFEI', 'HFBCADLE', 'HEBCAFDK', 'HJBCAFDE', 'HEBCAFDI', 'CGBDAFLE', 'CGBDAFEK', 'CGBDAFEJ', 'CGBDAFEI', 'HGBCAFDE'], naming: ['1A', '1B', '1D', '1E', '1G', '1I', '1K', '1L'] } },

        { type: 'playofftree', label: '_result',
            params: {
                members: [
                    'E#1', '3P#1E', 'I#1', '3P#1I', 'A#2', 'B#2', 'F#1', 'C#2', 'K#2', 'L#2', 'H#1', 'J#2', 'D#1', '3P#1D', 'G#1', '3P#1G',
                    'C#1', 'F#2', 'E#2', 'I#2', 'A#1', '3P#1A', 'L#1', '3P#1L', 'J#1', 'H#2', 'D#2', 'G#2', 'B#1', '3P#1B', 'K#1', '3P#1K'
                ],
                knownResults: {}
            }
        }
    ]
};
