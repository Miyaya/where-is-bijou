import React, { useCallback, useEffect, useState } from 'react'
import { Board } from './Board'
import { Modal } from './Modal'

export const Game = () => {
    const [difficulty, setDifficulty] = useState('medium')
    const [rows, setRows] = useState(16)
    const [cols, setCols] = useState(16)
    const [mines, setMines] = useState(40)

    const [remainingMines, setRemainingMines] = useState(40)
    const [gameStatus, setGameStatus] = useState('prepared')
    const [startTime, setStartTime] = useState(null)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [modalMessage, setModalMessage] = useState('')
    const [resetKey, setResetKey] = useState(0)

    const handleDifficultyChange = (e) => {
        setDifficulty(e.target.value)
    }

    const updateGameStatus = useCallback(unrevealedCount => {
        if (unrevealedCount === remainingMines) {
            setGameStatus('won')
        }
    }, [remainingMines])

    useEffect(() => {
        switch (difficulty) {
            case 'easy':
                setRows(9)
                setCols(9)
                setMines(10)
                break;
            case 'hard':
                setRows(16)
                setCols(30)
                setMines(99)
                break;
            default:
                setRows(16)
                setCols(16)
                setMines(40)
                break;
        }

        setRemainingMines(mines)
        setGameStatus('prepared')
        setStartTime(null)
        setElapsedTime(0)
        setResetKey(prevKey => prevKey + 1)
    }, [difficulty])

    useEffect(() => {
        let timer
        if (gameStatus === 'playing') {
            timer = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1)
            }, 1000)
        } else {
            clearInterval(timer)
        }

        return () => clearInterval(timer)
    }, [gameStatus])

    useEffect(() => {
        if (gameStatus === 'won')
            setModalMessage('You won :)')
        else if (gameStatus === 'lost')
            setModalMessage('You lost :(')
    }, [gameStatus])

    const handleBoardClick = useCallback((clickType, neighborMine) => {
        if (clickType === 'left') {
            if (gameStatus === 'prepared') {
                setGameStatus('playing')
                setStartTime(Date.now())
            }
            if (neighborMine === '*') {
                setGameStatus('lost')
            }
        }
    }, [gameStatus])

    const restart = () => {
        setModalMessage('')
        setGameStatus('prepared')
        setStartTime(null)
        setElapsedTime(0)
        setResetKey(prevKey => prevKey + 1)
    }

    return (
        <>
            <div className="container my-10 mx-auto py-8 max-w-4xl border border-pink-400">
                <label className="flex flex-row justify-center">
                    Difficulty&nbsp;
                    <select name="difficulty" value={difficulty} onChange={handleDifficultyChange}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </label>
                <div className="flex flex-row justify-center">
                    <span className="ml-4">Time: {elapsedTime}s</span>
                    <span className="ml-4">Bijoux left: {remainingMines}</span>
                    <span className="ml-4">Status: {gameStatus}</span>
                </div>
                <br />
                <Board key={resetKey}
                    rows={rows}
                    cols={cols}
                    mines={mines}
                    setRemainingMines={setRemainingMines}
                    gameStatus={gameStatus}
                    updateGameStatus={updateGameStatus}
                    handleBoardClick={handleBoardClick} />

                {/* if modalMessage */}
                {modalMessage && <Modal message={modalMessage} restart={restart} />}
            </div>
        </>
    )
}