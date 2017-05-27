// const bets = fetchBets(playerTables, name);

// const sports = [];
//
// bets.forEach((bet) => {
//     if (!sports.includes(bet.sport)) {
//         sports.push(bet.sport);
//     }
// });

function filterBets(bets, user, sport, team, opponent) {
    if (user) {
        bets = bets.filter((bet) => {
            return bet.user === user;
        });
    }

    if (!sport && !team && !opponent) {
        return bets;
    } else if (sport && !team && !opponent) {
        return bets.filter((bet) => {
            return bet.sport === sport;
        });
    } else if (sport && !team) {
        return bets.filter((bet) => {
            return bet.opponent === opponent;
        });
    } else if (sport) {
        return bets.filter((bet) => {
            return bet.team === team;
        });
    }
}

// const totalsContainer = document.createElement('div');
// body.appendChild(totalsContainer);

function updateTotals(bets) {
    totalsContainer.innerHTML = '';
    const users = [];

    bets.forEach((bet) => {
        if (!users.includes(bet.user)) {
            users.push(bet.user);
        }
    });

    users.forEach((user) => {
        totalsContainer.appendChild(totalsList(filterBets(bets, user)));
    });
}

function dispBets(bets, limit) {

    let lim = 0;

    if (limit > 0) {
      lim = limit;
    } else {
      lim = bets.length;
    }

    bets.slice(0, lim).forEach((bet) => {
        const betRow = document.createElement('tr');
        betRow.innerHTML = `
            <td>${ bet.user }</td>
            <td>${ bet.sport }</td>
            <td>${ bet.league }</td>
            <td>${ bet.team }</td>
            <td>${ bet.opp }</td>
            <td>${ bet.type }</td>
            <td>${ bet.line }</td>
            <td>${ bet.odds }</td>
            <td>${ bet.risk }</td>
            <td>${ bet.reward }</td>
            <td>${ bet.result }</td>
        `;

        betRow.style.backgroundColor = bet.result === "win" ? "rgba(0, 255, 0, 0.7)" :
                                       bet.result === "lose" ? "rgba(255, 0, 0, 0.7)" : "yellow";
        betsListBody.appendChild(betRow);
    });

    updateTotals(bets);
    updateLimit(lim);
}

function dispLeaguesFromSport(sport) {
    const leagues = [];

    displayBets.forEach((bet) => {
        if (sport === 'Props' && !leagues.includes(bet.sport)) {
            leagues.push(bet.sport);
        } else if (sport !== 'All' &&
                   !bet.league.includes('Props') &&
                   !leagues.includes(bet.league)) {
            leagues.push(bet.league);
        }
    });

    leagues.sort();
    leagues.forEach((league) => {
        leaguesDropdown.innerHTML += `<option value=${league.split(' ').join('')}>${league}</option>`;
    });
}

function dispTeams(val, type) {
    const teams = [];

    displayBets.forEach((bet) => {
        if (type === 'sport' && val === 'Specials' && !teams.includes(bet.league)) {
            teams.push(bet.league);
        } else if ((val !== 'All' || type === 'league') &&
                   !bet.league.includes('Props') &&
                   !bet.team.includes('(') &&
                   !teams.includes(bet.team)) {
            teams.push(bet.team);
        }
    });

    teams.sort();
    teams.forEach((team) => {
        teamsDropdown.innerHTML += `<option value=${team.split(' ').join('')}>${team}</option>`;
    });
}

function updateLimit(limit) {
  let options = ``;

  for (i = 1; i < limit + 1; i++) {
    options += `<option value=${i}>${i}</option>`;
  }

  betsDropdown.innerHTML = options;
}

function handleBetsChange(e) {
  betsListBody.innerHTML = "";
  betsListBody.appendChild(betsListHeader);

  displayBets = bets.filter((bet) => {
    
      return (bet.sport === sportsDropdown.value || sportsDropdown.value === "All") &&
             (bet.league.split(' ').join('') === leaguesDropdown.value || leaguesDropdown.value === "All") &&
             (bet.team.split(' ').join('') === teamsDropdown.value || teamsDropdown.value === "All");
  });

  dispBets(displayBets, e.target.value);
}

function handleSportChange(e) {
    betsListBody.innerHTML = "";
    betsListBody.appendChild(betsListHeader);

    teamsDropdown.innerHTML = `<option value="All">All Teams</option>`;
    leaguesDropdown.innerHTML = `<option value="All">All Leagues</option>`;

    if (e.target.value === "Props") {
        displayBets = bets.filter((bet) => {
            return bet.league.includes('Props');
        });
    } else if (e.target.value === "All") {
        displayBets = bets;
    } else {
        displayBets = bets.filter((bet) => {
            return bet.sport === e.target.value;
        });
    }

    dispBets(displayBets);
    dispLeaguesFromSport(e.target.value);
    dispTeams(e.target.value, 'sport');
}

function handleLeagueChange(e) {
    betsListBody.innerHTML = "";
    betsListBody.appendChild(betsListHeader);

    teamsDropdown.innerHTML = `<option value="All">All Teams</option>`;

    displayBets = bets.filter((bet) => {
        if (sportsDropdown.value === "Props" && e.target.value === "All") {
            return bet.league.includes('Props');
        } else if (sportsDropdown.value === "Props") {
            return bet.sport === e.target.value &&
                   bet.league.includes('Props');
        } else if (e.target.value === "All") {
               return bet.sport === sportsDropdown.value;
        } else {
            return bet.league.split(' ').join('') === e.target.value &&
                   bet.sport === sportsDropdown.value;
        }
    });

    dispBets(displayBets);
    dispTeams(e.target.value, 'league');
}

function handleTeamChange(e) {

    betsListBody.innerHTML = "";
    betsListBody.appendChild(betsListHeader);

    displayBets = bets.filter((bet) => {
        if (e.target.value === "All" && leaguesDropdown.value === "All") {
               return bet.sport === sportsDropdown.value;
        } else if (e.target.value === "All") {
            return bet.sport === sportsDropdown.value &&
                   bet.league.split(' ').join('') === leaguesDropdown.value;
        } else if (leaguesDropdown.value !== "All") {
            return bet.sport === sportsDropdown.value &&
                   bet.league.split(' ').join('') === leaguesDropdown.value &&
                   bet.team.split(' ').join('') === e.target.value;
        } else {
            return bet.sport === sportsDropdown.value &&
            bet.team.split(' ').join('') === e.target.value;
        }
    });

    dispBets(displayBets);
}

// sportsDropdown.addEventListener('change', handleSportChange);
// leaguesDropdown.addEventListener('change', handleLeagueChange);
// teamsDropdown.addEventListener('change', handleTeamChange);
//
// dispBets(displayBets);
//
// wagerTable(playerTables);
