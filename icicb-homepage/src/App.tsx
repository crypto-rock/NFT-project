import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';


import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './Home'; 


function App() { 
	return (
		<BrowserRouter>
			<Switch> 
				<Route path="*" component={Home}></Route>
			</Switch>
			<ToastContainer />
		</BrowserRouter>
	);
}

export default App;
