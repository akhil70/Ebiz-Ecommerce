import toast from 'react-hot-toast';

/**
 * Common confirmation toast for delete actions
 * @param {string} message - The confirmation message to display
 * @param {function} onConfirm - Callback function when user confirms
 */
export const showDeleteConfirmation = (message, onConfirm) => {
    toast((t) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
            <span style={{ fontWeight: 500 }}>{message || 'Are you sure you want to delete this?'}</span>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    style={{
                        background: '#f3f4f6',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px'
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        toast.dismiss(t.id);
                        onConfirm();
                    }}
                    style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600
                    }}
                >
                    Delete
                </button>
            </div>
        </div>
    ), {
        duration: 5000,
        position: 'top-center',
        style: {
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }
    });
};

/**
 * Common confirmation toast for status change actions
 * @param {string} message - The confirmation message to display
 * @param {function} onConfirm - Callback function when user confirms
 */
export const showStatusConfirmation = (message, onConfirm) => {
    toast((t) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
            <span style={{ fontWeight: 500 }}>{message}</span>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    style={{
                        background: '#f3f4f6',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px'
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        toast.dismiss(t.id);
                        onConfirm();
                    }}
                    style={{
                        background: '#4f46e5',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600
                    }}
                >
                    Confirm
                </button>
            </div>
        </div>
    ), {
        duration: 5000,
        position: 'top-center'
    });
};
