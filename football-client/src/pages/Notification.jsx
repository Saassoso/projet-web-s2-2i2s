import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  BellOff, 
  Trophy, 
  Clock, 
  Users, 
  Star, 
  Settings,
  Check,
  X,
  Filter
} from 'lucide-react';

function Notification() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    matchStart: true,
    goalScored: true,
    matchEnd: true,
    teamNews: true,
    favoriteTeams: true,
  });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Simuler des notifications (remplacer par API réelle)
    const mockNotifications = [
      {
        id: 1,
        type: 'match_start',
        title: 'Match en cours',
        message: 'Manchester City vs Arsenal vient de commencer',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        icon: Clock,
        color: 'blue'
      },
      {
        id: 2,
        type: 'goal_scored',
        title: 'But marqué !',
        message: 'Haaland marque pour Manchester City (1-0)',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        icon: Trophy,
        color: 'green'
      },
      {
        id: 3,
        type: 'match_end',
        title: 'Match terminé',
        message: 'Barcelona 3-1 Real Madrid',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        icon: Check,
        color: 'gray'
      },
      {
        id: 4,
        type: 'team_news',
        title: 'Actualité équipe',
        message: 'Nouvelle signature : Mbappé rejoint le Real Madrid',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        read: true,
        icon: Users,
        color: 'purple'
      },
      {
        id: 5,
        type: 'favorite_team',
        title: 'Équipe favorite',
        message: 'PSG joue demain contre Lyon à 21h00',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        read: false,
        icon: Star,
        color: 'yellow'
      }
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  }, [isAuthenticated, navigate]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const getColorClasses = (color, read) => {
    const opacity = read ? '50' : '100';
    switch (color) {
      case 'blue':
        return `bg-blue-${opacity} text-blue-700`;
      case 'green':
        return `bg-green-${opacity} text-green-700`;
      case 'purple':
        return `bg-purple-${opacity} text-purple-700`;
      case 'yellow':
        return `bg-yellow-${opacity} text-yellow-700`;
      default:
        return `bg-gray-${opacity} text-gray-700`;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <Bell className="w-8 h-8 mr-3 text-blue-600" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-3 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-600">Restez informé des dernières actualités</p>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Filtres</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'Toutes', count: notifications.length },
            { key: 'unread', label: 'Non lues', count: unreadCount },
            { key: 'read', label: 'Lues', count: notifications.length - unreadCount },
            { key: 'match_start', label: 'Débuts de match' },
            { key: 'goal_scored', label: 'Buts' },
            { key: 'team_news', label: 'Actualités' },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
              {count !== undefined && (
                <span className="ml-1 text-xs">({count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <BellOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Aucune notification
                </h3>
                <p className="text-gray-500">
                  {filter === 'all' 
                    ? "Vous n'avez pas de notifications pour le moment"
                    : `Aucune notification ${filter === 'unread' ? 'non lue' : 'dans cette catégorie'}`
                  }
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`bg-white p-4 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
                      notification.read 
                        ? 'border-gray-100 opacity-75' 
                        : 'border-blue-200 border-l-4 border-l-blue-500'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${getColorClasses(notification.color, notification.read)}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold ${notification.read ? 'text-gray-600' : 'text-gray-800'}`}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {notification.timestamp.toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-2 mt-3">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Marquer comme lu
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-600 hover:text-red-800 font-medium"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Settings Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Paramètres</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Types de notifications</h3>
                <div className="space-y-3">
                  {[
                    { key: 'matchStart', label: 'Débuts de match', icon: Clock },
                    { key: 'goalScored', label: 'Buts marqués', icon: Trophy },
                    { key: 'matchEnd', label: 'Fins de match', icon: Check },
                    { key: 'teamNews', label: 'Actualités équipes', icon: Users },
                    { key: 'favoriteTeams', label: 'Équipes favorites', icon: Star },
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{label}</span>
                      </div>
                      <button
                        onClick={() => toggleSetting(key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings[key] ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings[key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Sauvegarder les paramètres
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;