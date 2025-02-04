import PropTypes from "prop-types"

export const Modal = ({ isWinning, restart }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <div className="mb-4">
                    {isWinning && <img src="/you_win.jpg" width="600px" />}
                    {!isWinning && <img src="/you_lost.jpg" width="600px" />}
                </div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={restart}
                >
                    Restart
                </button>
            </div>
        </div>
    )
}

Modal.propTypes = {
    isWinning: PropTypes.bool.isRequired,
    restart: PropTypes.func.isRequired
}