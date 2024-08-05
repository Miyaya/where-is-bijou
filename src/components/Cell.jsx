import React from 'react'

// cell { state: unknown, revealed, flagged, marked, value: 3 }

export const Cell = ({ neighborMine, status, onClick }) => {

    function handleClick(e) {
        e.preventDefault() // prevent context menu
        if (e.nativeEvent.button === 0) {
            onClick('left')
        } else if (e.nativeEvent.button === 2) {
            onClick('right')
        }
    }

    return (
        <>
            {status === 'revealed' ? (
                neighborMine === '*' ? (
                    <img className="cell bg-transparent py-0 px-0 border border-blue-400 font-mono"
                        src="bijou_face.jpg" width="28.5" />
                ) : (
                    <button className="cell bg-transparent text-blue-700 font-semibold 
                py-0 px-2 border border-blue-400 font-mono">
                        {neighborMine === 0 ? <>&nbsp;</> : neighborMine}
                    </button>
                )
            ) : status === 'flagged' ? (
                <button className="cell bg-transparent text-blue-700 font-semibold 
                py-0 px-0 border border-blue-400 font-mono"
                    onContextMenu={handleClick}>
                    <img src="paw.jpeg" width="25.5" height="27" />
                </button>
            ) : (
                <button className="cell hover:bg-blue-500 bg-blue-100
                 py-0 px-2 border border-blue-400 font-mono"
                    onContextMenu={handleClick}
                    onClick={handleClick}>
                    &nbsp;
                </button>
            )}
        </>
    )
}