const axios = require('axios');

exports.searchTeamDetailsByName = async (req, res) => {
  const { name } = req.query;

  try {
    // Competitions to search in
    const competitions = ['CL', 'PL', 'PD', 'SA', 'BL1']; // example leagues
    let allTeams = [];

    // Fetch teams from each competition
    for (const code of competitions) {
      const resp = await axios.get(`https://api.football-data.org/v4/competitions/${code}/teams`, {
        headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY }
      });
      allTeams = allTeams.concat(resp.data.teams);
    }

    if (!name || name.trim() === '') {
      // No name given, return all teams
      return res.json(allTeams);
    }

    // Find team by partial or exact match in name, shortName, or tla
    const matchedTeam = allTeams.find(team =>
      team.name.toLowerCase().includes(name.toLowerCase()) ||
      (team.shortName && team.shortName.toLowerCase().includes(name.toLowerCase())) ||
      (team.tla && team.tla.toLowerCase() === name.toLowerCase())
    );

    if (!matchedTeam) {
      return res.status(404).json({ msg: `No team found for name: ${name}` });
    }

    // Return matched team basic info
    res.json(matchedTeam);

  } catch (error) {
    console.error('Team search failed:', error.message);
    res.status(500).json({ msg: 'Failed to fetch team data' });
  }
};
