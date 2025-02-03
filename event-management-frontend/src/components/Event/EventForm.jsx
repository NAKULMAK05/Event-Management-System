// src/Event/EventForm.jsx
import React, { useState, useEffect } from "react";

const EventForm = ({ onEventCreated, onEventUpdate, eventToEdit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    date: "",
    time: "",
    schedule: "",
    _id: "", // include _id in state so that update requests have it
  });

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title || "",
        description: eventToEdit.description || "",
        thumbnail: eventToEdit.thumbnail || "",
        // Format the date as yyyy-mm-dd for input (if available)
        date: eventToEdit.date ? eventToEdit.date.substring(0, 10) : "",
        time: eventToEdit.time || "",
        schedule: eventToEdit.schedule || "",
        _id: eventToEdit._id || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        thumbnail: "",
        date: "",
        time: "",
        schedule: "",
        _id: "",
      });
    }
  }, [eventToEdit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (eventToEdit && onEventUpdate) {
      onEventUpdate(formData);
    } else if (onEventCreated) {
      onEventCreated(formData);
    }

    // Reset form only if creating a new event
    if (!eventToEdit) {
      setFormData({
        title: "",
        description: "",
        thumbnail: "",
        date: "",
        time: "",
        schedule: "",
        _id: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      {/* Hidden _id input to ensure it is submitted on update */}
      {eventToEdit && (
        <input type="hidden" name="_id" value={formData._id} readOnly />
      )}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="thumbnail" className="block text-gray-700 font-medium mb-2">
          Thumbnail URL
        </label>
        <input
          type="text"
          name="thumbnail"
          id="thumbnail"
          value={formData.thumbnail}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="time" className="block text-gray-700 font-medium mb-2">
            Time
          </label>
          <input
            type="time"
            name="time"
            id="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="schedule" className="block text-gray-700 font-medium mb-2">
          Schedule
        </label>
        <input
          type="text"
          name="schedule"
          id="schedule"
          value={formData.schedule}
          onChange={handleChange}
          placeholder="Enter schedule details"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500  py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          {eventToEdit ? "Update Event" : "Create Event"}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
