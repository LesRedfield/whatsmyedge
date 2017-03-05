let straights = 0;
let straightWins = 0
let straightWinsBTC = 0
let straightLosses = 0
let straightLossesBTC = 0
let straightSpecials = 0;
let straightsNet = 0;

let parlays = 0;
let parlayWins = 0;
let parlayWinsBTC = 0;
let parlayLosses = 0;
let parlayLossesBTC = 0;
let parlaySpecials = 0;
let parlaysNet = 0;

let totalSlips = 0;

const bets = [];

tables.forEach((table, idx) => {
    if (idx !== 0 && idx % 2 === 0) {
        totalSlips += 1;

        const linkRow = table.children[0].children[0];
        const slipBets = Array.from(tables[idx - 1].children[0].children);

        const slipBetsObj = slipBets.map((bet) => {
            const event = bet.children[0].innerHTML.split(" v ");
            const team1 = event[0];
            const team2 = event[1];
            const wagerType = bet.children[1].innerHTML.split(": ");
            const type = wagerType.shift();
            const wager = wagerType[0].split(" ");
            let line;
            if (bet.children[7].innerHTML.includes('Props')) {
                line = "Prop";
            } else if (bet.children[6].innerHTML === "Specials") {
                line = "Special";
            } else {
                line = wager.pop();
            }
            const team = wager.join(' ');
            const opp = team === team1 ? team2 : team1;
            return {
                team,
                opp,
                type,
                line: Number.isInteger(Math.floor(line)) ? parseFloat(line) : line,
                odds: parseFloat(bet.children[2].innerHTML),
                risk: parseFloat(bet.children[3].innerHTML),
                reward: parseFloat(bet.children[4].innerHTML),
                result: bet.children[5].innerHTML,
                sport: bet.children[6].innerHTML,
                league: bet.children[7].innerHTML
            }
        });

        bets.push(...slipBetsObj);

        if (linkRow.children.length > 2) {
            parlays += 1;

            const results = slipBets.map((bet) => {
                return bet.children[5].innerHTML;
            });

            const reward = parseFloat(linkRow.children[4].children[0].innerHTML.split(' ')[0]);
            const risk = parseFloat(linkRow.children[3].children[0].innerHTML.split(' ')[0]);

            if (results.every((el) => el === "win")) {
                parlayWins += 1;
                parlaysNet += reward;
                parlayWinsBTC += reward;
            } else if (results.some((el) => el === "lose")) {
                parlayLosses += 1;
                parlaysNet -= risk;
                parlayLossesBTC -= risk;
            } else {
                parlaySpecials += 1;
                console.log(results);
            }
        } else {
            straights += 1;

            const result = slipBets[0].children[5].innerHTML;

            const reward = parseFloat(slipBets[0].children[4].innerHTML);
            const risk = parseFloat(slipBets[0].children[3].innerHTML);

            if (result === "win") {
                straightWins += 1;
                straightsNet += reward;
                straightWinsBTC += reward;
            } else if (result === "lose") {
                straightLosses += 1;
                straightsNet -= risk;
                straightLossesBTC -= risk;
            } else {
                straightSpecials += 1;
                console.log(result);
            }
        }
    }
});

const totalsList = document.createElement('table');
const totalsListBody = document.createElement('tbody');
const totalsListHeader = document.createElement('tr');
totalsListHeader.innerHTML = `
    <tr>
        <td>Bets</td>
        <td>Wins</td>
        <td>Losses</td>
        <td>Tied/Canceled</td>
        <td>Win %</td>
        <td>Total EV</td>
        <td>EV Per Bet</td>
    </tr>
`;
totalsListBody.appendChild(totalsListHeader);
totalsList.appendChild(totalsListBody);
body.appendChild(totalsList);



const sports = [
    "Basketball",
    "Football",
    "Soccer",
    "Tennis",
    "Specials",
    "Props"
];

const sportsDropdown = document.createElement('select');
sportsDropdown.innerHTML = `<option value="All">All Sports</option>`;

const leaguesDropdown = document.createElement('select');
leaguesDropdown.innerHTML = `<option value="All">All Leagues</option>`;

const teamsDropdown = document.createElement('select');
teamsDropdown.innerHTML = `<option value="All">All Teams</option>`;


const betsList = document.createElement('table');
const betsListBody = document.createElement('tbody');
const betsListHeader = document.createElement('tr');
betsListHeader.innerHTML = `
    <tr>
        <td id="sport-header"></td>
        <td id="league-header"></td>
        <td id="team-header"></td>
        <td>Opponent</td>
        <td>Type</td>
        <td>Line</td>
        <td>Odds</td>
        <td>Risk</td>
        <td>Reward</td>
        <td>Result</td>
    </tr>
`;
betsListBody.appendChild(betsListHeader);
betsList.appendChild(betsListBody);
body.appendChild(betsList);

const sportHeader = document.getElementById('sport-header');
const leagueHeader = document.getElementById('league-header');
const teamHeader = document.getElementById('team-header');
sportHeader.appendChild(sportsDropdown);
leagueHeader.appendChild(leaguesDropdown);
teamHeader.appendChild(teamsDropdown);


sports.forEach((sport) => {
    sportsDropdown.innerHTML += `<option value=${sport}>${sport}</option>`;
});

let displayBets = bets;

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
    dispTeamsFromSport(e.target.value);
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

