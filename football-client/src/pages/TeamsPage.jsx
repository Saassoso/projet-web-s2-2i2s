import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../components/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Star, StarOff } from 'lucide-react';

function TeamsPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Récupérer les équipes
        const res = await axios.get('http://localhost:5000/teams/search');
        setTeams(res.data);
        localStorage.setItem('equipes', JSON.stringify(res.data));
        
        // Récupérer les préférences de l'utilisateur
        const profileRes = await axios.get('http://localhost:5000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserFavorites(profileRes.data.preferences || []);
        
      } catch (err) {
        console.error("Erreur API, chargement des équipes depuis le localStorage :", err);

        // En cas d'erreur, charger depuis le localStorage
        const cachedTeams = localStorage.getItem('equipes');
        if (cachedTeams) {
          setTeams(JSON.parse(cachedTeams));
          setError("Connexion perdue, données chargées depuis le cache local.");
        } else {
          setError("Erreur lors du chargement des équipes et aucune donnée en cache.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [isAuthenticated, navigate]);

  const handleAddToFavorites = async (teamName) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/preferences',
        { team: teamName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Mettre à jour l'état local
      setUserFavorites(prev => [...prev, teamName]);
      alert(`${teamName} ajoutée à vos favoris !`);
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'équipe :", err);
      alert("Impossible d'ajouter l'équipe. Veuillez réessayer.");
    }
  };

  const handleRemoveFromFavorites = async (teamName) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        'http://localhost:5000/preferences',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { team: teamName }
        }
      );
      
      // Mettre à jour l'état local
      setUserFavorites(prev => prev.filter(favorite => favorite !== teamName));
      alert(`${teamName} supprimée de vos favoris !`);
    } catch (err) {
      console.error("Erreur lors de la suppression de l'équipe :", err);
      alert("Impossible de supprimer l'équipe. Veuillez réessayer.");
    }
  };

  const isTeamFavorite = (teamName) => {
    return userFavorites.includes(teamName);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des équipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Clubs</h1>
        <p className="text-gray-600">Ajoutez vos clubs favoris à votre profil</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teams.map((team) => {
          const isFavorite = isTeamFavorite(team.name);
          
          return (
            <div
              key={team.id}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={team.crest || "https://via.placeholder.com/40"}
                  alt={team.name}
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {team.shortName || team.name}
                  </h3>
                  <p className="text-sm text-gray-500">{team.venue}</p>
                </div>
              </div>

              {isFavorite ? (
                <button
                  onClick={() => handleRemoveFromFavorites(team.name)}
                  className="w-full mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition duration-200 transform hover:scale-105 flex items-center justify-center"
                >
                  <StarOff className="w-4 h-4 mr-2" />
                  Retirer des favoris
                </button>
              ) : (
                <button
                  onClick={() => handleAddToFavorites(team.name)}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-200 transform hover:scale-105 flex items-center justify-center"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Ajouter aux favoris
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TeamsPage;