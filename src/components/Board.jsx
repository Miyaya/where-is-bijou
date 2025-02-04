import { useMemo, useState, useCallback, useEffect } from 'react'
import { Cell } from './Cell'
import PropTypes from 'prop-types'

export const Board = ({ rows, cols, mines, setRemainingMines, gameStatus, updateGameStatus, handleBoardClick }) => {
    const generateTable = (totalMines) => {
        const table = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => 0)
        )

        const initStatuses = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => 'unknown'))


        let placedMines = 0
        while (placedMines < totalMines) {
            const row = Math.floor(Math.random() * rows)
            const col = Math.floor(Math.random() * cols)

            if (table[row][col] !== '*') {
                table[row][col] = '*'
                placedMines++
            }
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (table[r][c] === '*')
                    continue

                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (r + i < 0 || r + i >= rows || c + i < 0 || c + j >= cols)
                            continue

                        if (table[r + i][c + j] === '*') {
                            table[r][c]++
                        }
                    }
                }
            }
        }

        return { table, initStatuses }
    }


    const revealCells = useCallback((row, col, statuses, table) => {
        if (row < 0 || row >= rows || col < 0 || col >= cols ||
            table[row][col] === '*' || statuses[row][col] === 'revealed') {
            return
        }

        statuses[row][col] = 'revealed'
        if (table[row][col] === 0) {
            revealCells(row - 1, col - 1, statuses, table)
            revealCells(row - 1, col, statuses, table)
            revealCells(row - 1, col + 1, statuses, table)
            revealCells(row, col - 1, statuses, table)
            revealCells(row, col + 1, statuses, table)
            revealCells(row + 1, col - 1, statuses, table)
            revealCells(row + 1, col, statuses, table)
            revealCells(row + 1, col + 1, statuses, table)
        }
    }, [cols, rows])

    const { table, initStatuses } = useMemo(() => generateTable(mines), [rows, cols, mines])
    const [statuses, setStatuses] = useState(initStatuses)
    const [flagCount, setFlagCount] = useState(0)

    // update statuses when difficulty changes
    useEffect(() => {
        setStatuses(Array.from({ length: rows }, () => Array.from({ length: cols }, () => 'unknown')))
        setFlagCount(0)
    }, [rows, cols, mines])

    // avoid directly change remainingMines in Game during rendering Board
    useEffect(() => {
        setRemainingMines(mines - flagCount)
    }, [flagCount, setRemainingMines])

    // avoid directly update in Game during rendering Board
    useEffect(() => {
        const unrevealedCount = statuses.flat().filter(status => status === 'unknown').length
        updateGameStatus(unrevealedCount)
    }, [statuses, updateGameStatus])

    useEffect(() => {
        if (gameStatus === 'lost') {
            setStatuses(prevStatuses => {
                const newStatuses = prevStatuses.map(rowStatuses => [...rowStatuses])
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        if (table[r][c] === '*') {
                            newStatuses[r][c] = 'revealed'
                        }
                    }
                }
                return newStatuses
            });
        }
    }, [gameStatus, table, rows, cols])

    const handleCellClick = useCallback((row, col, clickType) => {
        if (gameStatus === 'lost' || gameStatus === 'won')
            return

        setStatuses(prevStatuses => {
            const newStatuses = prevStatuses.map(rowStatuses => [...rowStatuses])

            if (clickType === 'right') {
                const currentStatus = newStatuses[row][col]
                let newFlagCount = flagCount

                if (currentStatus === 'flagged') {
                    newStatuses[row][col] = 'unknown'
                    newFlagCount -= 1
                } else {
                    newStatuses[row][col] = 'flagged'
                    newFlagCount += 1
                }

                setFlagCount(newFlagCount)
            } else {
                if (table[row][col] === 0) {
                    revealCells(row, col, newStatuses, table)
                } else {
                    newStatuses[row][col] = 'revealed'
                }
            }
            return newStatuses
        })

        handleBoardClick(clickType, table[row][col])
    }, [revealCells, table, flagCount, handleBoardClick, gameStatus])

    return (
        <>
            {table.map((row, rowIndex) => (
                <div key={rowIndex} className="flex flex-row justify-center">
                    {row.map((cell, colIndex) => (
                        <Cell key={colIndex} neighborMine={cell} status={statuses[rowIndex][colIndex]}
                            onClick={clickType => handleCellClick(rowIndex, colIndex, clickType)} />
                    ))}
                </div>
            ))}
        </>
    )
}

Board.propType = {
    rows: PropTypes.number,
    cols: PropTypes.number,
    mines: PropTypes.number,
    setRemainingMines: PropTypes.number,
    gameStatus: PropTypes.string,
    updateGameStatus: PropTypes.string,
    handleBoardClick: PropTypes.func,
}