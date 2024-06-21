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
const UEFA_EURO_2024_SORTING_ALGORITHM_DEF = ['computeMatchPoints', 'computeGoalDifference', 'computeGoalsScored', 'computeGlobalGoalDifference', 'computeGlobalGoalsScored', 'computeRandomRanking', {type: 'ranking', ranking: UEFA_EURO_2024_RANKING}];
const FIFA_WORLD_2022_SORTING_ALGORITHM_DEF = ['computeGlobalMatchPoints', 'computeGlobalGoalDifference', 'computeGlobalGoalsScored', 'computeMatchPoints', 'computeGoalDifference', 'computeGoalsScored', 'computeRandomRanking'];

const WORLD_RUGBY_2023_RANKING = ['IRL', 'RSA', 'FRA', 'NZL', 'SCO', 'ARG', 'FIJ', 'ENG', 'AUS', 'WAL', 'GEO', 'SAM', 'ITA', 'JPN', 'TON', 'POR', 'URU', 'USA', 'ROM', 'ESP', 'NAM', 'CHI'];
const RUGBY_WORLD_2023_SORTING_ALGORITHM_DEF = ['computeMatchPoints', 'computeGlobalGoalDifference', 'computeGlobalTriesDifference', 'computeGlobalGoalsScored', 'computeGlobalTriesScored', {type: 'ranking', ranking: WORLD_RUGBY_2023_RANKING}];

const RULES = {
    IIHF: { results: [RESULT_WIN, RESULT_OT_WIN, RESULT_OT_LOSS, RESULT_LOSS], genFuncName: 'generateRandomResult' },
    UEFA: { results: [RESULT_WIN, RESULT_DRAW, RESULT_LOSS], sortingAlgorithmDefinition: UEFA_EURO_2024_SORTING_ALGORITHM_DEF, genFuncName: 'generateRandomResult' },
    FIFA: { results: [RESULT_WIN, RESULT_DRAW, RESULT_LOSS], sortingAlgorithmDefinition: FIFA_WORLD_2022_SORTING_ALGORITHM_DEF, genFuncName: 'generateRandomResult' },
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

const RECENT_COEFFICIENT = 0.3;
function emphasizeRecentCoeff(current, start) {
    return current + RECENT_COEFFICIENT * (current - start);
}

const ELO_RATING_UEFA = {
    FRA: emphasizeRecentCoeff(2081, 2077),
    ESP: emphasizeRecentCoeff(2075, 2057),
    POR: emphasizeRecentCoeff(2014, 2003),
    BEL: emphasizeRecentCoeff(1945, 1988),
    ENG: emphasizeRecentCoeff(1983, 1981),
    NED: emphasizeRecentCoeff(1992, 1974),
    CRO: emphasizeRecentCoeff(1914, 1969),
    ITA: emphasizeRecentCoeff(1939, 1950),
    GER: emphasizeRecentCoeff(1953, 1920),
    AUT: emphasizeRecentCoeff(1877, 1863),
    UKR: emphasizeRecentCoeff(1806, 1853),
    DEN: emphasizeRecentCoeff(1838, 1834),
    HUN: emphasizeRecentCoeff(1777, 1832),
    SUI: emphasizeRecentCoeff(1838, 1805),
    SRB: emphasizeRecentCoeff(1785, 1801),
    CZE: emphasizeRecentCoeff(1766, 1777),
    SCO: emphasizeRecentCoeff(1759, 1770),
    TUR: emphasizeRecentCoeff(1778, 1749),
    SLO: emphasizeRecentCoeff(1743, 1733),
    POL: emphasizeRecentCoeff(1710, 1746),
    SVK: emphasizeRecentCoeff(1694, 1671),
    GEO: emphasizeRecentCoeff(1637, 1666),
    ROM: emphasizeRecentCoeff(1714, 1647),
    ALB: emphasizeRecentCoeff(1635, 1624)
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

const SCENARIO_DEFINITION_UEFA_2024 = {
    rules: RULES.UEFA,
    scenario: [
        { type: 'group', label: 'A', params: {members: ["GER", "SCO", "HUN", "SUI"], matches: { 'GER-SCO': '5:1', 'HUN-SUI': '1:3', 'GER-HUN': '2:0', 'SCO-SUI': '1:1', 'SUI-GER': '', 'SCO-HUN': '' } } },
        { type: 'group', label: 'B', params: {members: ["ESP", "CRO", "ITA", "ALB"], matches: { 'ESP-CRO': '3:0', 'ITA-ALB': '2:1', 'CRO-ALB': '2:2', 'ESP-ITA': '1:0', 'ALB-ESP': '', 'CRO-ITA': '' } } },
        { type: 'group', label: 'C', params: {members: ["SLO", "DEN", "SRB", "ENG"], matches: { 'SLO-DEN': '1:1', 'SRB-ENG': '0:1', 'SLO-SRB': '1:1', 'DEN-ENG': '1:1', 'ENG-SLO': '', 'DEN-SRB': '' } } },
        { type: 'group', label: 'D', params: {members: ["POL", "NED", "AUT", "FRA"], matches: { 'POL-NED': '1:2', 'AUT-FRA': '0:1', 'POL-AUT': '1:3', 'NED-FRA': '0:0', 'NED-AUT': '', 'FRA-POL': '' } } },
        { type: 'group', label: 'E', params: {members: ["BEL", "SVK", "ROM", "UKR"], matches: { 'ROM-UKR': '3:0', 'BEL-SVK': '0:1', 'SVK-UKR': '1:2', 'BEL-ROM': '', 'SVK-ROM': '', 'UKR-BEL': '' } } },
        { type: 'group', label: 'F', params: {members: ["TUR", "GEO", "POR", "CZE"], matches: { 'TUR-GEO': '3:1', 'POR-CZE': '2:1', 'GEO-CZE': '', 'TUR-POR': '', 'GEO-POR': '', 'CZE-TUR': '' } } },

        { type: 'luckylosergroup', label: 'LL', params: {members: ['A#3', 'B#3', 'C#3', 'D#3', 'E#3', 'F#3'] } },
        { type: 'grouporiginsorting', label: '3P', params: {members: ['LL#1', 'LL#2', 'LL#3', 'LL#4'], orderings: ['ADBC', 'AEBC', 'AFBC', 'DEAB', 'DFAB', 'EFBA', 'EDCA', 'FDCA', 'EFCA', 'EFDA', 'EDBC', 'FDCB', 'FECB', 'FEDB', 'FEDC'], naming: ['1B', '1C', '1E', '1F'] } },
        { type: 'playofftree', label: '_result', params: {members: ['B#1', '3P#1B', 'A#1', 'C#2', 'F#1', '3P#1F', 'D#2', 'E#2', 'E#1', '3P#1E', 'D#1', 'F#2', 'C#1', '3P#1C', 'A#2', 'B#2'], knownResults: {} } }
    ]
};

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
