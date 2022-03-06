import React from 'react';
import {
    BrowserRouter,
    Switch,
    Route
  } from "react-router-dom";
  import Bridge from '../pages/bridge';

  function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Bridge} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;
