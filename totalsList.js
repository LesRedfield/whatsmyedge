function totalsList(bets) {
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

    const totalBets = bets.length;
    let totalWins = 0;
    let totalLosses = 0;
    let totalTiedCanceled = 0;
    let totalEV = 0;

    bets.forEach((bet) => {
        if (bet.result === "win") {
            totalWins++;

            if (Number.isFinite(bet.odds)) {
                totalEV += (bet.odds - 1);
            }
        } else if (bet.result === "lose") {
            totalLosses++;

            if (Number.isFinite(bet.odds)) {
                totalEV -= 1;
            }
        } else {
            totalTiedCanceled++;
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
                                              totalWinPercentage < 50 ? "rgba(255, 0, 0, 0.7)" : "yellow";
    totalEVCell.style.backgroundColor = totalEV > 0 ? "rgba(0, 255, 0, 0.7)" :
                                        totalEV < 0 ? "rgba(255, 0, 0, 0.7)" : "yellow";
    avgEVCell.style.backgroundColor = avgEV > 0 ? "rgba(0, 255, 0, 0.7)" :
                                      avgEV < 0 ? "rgba(255, 0, 0, 0.7)" : "yellow";

    return totalsList;
}
