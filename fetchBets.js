function fetchBets(tables) {
    const bets = [];

    tables.forEach((table, idx) => {
        if (idx !== 0 && idx % 2 === 0) {
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
        }
    });

    return bets;
}
