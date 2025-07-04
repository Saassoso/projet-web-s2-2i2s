const axios = require('axios');

exports.getStandings = async (req, res) => {
  const league = req.query.league || 'PL'; // 'PL' = Premier League
  try {
    const response = await axios.get(`https://api.football-data.org/v4/competitions/${league}/standings`, {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erreur API standings:', error.message);
    res.status(500).json({ msg: 'Erreur lors de la récupération du classement' });
  }
};
