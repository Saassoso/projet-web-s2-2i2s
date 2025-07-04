import React, { useState, useEffect, useRef } from 'react';

export const NotificationHandler = () => {
  const [favoriteTeam, setFavoriteTeam] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Not Connected');
  const [isPolling, setIsPolling] = useState(false);
  const pollingRef = useRef(null);

  const teams = ['Arsenal', 'Chelsea', 'Liverpool', 'ManCity', 'ManUtd', 'Tottenham'];

  // Subscribe to notifications
  const subscribe = async () => {
    if (!favoriteTeam) {
      alert('Please select your favorite team first!');
      return;
    }

    try {
      setConnectionStatus('Connecting...');
      
      // Subscribe to backend server
      const response = await fetch('http://localhost:3002/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: `user_${Date.now()}`, 
          favoriteTeam: favoriteTeam 
        })
      });

      if (response.ok) {
        const result = await response.json();
        setConnectionStatus('Connected to Server ✅');
        setIsSubscribed(true);
        addNotification(`✅ Successfully subscribed to ${favoriteTeam} notifications!`);
        
        // Start polling for notifications
        startPolling();
        
        console.log('Subscription successful:', result);
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      // If server is offline, work in demo mode
      setConnectionStatus('Demo Mode (Server Offline) 🔄');
      setIsSubscribed(true);
      addNotification(`🔄 Demo Mode: Subscribed to ${favoriteTeam} (Server offline)`);
      
      // Still start demo notifications
      startDemoMode();
      
      console.log('Running in demo mode - server not available:', error.message);
    }
  };

  // Start polling for real notifications from server
  const startPolling = () => {
    setIsPolling(true);
    
    // Poll every 5 seconds for new notifications
    pollingRef.current = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:3002/notifications');
        if (!response.ok) {   
          console.log(`Polling failed with status: ${response.status}`);
        }
        const data = await response.json();
        if (data.notifications && data.notifications.length > 0) {
          data.notifications.forEach(notif => {
            addNotification(notif.message);
          });
        } else {
          console.log('No new notifications');
        }
        // Log polling status
        console.log('Polling for notifications...');
        
      } catch (error) {
        console.log('Polling error:', error.message);
      }
    }, 5000);
  };

  // Demo mode with auto-generated notifications
  const startDemoMode = () => {
    const interval = setInterval(() => {
      const messages = [
        `🏆 ${favoriteTeam} match starting in 15 minutes!`,
        `⚽ GOAL! ${favoriteTeam} just scored!`,
        `📊 ${favoriteTeam} - Live match updates`,
        `🔴 LIVE: ${favoriteTeam} vs Opponent (35')`,
        `⏰ ${favoriteTeam} - Half-time break`,
        `🏁 Full-time: ${favoriteTeam} match finished`,
        `📈 ${favoriteTeam} moved up in standings!`,
        `⚡ Breaking: ${favoriteTeam} transfer news!`
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      addNotification(randomMessage);
    }, 8000);

    // Store interval reference for cleanup
    pollingRef.current = interval;
  };

  // Add notification to list
  const addNotification = (message) => {
    const newNotif = {
      id: Date.now(),
      message,
      time: new Date().toLocaleTimeString(),
      team: favoriteTeam
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 9)]);
  };

  // Manual test notification
  const sendTestNotification = async () => {
    if (connectionStatus.includes('Connected to Server')) {
      try {
        // Send test notification through server
        const response = await fetch('http://localhost:3002/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            team: favoriteTeam, 
            message: `🧪 Test notification for ${favoriteTeam} fans!` 
          })
        });

        if (response.ok) {
          const result = await response.json();
          addNotification(`🧪 Test notification sent to ${result.sent} ${favoriteTeam} fans!`);
        }
      } catch (error) {
        addNotification(`❌ Failed to send test notification: ${error.message}`);
      }
    } else {
      // Demo mode test
      const testMessages = [
        `🧪 Test: ${favoriteTeam} notification working!`,
        `⚽ Test Goal: ${favoriteTeam} scored!`,
        `🏆 Test: ${favoriteTeam} match starting!`
      ];
      const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)];
      addNotification(randomMessage);
    }
  };

  // Trigger match simulation (if server supports it)
  const triggerMatchSimulation = async () => {
    try {
      // This would call your MatchWatcher if it had an endpoint
      addNotification(`🎮 Match simulation requested for ${favoriteTeam}`);
      
      // Since your MatchWatcher runs automatically, just show a message
      addNotification(`⚽ MatchWatcher is running - matches simulate every 2 minutes`);
    } catch (error) {
      addNotification(`❌ Could not trigger match simulation: ${error.message}`);
    }
  };

  // Reset everything
  const reset = () => {
    setIsSubscribed(false);
    setNotifications([]);
    setConnectionStatus('Not Connected');
    setFavoriteTeam('');
    setIsPolling(false);
    
    // Clear polling interval
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">⚽ Football Notifications</h2>
          <p className="text-blue-100 mt-1">Connected to Push Server</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Team Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Your Favorite Team:
            </label>
            <select
              value={favoriteTeam}
              onChange={(e) => setFavoriteTeam(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubscribed}
            >
              <option value="">Select a team...</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          {/* Connection Status */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">
              Status: <span className="text-blue-600">{connectionStatus}</span>
            </p>
            {isPolling && (
              <p className="text-xs text-green-600 mt-1">
                🔄 Polling for notifications...
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isSubscribed ? (
              <button
                onClick={subscribe}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105"
              >
                🔔 Subscribe to Notifications
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={sendTestNotification}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                  🧪 Send Test Notification
                </button>
                
                <button
                  onClick={triggerMatchSimulation}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                  🎮 Match Simulation Info
                </button>
                
                <button
                  onClick={reset}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                  🔄 Reset & Unsubscribe
                </button>
              </div>
            )}
          </div>

          {/* Server Info */}
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>💡 Server Integration:</strong>
            </p>
            <ul className="text-xs text-yellow-700 mt-1 space-y-1">
              <li>• Push Server: localhost:3002</li>
              <li>• MatchWatcher: Auto-simulates matches</li>
              <li>• Notifier: Handles push notifications</li>
            </ul>
          </div>

          {/* Notifications List */}
          {notifications.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                📱 Recent Notifications ({notifications.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded animate-pulse"
                  >
                    <p className="text-sm text-gray-800">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notif.time} • {notif.team}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subscription Status */}
          {isSubscribed && (
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium">
                ✅ Subscribed to {favoriteTeam}
              </p>
              <p className="text-green-600 text-sm mt-1">
                {connectionStatus.includes('Connected') 
                  ? 'Receiving live notifications from server'
                  : 'Demo notifications active'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};