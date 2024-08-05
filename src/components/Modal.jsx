import React from 'react'

export const Modal = ({ message, restart }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <div className="mb-4">{message}</div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={restart}
                >
                    Restart
                </button>
            </div>
            {/* <div className="fixed inset-0 bg-gray-500 opacity-50"></div> */}
        </div>
    )
}
