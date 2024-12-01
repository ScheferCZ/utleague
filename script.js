// Inicializace dat
let teams = JSON.parse(localStorage.getItem("teams")) || [];
let matchHistory = JSON.parse(localStorage.getItem("matchHistory")) || [];

// Funkce pro obnovu tabulky ligy
function updateLeagueTable() {
    const tableBody = document.getElementById("leagueTableBody");
    tableBody.innerHTML = '';
    teams.forEach(team => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${team.name}</td>
            <td>${team.wins}</td>
            <td>${team.draws}</td>
            <td>${team.losses}</td>
            <td>${team.points}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Funkce pro obnovu historie zápasů
function updateMatchHistory() {
    const historyList = document.getElementById("matchHistoryList");
    historyList.innerHTML = '';
    matchHistory.forEach(match => {
        const listItem = document.createElement("li");
        listItem.textContent = `${match.team1} ${match.score1} - ${match.score2} ${match.team2}`;
        historyList.appendChild(listItem);
    });
}

// Funkce pro registraci týmu
document.getElementById("registerTeamForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const teamName = document.getElementById("teamName").value.trim();
    if (teamName && !teams.some(t => t.name === teamName)) {
        teams.push({
            name: teamName,
            wins: 0,
            draws: 0,
            losses: 0,
            points: 0
        });
        localStorage.setItem("teams", JSON.stringify(teams));
        updateLeagueTable();
        updateTeamSelectors();
    }
    document.getElementById("teamName").value = '';
});

// Funkce pro aktualizaci výběru týmů ve formuláři zápasu
function updateTeamSelectors() {
    const team1Select = document.getElementById("team1");
    const team2Select = document.getElementById("team2");
    team1Select.innerHTML = '';
    team2Select.innerHTML = '';
    teams.forEach(team => {
        const option1 = document.createElement("option");
        option1.value = team.name;
        option1.textContent = team.name;
        team1Select.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = team.name;
        option2.textContent = team.name;
        team2Select.appendChild(option2);
    });
}

// Funkce pro zapsání výsledku zápasu
document.getElementById("matchForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const team1Name = document.getElementById("team1").value;
    const team2Name = document.getElementById("team2").value;
    const score1 = parseInt(document.getElementById("score1").value);
    const score2 = parseInt(document.getElementById("score2").value);

    if (team1Name !== team2Name && !isNaN(score1) && !isNaN(score2)) {
        // Uložení výsledku
        matchHistory.push({ team1: team1Name, team2: team2Name, score1, score2 });
        localStorage.setItem("matchHistory", JSON.stringify(matchHistory));

        // Aktualizace statistik týmů
        const team1 = teams.find(t => t.name === team1Name);
        const team2 = teams.find(t => t.name === team2Name);

        if (score1 > score2) {
            team1.wins++;
            team2.losses++;
            team1.points += 3;
        } else if (score1 < score2) {
            team2.wins++;
            team1.losses++;
            team2.points += 3;
        } else {
            team1.draws++;
            team2.draws++;
            team1.points++;
            team2.points++;
        }

        // Uložení změn
        localStorage.setItem("teams", JSON.stringify(teams));

        // Obnovení tabulky ligy a historie zápasů
        updateLeagueTable();
        updateMatchHistory();
    }
});

// Inicializace dat při načtení stránky
updateLeagueTable();
updateMatchHistory();
updateTeamSelectors();
