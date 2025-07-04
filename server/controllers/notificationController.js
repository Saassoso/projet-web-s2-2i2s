import Notification from '../models/notification.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = await Notification.countDocuments({ 
      userId: req.user.id, 
      isRead: false 
    });
    
    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ msg: 'Error', error: error.message });
  }
};