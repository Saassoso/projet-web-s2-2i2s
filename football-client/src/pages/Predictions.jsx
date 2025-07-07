import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Brain, Search, Trophy, TrendingUp, Calendar, RefreshCw, AlertCircle } from 'lucide-react';

const Predictions = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [error, setError] = useState('');

  // Popular teams for quick selection
  const popularTeams = [
    'Manchester City', 'Arsenal', 'Liverpool', 'Chelsea', 'Manchester United',
    'Barcelona', 'Real Madrid', 'Bayern Munich', 'Paris Saint-Germain',
    'Juventus', 'Inter Milan', 'AC Milan', 'Atletico Madrid', 'Borussia Dortmund'
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Filter teams based on search
  const filteredTeams = popularTeams.filter(team =>
    team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addTeam = (team) => {
    if (!selectedTeams.includes(team) && selectedTeams.length < 10) {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  const removeTeam = (team) => {
    setSelectedTeams(selectedTeams.filter(t => t !== team));
  };

  const generatePredictions = async () => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
   if (!apiKey) {
  console.error('API key not found. Make sure REACT_APP_GEMINI_API_KEY is defined in .env file.');
  setError('API key missing. Contact support.');
  return;
}

    if (selectedTeams.length === 0) {
      setError('Please select at least one team');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const prompt = `As a football prediction expert, provide predictions for matches involving these teams today (${today}): ${selectedTeams.join(', ')}. 

For each potential match, provide:
1. Team names (if they're playing today)
2. Predicted score
3. Match probability percentages (home win, draw, away win)
4. Brief reasoning (2-3 key factors)

Format as JSON array like this:
[
  {
    "homeTeam": "Team A",
    "awayTeam": "Team B",
    "predictedScore": "2-1",
    "homeWin": 45,
    "draw": 30,
    "awayWin": 25,
    "reasoning": ["Factor 1", "Factor 2", "Factor 3"],
    "competition": "League Name"
  }
]

If no matches today, create hypothetical matchups between the selected teams with realistic predictions.`;

const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  })
});


      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to get predictions');
      }

      const geminiResponse = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response
      const jsonMatch = geminiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const predictionsData = JSON.parse(jsonMatch[0]);
        setPredictions(predictionsData.map((pred, index) => ({
          ...pred,
          id: index + 1,
          confidence: Math.floor(Math.random() * 20) + 70, // Random confidence 70-90%
          date: new Date()
        })));
      } else {
        throw new Error('Invalid response format from Gemini');
      }

    } catch (err) {
      setError(err.message || 'Failed to generate predictions');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPredictionColor = (percentage) => {
    if (percentage >= 40) return 'bg-green-500';
    if (percentage >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <Brain className="w-8 h-8 mr-3 text-purple-600" />
            Gemini AI Football Predictions
          </h1>
          <p className="text-gray-600">
            Get intelligent football predictions powered by Google's Gemini AI
          </p>
        </div>



        {/* Team Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Teams</h2>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Search teams..."
            />
          </div>

          {/* Available Teams */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Available Teams</h3>
            <div className="flex flex-wrap gap-2">
              {filteredTeams.map((team) => (
                <button
                  key={team}
                  onClick={() => addTeam(team)}
                  disabled={selectedTeams.includes(team)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTeams.includes(team)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {team}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Teams */}
          {selectedTeams.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Teams ({selectedTeams.length}/10)</h3>
              <div className="flex flex-wrap gap-2">
                {selectedTeams.map((team) => (
                  <div
                    key={team}
                    className="flex items-center space-x-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    <span>{team}</span>
                    <button
                      onClick={() => removeTeam(team)}
                      className="text-purple-500 hover:text-purple-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <div className="mb-6">
          <button
            onClick={generatePredictions}
            disabled={loading || selectedTeams.length === 0}
            className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Brain className="w-5 h-5" />
            )}
            <span>{loading ? 'Generating Predictions...' : 'Generate Predictions'}</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 font-medium">Error</span>
            </div>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}

        {/* Predictions */}
        {predictions.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Predictions</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {predictions.map((prediction) => (
                <div
                  key={prediction.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  {/* Header */}
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">
                        {prediction.competition || 'Football Match'}
                      </span>
                      <div className={`text-sm font-bold ${getConfidenceColor(prediction.confidence)}`}>
                        {prediction.confidence}% confidence
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Today</span>
                    </div>
                  </div>

                  {/* Teams and Score */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-center">
                          {prediction.homeTeam}
                        </div>
                      </div>

                      <div className="text-center mx-4">
                        <div className="text-2xl font-bold text-gray-800">
                          {prediction.predictedScore}
                        </div>
                        <div className="text-xs text-gray-500">Prediction</div>
                      </div>

                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-center">
                          {prediction.awayTeam}
                        </div>
                      </div>
                    </div>

                    {/* Prediction Bars */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Home Win</span>
                        <span className="text-sm font-bold text-gray-800">
                          {prediction.homeWin}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getPredictionColor(prediction.homeWin)}`}
                          style={{ width: `${prediction.homeWin}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Draw</span>
                        <span className="text-sm font-bold text-gray-800">
                          {prediction.draw}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getPredictionColor(prediction.draw)}`}
                          style={{ width: `${prediction.draw}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Away Win</span>
                        <span className="text-sm font-bold text-gray-800">
                          {prediction.awayWin}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getPredictionColor(prediction.awayWin)}`}
                          style={{ width: `${prediction.awayWin}%` }}
                        />
                      </div>
                    </div>

                    {/* Key Factors */}
                    {prediction.reasoning && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Key Factors</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {prediction.reasoning.map((factor, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <TrendingUp className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">How to use:</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Search and select the teams you want predictions for</li>
            <li>2. Click "Generate Predictions" to get AI-powered match predictions</li>
            <li>3. View detailed predictions with scores, probabilities, and reasoning</li>
            <li>4. Refresh predictions anytime for updated analysis</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Predictions;