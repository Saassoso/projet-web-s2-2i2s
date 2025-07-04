import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/auth/AuthContext';
import { Star, UserCircle, Trophy, ArrowLeft, Edit } from 'lucide-react';

function Profile() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem('token');
    console.log('Token trouvé avec succés:', token); // Debug
    
    const fetchProfile = async () => {
      try {
        console.log('Début de fetchProfile'); // Debug
        const res = await axios.get('http://localhost:5000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Réponse profil:', res.data); // Debug
        console.log('Type de res.data:', typeof res.data); // Debug supplémentaire
        console.log('Clés de res.data:', Object.keys(res.data)); // Debug supplémentaire
        
        setUser(res.data);
        setError(''); // Reset l'erreur en cas de succès
      } catch (err) {
        console.error('Erreur profil:', err);
        console.error('Détails erreur:', err.response?.data); // Debug supplémentaire
        
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Erreur lors de la récupération du profil');
        }
      } finally {
        setLoading(false);
      }
    };
   
    // Vérifier si on a un token
    if (!token) {
      console.log('Pas de token, redirection vers login'); // Debug
      setError('Token manquant');
      setLoading(false);
      navigate('/login');
      return;
    }

    // Si on a un token, récupérer le profil
    fetchProfile();
  }, [navigate, isAuthenticated]);

  // Affichage du loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  // Affichage des erreurs
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Trophy className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800">Erreur</h2>
            <p className="text-gray-600 mt-2">Impossible de charger le profil</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-center">{error}</p>
          </div>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-200 transform hover:scale-105"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    );
  }

  // CORRECTION : Vérifier si user est null OU si user n'a pas d'email
  if (!user || !user.email) {
    console.log('User state:', user); // Debug pour voir l'état de user
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Aucune donnée utilisateur trouvée</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition duration-200 transform hover:scale-105"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Affichage du profil utilisateur
  console.log('Rendu du profil pour user:', user); // Debug final
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <UserCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Mon Profil</h2>
          <p className="text-gray-600 mt-2">Informations personnelles</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
              {user.email}
            </div>
          </div>

          {user.name && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                {user.name}
              </div>
            </div>
          )}

          <div>
  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
    <Star className="w-4 h-4 text-yellow-500 mr-2" />
    Équipes favorites
  </label>
  {user.preferences && user.preferences.length > 0 ? (
    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
      <ul className="space-y-1">
        {user.preferences.map((team, index) => (
          <li key={index} className="flex items-center text-gray-700">
            <Trophy className="w-3 h-3 text-yellow-500 mr-2" />
            {team}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
      Aucune équipe sélectionnée
    </div>
  )}
</div>


          {user.createdAt && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membre depuis
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-3">
          
          
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition duration-200 transform hover:scale-105 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au Dashboard
          </button>
        </div>
      </div>
    </div>
  );
  
}

export default Profile;