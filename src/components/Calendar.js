import React, { useState, useEffect } from "react";
import clsx from "clsx";
import dayjs from "dayjs";
import "../App.css";

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState({});
    const [eventForm, setEventForm] = useState({ name: "", time: "", description: "" });
  
    useEffect(() => {
      const storedEvents = JSON.parse(localStorage.getItem("events"));
      if (storedEvents) {
        setEvents(storedEvents);
      }
    }, []);
  
    useEffect(() => {
      localStorage.setItem("events", JSON.stringify(events));
    }, [events]);
  
    const daysInMonth = currentMonth.daysInMonth();
    const startDayOfWeek = currentMonth.startOf("month").day();
    const today = dayjs();
  
    const handlePreviousMonth = () => {
      setCurrentMonth(currentMonth.subtract(1, "month"));
    };
  
    const handleNextMonth = () => {
      setCurrentMonth(currentMonth.add(1, "month"));
    };
  
    const handleDateClick = (day) => {
      const selected = currentMonth.date(day);
      setSelectedDate(selected);
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEventForm({ ...eventForm, [name]: value });
    };
  
    const handleAddEvent = () => {
      if (!selectedDate) return;
      const dateKey = selectedDate.format("YYYY-MM-DD");
      const newEvent = { ...eventForm, id: Date.now() };
      setEvents({
        ...events,
        [dateKey]: events[dateKey] ? [...events[dateKey], newEvent] : [newEvent],
      });
      setEventForm({ name: "", time: "", description: "" });
    };
  
    const handleDeleteEvent = (dateKey, eventId) => {
      const updatedEvents = {
        ...events,
        [dateKey]: events[dateKey].filter((event) => event.id !== eventId),
      };
      setEvents(updatedEvents);
    };
  
    const handleEditEvent = (dateKey, eventId, updatedEvent) => {
      const updatedEvents = {
        ...events,
        [dateKey]: events[dateKey].map((event) =>
          event.id === eventId ? { ...event, ...updatedEvent } : event
        ),
      };
      setEvents(updatedEvents);
    };
  
    const renderDays = () => {
      const days = [];
  
      // Padding days for the start of the month
      for (let i = 0; i < startDayOfWeek; i++) {
        days.push(<div key={`pad-${i}`} className="day-cell empty" />);
      }
  
      // Days of the current month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = currentMonth.date(day);
        const isToday = today.isSame(date, "day");
        const isSelected = selectedDate && selectedDate.isSame(date, "day");
  
        days.push(
          <div
            key={day}
            className={clsx(
              "day-cell",
              isToday && "today",
              isSelected && "selected"
            )}
            onClick={() => handleDateClick(day)}
          >
            {day}
          </div>
        );
      }
  
      return days;
    };
  
    return (
      <div className="calendar-container">
        <header className="calendar-header">
          <button className="nav-button" onClick={handlePreviousMonth}>
            Previous
          </button>
          <h2 className="month-title">
            {currentMonth.format("MMMM YYYY")}
          </h2>
          <button className="nav-button" onClick={handleNextMonth}>
            Next
          </button>
        </header>
  
        <div className="weekdays-row">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="weekday-cell">
              {day}
            </div>
          ))}
        </div>
  
        <div className="calendar-body">
          <div className="days-grid">{renderDays()}</div>
          <div className="side-panel">
            <h3>Events for {selectedDate ? selectedDate.format("MMM D, YYYY") : "Select a Date"}</h3>
            {selectedDate && (
              <ul className="event-list">
                {(events[selectedDate.format("YYYY-MM-DD")] || []).map((event) => (
                  <li key={event.id} className="event-item">
                    <strong>{event.name}</strong> at {event.time}
                    <p>{event.description}</p>
                    <button
                      className="edit-button"
                      onClick={() => {
                        const newName = prompt("Edit Event Name", event.name);
                        const newTime = prompt("Edit Event Time", event.time);
                        const newDescription = prompt(
                          "Edit Event Description",
                          event.description
                        );
                        handleEditEvent(selectedDate.format("YYYY-MM-DD"), event.id, {
                          name: newName,
                          time: newTime,
                          description: newDescription,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDeleteEvent(selectedDate.format("YYYY-MM-DD"), event.id)
                      }
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="event-form">
              <h4>Add Event</h4>
              <input
                type="text"
                name="name"
                placeholder="Event Name"
                value={eventForm.name}
                onChange={handleInputChange}
              />
              <input
                type="time"
                name="time"
                placeholder="Event Time"
                value={eventForm.time}
                onChange={handleInputChange}
              />
              <textarea
                name="description"
                placeholder="Event Description (optional)"
                value={eventForm.description}
                onChange={handleInputChange}
              ></textarea>
              <button className="add-event-button" onClick={handleAddEvent}>
                Add Event
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Calendar;
  