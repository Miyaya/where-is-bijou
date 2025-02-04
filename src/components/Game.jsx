import { useCallback, useEffect, useState } from 'react'
import { Board } from './Board'
import { Modal } from './Modal'
import { difficuties } from '../data'

export const Game = () => {
    const [levelInfo, setLevelInfo] = useState(difficuties.medium)

    const [remainingMines, setRemainingMines] = useState(difficuties.medium.mines)
    const [gameStatus, setGameStatus] = useState('preparing')
    const [startTime, setStartTime] = useState(null)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [resetKey, setResetKey] = useState(0)

    const handleDifficultyChange = (e) => {
        console.log(difficuties[e.target.value])
        setLevelInfo(difficuties[e.target.value])
    }

    const updateGameStatus = useCallback(unrevealedCount => {
        if (unrevealedCount === remainingMines) {
            setGameStatus('won')
        }
    }, [remainingMines])

    useEffect(() => {
        switch (levelInfo.id) {
            case 'easy':
                setLevelInfo(difficuties.easy)
                break;
            case 'hard':
                setLevelInfo(difficuties.hard)
                break;
            default:
                setLevelInfo(difficuties.medium)
                break;
        }

        setRemainingMines(levelInfo.mines)
        setGameStatus('preparing')
        setStartTime(null)
        setElapsedTime(0)
        setResetKey(prevKey => prevKey + 1)
    }, [levelInfo])

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

    const handleBoardClick = useCallback((clickType, neighborMine) => {
        if (clickType === 'left') {
            if (gameStatus === 'preparing') {
                setGameStatus('playing')
                setStartTime(Date.now())
            }
            if (neighborMine === '*') {
                setGameStatus('lost')
            }
        }
    }, [gameStatus])

    const restart = () => {
        setGameStatus('preparing')
        setStartTime(null)
        setElapsedTime(0)
        setResetKey(prevKey => prevKey + 1)
    }

    return (
        <>
            <div className="container my-10 mx-auto py-8 max-w-4xl border border-pink-400">
                <label className="flex flex-row justify-center">
                    Difficulty&nbsp;
                    <select name="difficulty" value={levelInfo.id} onChange={handleDifficultyChange}>
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
                    rows={levelInfo.rows}
                    cols={levelInfo.cols}
                    mines={levelInfo.mines}
                    setRemainingMines={setRemainingMines}
                    gameStatus={gameStatus}
                    updateGameStatus={updateGameStatus}
                    handleBoardClick={handleBoardClick} />

                {(gameStatus === 'won' || gameStatus === 'lost') && <Modal isWinning={gameStatus === 'won'} restart={restart} />}
            </div>
        </>
    )
}