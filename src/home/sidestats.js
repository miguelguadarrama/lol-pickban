import React, { useEffect, useState, useCallback } from 'react'


const SideStats = props => {
    const { champions, stats: oStats, globalStats, setGStats, side, compare } = props

    const [stats, setStats] = useState([])

    useEffect(() => {
        const getChampionStat = (stat, level) => {
            return champions.reduce((acum, obj) => {
                return acum + obj.champion.stats[stat] + (obj.champion.stats[stat + 'perlevel'] ? (obj.champion.stats[stat + 'perlevel'] * level) : 0)
            }, 0).toFixed(2)
        }
        const totalStats = oStats.filter(k => k.indexOf("perlevel") === -1).map(stat => {
            return {
                stat,
                l1: getChampionStat(stat, 1),
                l18: getChampionStat(stat, 18)
            }
        })

        setGStats(side, totalStats)
        setStats(totalStats)
    }, [oStats, side, champions, setGStats])

    console.log(globalStats)

    const CompareTD = useCallback(({ stat: statObj, level }) => {
        if (stats && globalStats && globalStats[side]) {
            console.log({ statObj})
            if (statObj[`l${level}`] > globalStats[compare].filter(k => k.stat === statObj.stat)[0][`l${level}`]) {
                return <td className="has-text-right has-text-white has-background-success">{statObj[`l${level}`]}</td>
            } else if (statObj[`l${level}`] < globalStats[compare].filter(k => k.stat === statObj.stat)[0][`l${level}`]) {
                return <td className="has-text-right has-text-white has-background-danger">{statObj[`l${level}`]}</td>
            }
        }

        return <td className="has-text-right">{statObj[`l${level}`]}</td>
    }, [globalStats, stats, side, compare])

    return (
        <table className="table is-bordered">
            <thead className="has-background-light">
                <tr>
                    <th>Stat</th>
                    <th>L1</th>
                    <th>L18</th>
                </tr>
            </thead>
            <tbody>
                {stats.map(stat => (
                    <tr key={stat.stat}>
                        <td>{stat.stat}</td>
                        <CompareTD stat={stat} level={1} />
                        <CompareTD stat={stat} level={18} />
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default SideStats