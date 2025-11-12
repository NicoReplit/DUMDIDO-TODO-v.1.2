import './DeleteConfirmationModal.css';

function DeleteConfirmationModal({ todo, onClose, onDeleteOne, onDeleteAll }) {
  if (!todo) return null;

  const isRecurring = todo.recurrence_type && todo.recurrence_type !== 'once';
  const recurrenceLabel = todo.recurrence_type === 'daily' ? 'täglichen' : 
                          todo.recurrence_type === 'weekly' ? 'wöchentlichen' : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Aufgabe löschen?</h2>
        <p className="todo-title-confirm">{todo.title}</p>
        
        {isRecurring ? (
          <>
            <p className="confirmation-text">
              Diese Aufgabe wiederholt sich {recurrenceLabel}. Was möchtest du löschen?
            </p>
            <div className="button-group">
              <button 
                className="confirm-btn delete-one-btn"
                onClick={onDeleteOne}
              >
                Nur diese eine
              </button>
              <button 
                className="confirm-btn delete-all-btn"
                onClick={onDeleteAll}
              >
                Alle {recurrenceLabel} Aufgaben
              </button>
              <button 
                className="cancel-btn"
                onClick={onClose}
              >
                Abbrechen
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="confirmation-text">
              Möchtest du diese Aufgabe wirklich löschen?
            </p>
            <div className="button-group">
              <button 
                className="confirm-btn delete-one-btn"
                onClick={onDeleteOne}
              >
                Löschen
              </button>
              <button 
                className="cancel-btn"
                onClick={onClose}
              >
                Abbrechen
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
