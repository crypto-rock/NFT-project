import React from 'react';
const Home = () => { 
	return (
        <div style={{position:'fixed', left:0, right:0, top:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'black', color: 'white'}}>
            <div style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
                <img src="/logo.svg" alt="logo" width={200} height={200} />
                <h1 style={{fontSize:'3em'}}>COMING SOON</h1>
            </div>
        </div>
    )
};

export default Home;