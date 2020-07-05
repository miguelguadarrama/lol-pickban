import React, { useState, useEffect } from 'react'
import ChampionIcon from './champion-icon'
import SideStats from './sidestats'
import './styles.css'

const order = [
    "bb1", "br1", "bb2", "br2", "bb3", "br3",
    "b1", "r1", "r2", "b2", "b3", "r3",
    "br4", "bb4", "br5", "bb5",
    "r4", "b4", "b5", "r5"
]

const Home = props => {

    const [error, setError] = useState(false);
    const [version, setVersion] = useState(null)
    const [champions, setChampions] = useState(null)
    const [selection, setSelection] = useState([])
    const [current, setCurrent] = useState(0)
    const [filter, setFilter] = useState("")
    const [stats, setStats] = useState([])
    const [globalStats, setGlobalStats] = useState({})

    useEffect(() => {
        //check version
        fetch("https://ddragon.leagueoflegends.com/realms/na.json")
            .then(res => res.json())
            .then(data => {
                console.log({ data });
                if (data.v) {
                    setVersion(data.v)
                }
            })
            .catch(err => {
                console.error(err)
                setError(true)
            })
    }, [])

    useEffect(() => {
        console.log({ version })
        if (version) {
            let champions = localStorage.getItem("lol_champions") && JSON.parse(localStorage.getItem("lol_champions"))
            if (!champions) {
                fetch(`http://ddragon.leagueoflegends.com/cdn/10.8.1/data/en_US/champion.json`)
                    .then(res => res.json())
                    .then(champions => {
                        console.log({ champions })
                        if (champions && champions.data) {
                            let array = Object.keys(champions.data).map(key => champions.data[key])
                            setChampions(array)
                            localStorage.setItem("lol_champions", JSON.stringify(array))
                        }
                    })
            } else setChampions(champions)
        }
    }, [version])

    useEffect(() => {
        if (champions) {
            setStats(Object.keys(champions[0].stats).map(k => k))
        }
    }, [champions])

    const isSelected = (champion) => {
        return selection.filter(k => k.champion.key === champion.key).length
    }

    const reset = () => {
        setSelection([])
        setCurrent(0)
    }

    const rollback = () => {
        setSelection(sel => sel.slice(0, sel.length - 1))
        setCurrent(cur => cur > 0 ? --cur : cur)
    }

    const selectChampion = (champion) => {
        if (selection.length === order.length || isSelected(champion)) {
            return false;
        }
        setSelection(items => items.concat({
            pos: order[current],
            champion
        }))
        setCurrent(order => ++order)
        setFilter("");
    }

    const setGStats = (side, values) => {
        setGlobalStats(sides => { sides[side] = values; return sides })
    }

    if (error) {
        return <p>Error</p>
    }

    if (!version) {
        return <p>Getting version...</p>
    }

    return champions ? (
        <React.Fragment>
            <section className="section">
                <p>A total of {champions ? champions.length : "-"} champions.</p>
            </section>
            <section className="section">
                <p>Currently picking: {order[current]}</p>
                <div className="field">
                    <button type="button" onClick={rollback} className="button is-small">rollback</button>
                    {' '}
                    <button type="button" onClick={reset} className="button is-small is-danger">reset</button>
                </div>
                <div className="columns">
                    <div className="column">
                        <div className="bans">
                            <h4>Bans</h4>
                            <ul className="inline-list">
                                {selection.filter(k => k.pos.length === 3).map(item => (
                                    <ChampionIcon pos={item.pos} isBan key={item.pos} selectChampion={selectChampion} champion={item.champion} />
                                ))}
                            </ul>
                            <hr />
                        </div>
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-3">
                        <ul className="selection-side mb-4">
                            {selection.filter(k => k.pos.length === 2 && k.pos.startsWith('b')).map(item => (
                                <ChampionIcon key={item.pos} pos={item.pos} selectChampion={selectChampion} champion={item.champion} />
                            ))}
                        </ul>
                        <SideStats side="b" compare="r" globalStats={globalStats}  setGStats={setGStats} stats={stats} champions={selection.filter(k => k.pos.length === 2 && k.pos.startsWith('b'))} />
                    </div>
                    <div className="column">
                        <div className="field">
                            <div className="control">
                                <input type="text" className="input" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Seach champions..." />
                            </div>
                        </div>
                        <ul className="inline-list pool">
                            {champions.filter(k => !filter || k.name.toLowerCase().indexOf(filter.toLowerCase()) > -1).map(champion => (
                                <ChampionIcon key={champion.key} selectChampion={selectChampion} isSelected={isSelected(champion)} champion={champion} />
                            ))}
                        </ul>
                    </div>
                    <div className="column is-3">
                        <ul className="selection-side mb-4">
                            {selection.filter(k => k.pos.length === 2 && k.pos.startsWith('r')).map(item => (
                                <React.Fragment key={item.pos}>
                                    <ChampionIcon key={item.pos} pos={item.pos} selectChampion={selectChampion} champion={item.champion} />
                                </React.Fragment>
                            ))}
                        </ul>
                        <SideStats side="r" compare="b" globalStats={globalStats} setGStats={setGStats} stats={stats} champions={selection.filter(k => k.pos.length === 2 && k.pos.startsWith('r'))} />
                    </div>
                </div>
            </section>
        </React.Fragment >
    ) : <p>Loading champions...</p>
}

export default Home