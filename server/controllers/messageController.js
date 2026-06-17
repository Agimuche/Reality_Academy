const Message = require('../models/Message');
const User = require('../models/User');

const buildMessagePayload = (message) => {
  const createdAt = new Date(message.createdAt || Date.now());
  return {
    id: message._id || message.id,
    from: message.from?._id ? message.from._id.toString() : message.from.toString(),
    to: message.to?._iid ? message.to._id.toString() : message.to.toString(),
    text: message.text,
    read: message.read,
    time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: createdAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    createdAt,
  };
};

// @route   GET /api/v1/messages/:userId
// @desc    Get conversation between users
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Message.find({
      $or: [
        { from: currentUserId, to: userId },
        { from: userId, to: currentUserId },
      ],
    })
      .populate('from', 'name avatar')
      .populate('to', 'name avatar')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages.map(buildMessagePayload),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   POST /api/v1/messages
// @desc    Send a message to another user
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { to, text } = req.body;
    const from = req.user.id;

    if (!to || !text) {
      return res.status(400).json({
        success: false,
        message: 'Recipient and message text are required',
      });
    }

    const message = await Message.create({ from, to, text, read: false });

    res.status(201).json({
      success: true,
      data: buildMessagePayload(message),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/v1/messages/contacts
// @desc    Get all chat contacts with last message
// @access  Private
exports.getContacts = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Get all unique users you've messaged
    const messages = await Message.find({
      $or: [{ from: currentUserId }, { to: currentUserId }],
    })
      .sort({ createdAt: -1 })
      .lean();

    const contactsMap = new Map();

    for (const msg of messages) {
      const otherUserId = msg.from.toString() === currentUserId ? msg.to : msg.from;
      const otherUserIdStr = otherUserId.toString();

      if (!contactsMap.has(otherUserIdStr)) {
        contactsMap.set(otherUserIdStr, {
          userId: otherUserId,
          lastMessage: msg.text,
          lastMessageTime: msg.createdAt,
          read: msg.read,
        });
      }
    }

    // Populate user details
    const contacts = [];
    for (const [, contact] of contactsMap) {
      const user = await User.findById(contact.userId).select('name avatar email');
      contacts.push({
        ...contact,
        user,
      });
    }

    // Sort by last message time
    contacts.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts.map(contact => ({
        user: {
          id: contact.user._id || contact.user.id,
          name: contact.user.name,
          avatar: contact.user.avatar,
          email: contact.user.email,
        },
        lastMessage: contact.lastMessage,
        lastMessageTime: contact.lastMessageTime,
        read: contact.read,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
