import React from 'react'

export default ({level,onChange}) => {
  return (
    <div>
      <select onChange={e => onChange(e)} value={level}>
          <option value={'EASY'}>EASY</option>
          <option value={'MEDIUM'}>MEDIUM</option>
          <option value={'HARD'}>HARD</option>
        </select>
    </div>
  )
}
