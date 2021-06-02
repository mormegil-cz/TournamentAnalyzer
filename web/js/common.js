SimulationCommon = (function() {
    function getPoints(matches, home, away) {
        return getPointsOneSide(matches, home, away, 'home') + getPointsOneSide(matches, away, home, 'away');
    }

    function getPointsOneSide(matches, a, b, side) {
        var matchId = a + '-' + b;
        var matchEntry = matches[matchId];
        return matchEntry && matchEntry.type === 'done' ? matchEntry[side] : 0;
    }

    function sortGroup(teams, matches) {
        let teamPoints = {};
        for (let home of teams) {
            let pts = 0;
            for (let away of teams) {
                pts += getPoints(matches, home, away);
            }
            teamPoints[home] = pts;
        }

        // 1. sort by points
        teams.sort(function (a, b) {
            return teamPoints[b] - teamPoints[a];
        });

        // 2. determine same-points groups
        let teamsByPoints = {};
        let teamPositions = {};
        let pos = 0;
        for (let team of teams) {
            let points = teamPoints[team];
            let list = teamsByPoints[points] || [];
            list.push(team);
            teamsByPoints[points] = list;
            teamPositions[team] = pos;
            ++pos;
        }

        // 3. sort same-points subgroups
        for (let groupPoints of Object.keys(teamsByPoints)) {
            let group = teamsByPoints[groupPoints];
            if (group.length > 1 && group.length < teams.length) {
                let minPosition = Number.POSITIVE_INFINITY;
                for (let groupTeam of group) {
                    minPosition = Math.min(minPosition, teamPositions[groupTeam]);
                }
                group = sortGroup(group, matches);
                for (let i = 0; i < group.length; ++i) {
                    teamPositions[group[i]] = minPosition + i;
                }
            }
        }

        // 4. apply sorted positions
        let sortedTeams = new Array(teams.length);
        for (let team of teams) {
            sortedTeams[teamPositions[team]] = team;
        }

        return sortedTeams;
    }


    return {
        sortGroup: sortGroup
    }
})();