function dispTeamsFromSport(sport) {
    const teams = [];

    displayBets.forEach((bet) => {
        if (sport === 'Specials' && !teams.includes(bet.league)) {
            teams.push(bet.league);
        } else if (sport !== 'All' &&
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
    console.log(sportsDropdown.value);

    dispBets(displayBets);
    dispTeamsFromLeague(e.target.value);
}

function dispTeamsFromLeague(league) {
    const teams = [];

    displayBets.forEach((bet) => {
        if (league !== 'All' &&
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

function handleTeamChange(e) {
    betsListBody.innerHTML = "";
    betsListBody.appendChild(betsListHeader);

    displayBets = bets.filter((bet) => {
        if (e.target.value === "All" && leaguesDropdown.value === "All") {
               return bet.sport === sportsDropdown.value;
        } else if (e.target.value === "All") {
            return bet.sport === sportsDropdown.value &&
                   bet.league.split(' ').join('') === sportsDropdown.value;
        } else if (leaguesDropdown.value !== "All") {
            return bet.sport === sportsDropdown.value &&
                   bet.league.split(' ').join('') === leaguesDropdown.value &&
                   bet.team.split(' ').join('') === e.target.value;
        } else {
            return bet.sport === sportsDropdown.value &&
            bet.team.split(' ').join('') === e.target.value;
        }
    });
    console.log(sportsDropdown.value);

    dispBets(displayBets);
}

sportsDropdown.addEventListener('change', handleSportChange);
leaguesDropdown.addEventListener('change', handleLeagueChange);
teamsDropdown.addEventListener('change', handleTeamChange);

function dispBets(bets) {
    bets.forEach((bet) => {
        const betRow = document.createElement('tr');
        betRow.innerHTML = `
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
}

function updateTotals(bets) {
    totalsListBody.innerHTML = "";
    totalsListBody.appendChild(totalsListHeader);

    const totalBets = bets.length;
    let totalWins = 0;
    let totalLosses = 0;
    let totalTiedCanceled = 0;
    let totalEV = 0;

    bets.forEach((bet) => {
        if (bet.result === "win") {
            totalWins += 1;

            if (Number.isFinite(bet.odds)) {
                totalEV += (bet.odds - 1);
            }
        } else if (bet.result === "lose") {
            totalLosses += 1;

            if (Number.isFinite(bet.odds)) {
                totalEV -= 1;
            }
        } else {
            totalTiedCanceled += 1;
        }
    });

    totalEV = totalEV.toFixed(2);
    const totalWinPercentage = ((totalWins / (totalBets - totalTiedCanceled)) * 100).toFixed(2);
    const avgEV = (totalEV / (totalWins + totalLosses)).toFixed(2);

    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td>${ totalBets }</td>
        <td id="wins">${ totalWins }</td>
        <td id="losses">${ totalLosses }</td>
        <td id="ties">${ totalTiedCanceled }</td>
        <td id="win-percentage">${ totalWinPercentage }</td>
        <td id="total-ev">${ totalEV }</td>
        <td id="avg-ev">${ avgEV }</td>
    `;

    totalsListBody.appendChild(totalRow);

    const winsCell = document.getElementById('wins');
    const lossesCell = document.getElementById('losses');
    const tiesCell = document.getElementById('ties');
    const winPercentageCell = document.getElementById('win-percentage');
    const totalEVCell = document.getElementById('total-ev');
    const avgEVCell = document.getElementById('avg-ev');

    winsCell.style.backgroundColor = "rgba(0, 255, 0, 0.7)";
    lossesCell.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
    tiesCell.style.backgroundColor = "yellow";
    winPercentageCell.style.backgroundColor = totalWinPercentage > 50 ? "rgba(0, 255, 0, 0.7)" :
                                              totalWinPercentage < 50 ? "rgba(255, 0, 0, 0.7)" : "yellow";;
    totalEVCell.style.backgroundColor = totalEV > 0 ? "rgba(0, 255, 0, 0.7)" :
                                        totalEV < 0 ? "rgba(255, 0, 0, 0.7)" : "yellow";;
    avgEVCell.style.backgroundColor = avgEV > 0 ? "rgba(0, 255, 0, 0.7)" :
                                      avgEV < 0 ? "rgba(255, 0, 0, 0.7)" : "yellow";;
}

dispBets(displayBets);

let totalNet = straightsNet + parlaysNet;

console.log("straights: " + straights);
console.log("straightWins: " + straightWins);
console.log("straightWinsBTC: " + straightWinsBTC + " BTC");
console.log("straightLosses: " + straightLosses);
console.log("straightLossesBTC: " + straightLossesBTC + " BTC");
console.log("straightSpecials: " + straightSpecials);
console.log("straightsNet: " + straightsNet + " BTC");

console.log("parlays: " + parlays);
console.log("parlayWins: " + parlayWins);
console.log("parlayWinsBTC: " + parlayWinsBTC + " BTC");
console.log("parlayLosses: " + parlayLosses);
console.log("parlayLossesBTC: " + parlayLossesBTC + " BTC");
console.log("parlaySpecials: " + parlaySpecials);
console.log("parlaysNet: " + parlaysNet + " BTC");

console.log("totalSlips: " + totalSlips);
console.log("totalNet: " + totalNet + " BTC");
