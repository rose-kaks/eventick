const Modal = ({ date, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [description, setDescription] = useState('');
  
    const handleSave = () => {
      if (!title || !startTime || !endTime) {
        alert('Please fill in all fields!');
        return;
      }
  
      const newEvent = {
        id: Date.now(),
        date: date.toDateString(), // Save the exact selected date
        title,
        startTime,
        endTime,
        description,
      };
  
      onSave(newEvent);
      onClose();
    };
  
    return (
      <div className="modal">
        <div className="modal-content">
          <h3>Add Event for {date.toDateString()}</h3>
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    );
  };
  
  export default Modal;
  