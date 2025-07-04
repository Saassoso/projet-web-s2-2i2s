import { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, Calendar, Clock, MapPin } from "lucide-react";
export default function Home({ search = "" }) {
  const [matches, setMatches] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("Tout");
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        // Appel à votre API avec les paramètres de date
        const res = await axios.get("http://localhost:5000/matches", {
          params: {
            dateFrom: "2024-03-31",
            dateTo: "2024-04-02"
          }
        });
        
        // Extraire les matches du résultat de l'API
        const matchesData = res.data.matches || [];
        setMatches(matchesData);
        
        // Générer la liste des leagues dynamiquement à partir des matchs
        const leaguesFromApi = [...new Set(matchesData.map(m => m.competition.name))];
        setLeagues(["Tout", ...leaguesFromApi]);
      } catch (err) {
        console.error("Erreur lors du chargement des matchs :", err);
      }
      setLoading(false);
    };

    fetchMatches();
  }, []);

  const getLeagueName = (competition) => competition?.name || "Inconnu";

  const getStatusColor = (status) => {
    switch (status) {
      case "LIVE":
      case "IN_PLAY":
        return "bg-green-100 text-green-700 border-green-200";
      case "FINISHED":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "SCHEDULED":
      case "TIMED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "FINISHED":
        return "Terminé";
      case "LIVE":
      case "IN_PLAY":
        return "🔴 Live";
      case "SCHEDULED":
      case "TIMED":
        return "À venir";
      default:
        return status;
    }
  };

  const filteredMatches = matches.filter((match) => {
    const teamSearch = search?.toLowerCase() || "";
    const byTeam =
      match.homeTeam.name.toLowerCase().includes(teamSearch) ||
      match.awayTeam.name.toLowerCase().includes(teamSearch);

    const byLeague =
      selectedLeague === "Tout" || getLeagueName(match.competition) === selectedLeague;

    return byTeam && byLeague;
  });

  if (loading) {
    return (
      
      <div className="flex flex-1 min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des matchs...</p>
          </div>
        </div>
      </div>
     
    );
  }

  return (
    <div className="flex flex-1 min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden lg:block shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-blue-600" />
          Compétitions
        </h2>
        <ul className="space-y-2">
          {leagues.map((league, idx) => (
            <li key={idx}>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedLeague === league
                    ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 font-semibold shadow-sm border border-blue-200"
                    : "hover:bg-gray-50 text-gray-700 hover:shadow-sm border border-transparent"
                }`}
                onClick={() => setSelectedLeague(league)}
              >
                {league}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Matchs à l'affiche
          </h1>
          <p className="text-gray-600">
            Suivez vos matchs préférés en temps réel
          </p>

          {/* Filtres mobiles */}
          <div className="lg:hidden mt-4">
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {leagues.map((league, idx) => (
                <option key={idx} value={league}>
                  {league}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredMatches.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Aucun match trouvé
            </h3>
            <p className="text-gray-500">
              {search
                ? `Aucun match trouvé pour "${search}"`
                : "Aucun match disponible pour cette sélection"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <div
                key={match.id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
              >
                {/* En-tête du match */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full">
                    {getLeagueName(match.competition)}
                  </span>
                  <span
                    className={`font-semibold px-3 py-1 rounded-full text-sm border ${getStatusColor(
                      match.status
                    )}`}
                  >
                    {getStatusText(match.status)}
                  </span>
                </div>

                {/* Équipes et score */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <img
                      src={match.homeTeam.crest}
                      alt={match.homeTeam.name}
                      className="w-10 h-10 object-contain flex-shrink-0"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/40x40?text=?";
                      }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-gray-800 text-sm truncate">
                        {match.homeTeam.shortName || match.homeTeam.name}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        {match.homeTeam.name}
                      </span>
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-gray-800 mx-4 flex-shrink-0">
                    {match.score && match.score.fullTime && match.score.fullTime.home !== null
                      ? `${match.score.fullTime.home} - ${match.score.fullTime.away}`
                      : "vs"}
                  </div>

                  <div className="flex items-center space-x-3 flex-1 justify-end min-w-0">
                    <div className="flex flex-col items-end min-w-0">
                      <span className="font-semibold text-gray-800 text-sm text-right truncate">
                        {match.awayTeam.shortName || match.awayTeam.name}
                      </span>
                      <span className="text-xs text-gray-500 text-right truncate">
                        {match.awayTeam.name}
                      </span>
                    </div>
                    <img
                      src={match.awayTeam.crest}
                      alt={match.awayTeam.name}
                      className="w-10 h-10 object-contain flex-shrink-0"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/40x40?text=?";
                      }}
                    />
                  </div>
                </div>

                {/* Informations du match */}
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(match.utcDate).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="w-3 h-3" />
                    <span>Journée {match.matchday}</span>
                  </div>
                  {match.area && (
                    <div className="flex items-center justify-center space-x-2">
                      <img 
                        src={match.area.flag} 
                        alt={match.area.name}
                        className="w-4 h-3 object-cover rounded-sm"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <span>{match.area.name}</span>
                    </div>
                  )}
                </div>

                {/* Score à la mi-temps si disponible */}
                {match.score && match.score.halfTime && match.score.halfTime.home !== null && (
                  <div className="mt-3 text-center">
                    <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                      Mi-temps: {match.score.halfTime.home} - {match.score.halfTime.away}
                    </span>
                  </div>
                )}

                {/* Action hover */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}