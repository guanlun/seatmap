import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import SeatContainer from './containers/SeatContainer';
import SeatDesigner from './components/SeatDesigner';
import StudentLogin from './components/StudentLogin';
import StudentPortal from './components/StudentPortal';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className='App'>
                <Switch>
                    <Route path='/classroom' component={SeatContainer} />
                    <Route path='/design/:seatmapId' component={SeatDesigner} />
                    <Route path='/design' component={SeatDesigner} />
                    <Route path='/student' component={StudentPortal} />
                    <Route path='/studentlogin' component={StudentLogin} />
                </Switch>
            </div>
        );
    }
}

export default App;
