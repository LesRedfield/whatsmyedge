function evalParlay(slipBets) {
    const results = slipBets.map((bet) => {
        return bet.children[5].innerHTML;
    });

    if (results.some((el) => el === "lose")) {
        return false;
    } else {
        return true;
    }
}

function wagerTable(tables) {
    let straights =
        straightWins =
        straightWinsBTC =
        straightLosses =
        straightLossesBTC =
        straightTies =
        straightsNet =
        parlays =
        parlayWins =
        parlayWinsBTC =
        parlayLosses =
        parlayLossesBTC =
        parlayTies =
        parlaysNet =
        totalSlips = 0;

    tables.forEach((table, idx) => {
        if (idx !== 0 && idx % 2 === 0) {
            totalSlips++;

            const linkRow = table.children[0].children[0];
            const slipBets = Array.from(tables[idx - 1].children[0].children);

            if (linkRow.children.length > 2) {
                parlays++;

                const reward = parseFloat(linkRow.children[4].children[0].innerHTML.split(' ')[0]);
                const risk = parseFloat(linkRow.children[3].children[0].innerHTML.split(' ')[0]);

                if (evalParlay(slipBets)) {
                    if (reward > 0) {
                        parlayWins++;
                        parlaysNet += reward;
                        parlayWinsBTC += reward;
                    } else {
                        parlayTies++;
                    }
                } else {
                    parlayLosses++;
                    parlaysNet -= risk;
                    parlayLossesBTC -= risk;
                }
            } else {
                straights++;

                const result = slipBets[0].children[5].innerHTML;

                const reward = parseFloat(slipBets[0].children[4].innerHTML);
                const risk = parseFloat(slipBets[0].children[3].innerHTML);

                if (result === "win") {
                    straightWins++;
                    straightsNet += reward;
                    straightWinsBTC += reward;
                } else if (result === "lose") {
                    straightLosses++;
                    straightsNet -= risk;
                    straightLossesBTC -= risk;
                } else {
                    straightTies++;
                }
            }
        }
    });

    // return {
    //     straights,
    //     straightWins,
    //     straightWinsBTC,
    //     straightLosses,
    //     straightLossesBTC,
    //     straightTies,
    //     straightsNet,
    //     parlays,
    //     parlayWins,
    //     parlayWinsBTC,
    //     parlayLosses,
    //     parlayLossesBTC,
    //     parlayTies,
    //     parlaysNet,
    //     totalSlips
    // }

    const wagersList = document.createElement('table');
    const wagersListBody = document.createElement('tbody');
    const wagersListHeader = document.createElement('tr');
    wagersListHeader.innerHTML = `
        <tr>
            <td>Straights</td>
            <td>Wins</td>
            <td>Losses</td>
            <td>Net</td>
            <td>Parlays</td>
            <td>Wins</td>
            <td>Losses</td>
            <td>Net</td>
        </tr>
    `;
    wagersListBody.appendChild(wagersListHeader);
    wagersList.appendChild(wagersListBody);
    body.appendChild(wagersList);

    const wagerRow = document.createElement('tr');
    wagerRow.innerHTML = `
        <td id="straights">${ straights }</td>
        <td id="s-wins">${ straightWinsBTC }</td>
        <td id="s-losses">${ straightLossesBTC }</td>
        <td id="s-net">${ straightsNet }</td>
        <td id="parlays">${ parlays }</td>
        <td id="p-wins">${ parlayWinsBTC }</td>
        <td id="p-losses">${ parlayLossesBTC }</td>
        <td id="p-net">${ parlaysNet }</td>
    `;

    wagersListBody.appendChild(wagerRow);
}
