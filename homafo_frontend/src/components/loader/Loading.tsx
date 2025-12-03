
// @ts-ignore
import React from 'react'
import ContentLoader from 'react-content-loader'
import './Loading.css'

const Loader = () => {
    const random = Math.random() * (1 - 0.7) + 0.7
    return (
        <ContentLoader
            height={350}
            width={222}
            speed={2}

            primaryColor="#f3f3f3"
            secondaryColor="#ecebeb">            
            <rect x="25" y="0" rx="5" ry="5" width={200 * random} height="10" />
            <rect x="25" y="30" rx="5" ry="5" width={200 * random} height="10" />
            <rect x="25" y="70" rx="5" ry="5" width={200 * random} height="10" />
            <rect x="25" y="100" rx="5" ry="5" width={200 * random} height="10" />
            <rect x="25" y="130" rx="5" ry="5" width={200 * random} height="10" />
            <rect x="25" y="160" rx="5" ry="5" width={200 * random} height="10" />
            <rect x="25" y="190" rx="5" ry="5" width={200 * random} height="10" />
            <rect x="25" y="220" rx="5" ry="5" width={200 * random} height="10" />                      
        </ContentLoader>

    )
}
export const LoaderVerify = () => {

    return (<div>
        <br />        
        <br />
        <br />
        <div className="visualizar">
            <div className="sub">
                <Loader />
            </div>
            <div className="sub">
                <Loader />
            </div>
            <div className="sub">
                <Loader />
            </div>
        </div>
    </div>
    );

}

