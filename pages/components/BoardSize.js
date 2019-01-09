import React from 'react'

export default ({ value, onChange }) => {
	let options = []
	for (let i = 2; i <= 100; i++) {
		options.push(<option key={i} value={i}>{i}</option>)
	}
	return (
		<div>
			<select value={value} onChange={e => { onChange(e) }} style={{ margin: '5px' }}>
				{options}
			</select>
		</div>
	)
}
