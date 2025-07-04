const axios = require('axios');

exports.getMatches = async (req, res) => {
  const { date, dateFrom, dateTo } = req.query;
  
  // Déterminer les dates à utiliser
  const from = dateFrom || date;
  const to = dateTo || date;
  
  console.log('Date From:', from);
  console.log('Date To:', to);
  console.log('Clé API utilisée:', process.env.FOOTBALL_API_KEY);
  
  try {
    const apiUrl = 'https://api.football-data.org/v4/matches';
    const config = {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_API_KEY
      }
    };
    
    // Si des dates sont fournies, les ajouter aux paramètres
    if (from || to) {
      config.params = {
        dateFrom: from,
        dateTo: to
      };
    }
    
    const response = await axios.get(apiUrl, config);
    
    console.log('Status:', response.status);
    console.log('Matches trouvés:', response.data.resultSet?.count || 0);
    
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      console.error('Erreur API:', error.response.status, error.response.data);
    } else {
      console.error('Erreur Axios:', error.message);
    }
    res.status(500).json({ msg: 'Erreur lors de la récupération des matchs' });
  }
};