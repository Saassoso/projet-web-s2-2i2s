import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../components/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

function StandingsPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [standings, setStandings] = useState([]);
  const [competition, setCompetition] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState('PL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const leagues = [
    { code: 'PL', name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { code: 'PD', name: 'La Liga', flag: '🇪🇸' },
    { code: 'SA', name: 'Serie A', flag: '🇮🇹' },
    { code: 'BL1', name: 'Bundesliga', flag: '🇩🇪' },
    { code: 'FL1', name: 'Ligue 1', flag: '🇫🇷' },
    { code: 'CL', name: 'Champions League', flag: '🏆' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchStandings();
  }, [isAuthenticated, navigate, selectedLeague]);

  const fetchStandings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/standings?league=${selectedLeague}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStandings(response.data.standings[0]?.table || []);
      setCompetition(response.data.competition);
    } catch (err) {
      console.error("Erreur lors du chargement du classement :", err);
      setError("Impossible de charger le classement. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const getPositionIcon = (position, previousPosition) => {
    if (!previousPosition) return <Minus className="w-4 h-4 text-gray-400" />;
    
    if (position < previousPosition) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (position > previousPosition) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPositionColor = (position) => {
    if (position <= 4) return 'text-green-600 font-bold'; // Champions League
    if (position <= 6) return 'text-blue-600 font-bold'; // Europa League
    if (position >= standings.length - 2) return 'text-red-600 font-bold'; // Relegation
    return 'text-gray-800 font-semibold';
  };

  const getRowBackground = (position) => {
    if (position <= 4) return 'bg-green-50 border-l-4 border-green-500';
    if (position <= 6) return 'bg-blue-50 border-l-4 border-blue-500';
    if (position >= standings.length - 2) return 'bg-red-50 border-l-4 border-red-500';
    return 'bg-white hover:bg-gray-50';
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du classement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Classements</h1>
        <p className="text-gray-600">Suivez les classements des principales ligues européennes</p>
      </div>

      {/* Sélecteur de ligue */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {leagues.map((league) => (
            <button
              key={league.code}
              onClick={() => setSelectedLeague(league.code)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                selectedLeague === league.code
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-200'
              }`}
            >
              <span>{league.flag}</span>
              <span>{league.name}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Titre de la compétition */}
      {competition && (
        <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{competition.name}</h2>
              <p className="text-sm text-gray-600">Saison {competition.season?.startDate?.split('-')[0]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tableau de classement */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Équipe
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  J
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  V
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  D
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BP
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BC
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  +/-
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PTS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {standings.map((team, index) => (
                <tr
                  key={team.team.id}
                  className={`transition-colors duration-200 ${getRowBackground(team.position)}`}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${getPositionColor(team.position)}`}>
                        {team.position}
                      </span>
                      {getPositionIcon(team.position, team.position + 1)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={team.team.crest || "https://via.placeholder.com/24"}
                        alt={team.team.name}
                        className="w-6 h-6 object-contain"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {team.team.shortName || team.team.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-500">
                    {team.playedGames}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-500">
                    {team.won}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-500">
                    {team.draw}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-500">
                    {team.lost}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-500">
                    {team.goalsFor}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-500">
                    {team.goalsAgainst}
                  </td>
                  <td className="px-4 py-4 text-center text-sm">
                    <span className={team.goalDifference >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-bold text-gray-900">
                      {team.points}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Légende */}
      <div className="mt-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Légende</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600">Champions League</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Europa League</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-600">Relégation</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StandingsPage;