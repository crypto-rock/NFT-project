import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './Pages/Home';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={Home}></Route>
				<Route path="*" component={Home}></Route>
			</Switch>
			<ToastContainer />
		</BrowserRouter>
	);
}

export default App;
