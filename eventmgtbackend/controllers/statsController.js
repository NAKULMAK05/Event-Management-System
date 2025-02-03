import Event from '../models/Event.js'; 
import mongoose from 'mongoose' // Ensure you have the Event model imported

export const updateLike = async (req, res) => {
  const { userId } = req.body;
  const eventId = req.params.eventId;

  // Validate that userId and eventId are provided
  if (!userId || !eventId) {
    return res.status(400).json({ success: false, msg: "User ID and Event ID are required" });
  }

  console.log("userId", userId);  // Log userId to check if it is valid

  try {
    // Convert the userId to an ObjectId (MongoDB format)
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the event by eventId
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, msg: "Event not found" });
    }

    // Check if the user has already liked the event
    const index = event.likes.findIndex(id => id.equals(userObjectId));

    if (index === -1) {
      // User hasn't liked the event yet, so add their like
      event.likes.push(userObjectId);
    } else {
      // User has already liked the event, so remove their like
      event.likes.splice(index, 1);
    }

    // Save the event with the updated likes
    await event.save();

    // Return the updated like count in the response
    return res.status(200).json({ success: true, likes: event.likes.length });

  } catch (err) {
    console.error('Error during like update:', err);
    return res.status(500).json({ success: false, msg: "Server error during like update" });
  }
};



// Update comment count
export const updateComment = async (req, res) => {
  const userId = req.body.userId || req.user?._id;  // Extract from body or JWT
  const eventId = req.params.eventId;
  const { text } = req.body;

  if (!userId || !text || !eventId) {
    return res.status(400).json({ success: false, msg: "User ID, text, and Event ID are required" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, msg: "Event not found" });
    }

    event.comments.push({ commentedBy: userId, text });
    await event.save();

    res.status(200).json({ success: true, msg: "Comment added successfully" });
  } catch (err) {
    console.error("Error during comment update:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

