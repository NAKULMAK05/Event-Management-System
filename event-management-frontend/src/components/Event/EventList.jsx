import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaComment, FaShare } from "react-icons/fa";

const EventList = ({ events, onEventLiked, onEventCommented, onEventShared }) => {
  const [comment, setComment] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Handle liking an event
  const handleLike = async (eventId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/event/${eventId}/like`,
        {},
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      onEventLiked(eventId, res.data.likes); // Notify parent component
    } catch (err) {
      console.error("Error liking event:", err);
    }
  };

  // Handle adding a comment to an event
  const handleComment = async (eventId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/event/${eventId}/comment`,
        { text: comment },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      onEventCommented(eventId, res.data.comments); // Notify parent component
      setComment(""); // Clear the comment input
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Handle sharing an event
  const handleShare = (eventId) => {
    const eventLink = `${window.location.origin}/event/${eventId}`;
    navigator.clipboard.writeText(eventLink).then(() => {
      alert("Event link copied to clipboard!");
    });
  };

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event._id} className="bg-white p-4 rounded-lg shadow-md">
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{event.title}</h2>
            <p className="text-gray-700 mb-4">{event.description}</p>
            <p className="text-sm text-gray-500 mb-4">
              Date: {new Date(event.date).toLocaleDateString()} | Time: {event.time}
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => handleLike(event._id)}
                className="flex items-center space-x-2 text-red-500 hover:text-red-600"
              >
                <FaHeart />
                <span>{event.likes.length} Likes</span>
              </button>
              <button
                onClick={() => setSelectedEventId(event._id === selectedEventId ? null : event._id)}
                className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
              >
                <FaComment />
                <span>{event.comments.length} Comments</span>
              </button>
              <button
                onClick={() => handleShare(event._id)}
                className="flex items-center space-x-2 text-green-500 hover:text-green-600"
              >
                <FaShare />
                <span>Share</span>
              </button>
            </div>
            {selectedEventId === event._id && (
              <div className="mt-4">
                <div className="space-y-2">
                  {event.comments.map((comment, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded-lg">
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                  <button
                    onClick={() => handleComment(event._id)}
                    className="mt-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
