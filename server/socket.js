const Message = require('./models/Message');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins their personal room
    socket.on('join_room', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    // Handle incoming messages
    socket.on('send_message', async (data) => {
      try {
        const { from, to, text } = data;

        // Save message to database
        const message = await Message.create({
          from,
          to,
          text,
          read: false,
        });

        // Emit to recipient's room
        io.to(to).emit('receive_message', {
          id: message._id,
          from,
          to,
          text,
          createdAt: message.createdAt,
        });

        console.log(`Message sent from ${from} to ${to}`);
      } catch (error) {
        console.error('Message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { from, to } = data;
      io.to(to).emit('typing', { from });
    });

    // Mark messages as read
    socket.on('mark_read', async (data) => {
      try {
        const { from, to } = data;
        await Message.updateMany(
          { from, to },
          { read: true }
        );
        io.to(from).emit('messages_read', { from: to });
      } catch (error) {
        console.error('Mark read error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
