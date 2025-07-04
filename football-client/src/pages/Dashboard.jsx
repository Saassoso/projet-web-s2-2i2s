import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import Modal from '../components/common/Modal';
import { Star, Trophy, Users, Calendar } from 'lucide-react';
import axios from 'axios';

function Dashboard() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleConfirmLogout = () => {
    logout();
    setShowModal(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!isAuthenticated || !token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // 1. Récupérer les préférences de l’utilisateur
        const profileRes = await axios.get('http://localhost:5000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const preferences = profileRes.data.preferences || [];

        // 2. Charger les équipes (localStorage ou API)
        let teams = [];
        const cached = localStorage.getItem('equipes');
        if (cached) {
          teams = JSON.parse(cached);
        } else {
          const teamRes = await axios.get('http://localhost:5000/teams/search');
          teams = teamRes.data;
          localStorage.setItem('equipes', JSON.stringify(teams));
        }

        // 3. Récupérer les matchs à venir (si pas déjà dans localStorage)
        const matchCache = localStorage.getItem('matches');
        if (matchCache) {
          setMatches(JSON.parse(matchCache));
        } else {
          const matchRes = await axios.get('http://localhost:5000/matches', {
            params: {
              dateFrom: new Date().toISOString().split('T')[0],
              dateTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            },
          });
          const matchData = matchRes.data.matches || [];
          setMatches(matchData);
          localStorage.setItem('matches', JSON.stringify(matchData));
        }

        // 4. Filtrer les équipes préférées
        const favorites = teams.filter(t => preferences.includes(t.name));
        const uniqueFavorites = Array.from(new Map(favorites.map(t => [t.id, t])).values());
        setFavoriteTeams(uniqueFavorites);
        setAllTeams(teams);
      } catch (error) {
        console.error("Erreur lors du chargement du tableau de bord :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  const competitions = [...new Set(
    favoriteTeams.flatMap(team => team.runningCompetitions?.map(c => c.name) || [])
  )];

  const upcomingMatches = matches.filter(m =>
    favoriteTeams.some(t =>
      m.homeTeam.name === t.name || m.awayTeam.name === t.name
    )
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Bienvenue sur FootballHub</h2>
            <p className="text-gray-600">Tableau de bord personnalisé</p>
          </div>
          
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">Équipes suivies</p>
            <p className="text-2xl font-bold text-gray-800">{favoriteTeams.length}</p>
            <Star className="w-8 h-8 text-yellow-500 mt-2" />
          </div>

          {upcomingMatches.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600">Matchs à venir</p>
              <p className="text-2xl font-bold text-gray-800">{upcomingMatches.length}</p>
              <Calendar className="w-8 h-8 text-blue-500 mt-2" />
            </div>
          )}

          {competitions.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600">Compétitions</p>
              <p className="text-2xl font-bold text-gray-800">{competitions.length}</p>
              <Trophy className="w-8 h-8 text-green-500 mt-2" />
            </div>
          )}
        </div>

        {/* Détails des équipes */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favoriteTeams.map(team => (
            <div
              key={team.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img src={team.crest} alt={team.name} className="w-12 h-12 object-contain" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{team.name}</h3>
                  <p className="text-sm text-gray-500">
                    {team.coach?.name ? `Entraîneur : ${team.coach.name}` : 'Entraîneur inconnu'}
                  </p>
                </div>
              </div>
              {team.squad?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">Joueurs :</p>
                  <ul className="text-sm text-gray-700 list-disc list-inside space-y-1 max-h-32 overflow-y-auto">
                    {team.squad.slice(0, 5).map((player, i) => (
                      <li key={i}>{player.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de déconnexion */}
      {showModal && (
        <Modal title="Confirmation" onClose={() => setShowModal(false)}>
          <p>Voulez-vous vraiment vous déconnecter ?</p>
          <div className="flex justify-end mt-4 space-x-3">
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirmLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Oui
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Dashboard;
