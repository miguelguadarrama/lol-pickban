import React from 'react'

const sprite_champion = 'http://ddragon.leagueoflegends.com/cdn/10.8.1/img/sprite/'

const ChampionIcon = props => {

    const { champion, pos, isBan, isSelected, selectChampion } = props

    return (
        <li className={isSelected || isBan || pos ? "selected" : ""}
            onClick={e => selectChampion(champion)}
            key={champion.id}
            title={champion.name}
            style={{
                backgroundImage: `url(${sprite_champion + champion.image.sprite})`,
                backgroundPositionX: -champion.image.x,
                backgroundPositionY: -champion.image.y,
                width: champion.image.w,
                height: champion.image.h,
                float: isBan && pos.indexOf("r") > -1 ? "right" : "none"
            }}
        >
            {!isBan && pos && (
                <p style={{ marginLeft: 50 }}><small>{champion.name}</small></p>
            )}
        </li>
    )
}

export default ChampionIcon