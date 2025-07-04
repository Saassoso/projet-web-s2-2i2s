import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/auth/AuthContext';
import { Trophy } from 'lucide-react';

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Ajout d'un état de chargement

  const handleSubmit = async (e) => {
    e.preventDefault();
  setLoading(true);
  setError('');
    
    try {
    console.log('Données envoyées:', { email, password }); // Debug
    
    const res = await axios.post('http://localhost:5000/auth/register', 
      {
        email: email.trim(), // Supprime les espaces
        password: password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    

    const token = res.data.token;
    if (!token) {
      throw new Error('Token non reçu du serveur');
    }
    
    login(token);
    
  } catch (err) {
    console.error('Erreur complète:', err);
    console.error('Réponse du serveur:', err.response?.data);
    setError(err.response?.data?.message || err.message || 'Erreur lors de l\'inscription');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Inscription</h2>
          <p className="text-gray-600 mt-2">Créez votre compte FootballHub</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-200 transform hover:scale-105"
          >
            S'inscrire
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Déjà un compte ?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Connectez-vous
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
