import React from 'react'
import ContentLoader from "react-content-loader"

const Menu = (props : any) => (
	<div style={{width:260}}>
	<ContentLoader 
		rtl
		height={160}
		width={150}
		speed={2}
		primaryColor="#f3f3f3"
		secondaryColor="#dedefa"
		{...props}
	>
		<rect x="5" y="15" rx="5"  ry="5" width="120" height="8" /> 
		<rect x="5" y="40" rx="5"  ry="5" width="120" height="8" /> 
		<rect x="5" y="70" rx="5"  ry="5" width="120" height="8" /> 
		<rect x="5" y="100" rx="5" ry="5" width="120" height="8" /> 
		<rect x="5" y="130" rx="5" ry="5" width="120" height="8" /> 
		<rect x="5" y="160" rx="5" ry="5" width="120" height="8" />
        <rect x="5" y="190" rx="5" ry="5" width="120" height="8" />
        <rect x="5" y="220" rx="5" ry="5" width="120" height="8" />
	</ContentLoader>
	</div>
)

export default Menu
