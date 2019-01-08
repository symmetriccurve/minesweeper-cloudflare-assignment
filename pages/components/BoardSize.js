import React from 'react'

export default ({value,onChange}) => {
    let options = []
    for(let i = 0; i<=100;i++){
        options.push(<option key={i} value={i}>{i}</option>)
    }
  return (
    <div>
      <select value={value} onChange={e=>{onChange(e)}}>
          {options}
      </select>
    </div>
  )
}
