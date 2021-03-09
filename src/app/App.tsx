import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Navbar from '../components/navbar/Navbar'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Login from '../pages/Login';
import AddPost from '../pages/AddPost';
import AddUser from '../pages/SignUp';
import Home from '../pages/Home'
import UserProfile from '../pages/UserProfile';
import { retrieveUser } from '../pages/userSlice';
import Topics from '../pages/Topics';



function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
    if (storedUser) {

      dispatch(retrieveUser({ email: storedUser}))   
    }
  },[])
  return (
    <Router>
      <div>
        <Navbar />
        <div className="mt-20">
          
        </div>
        <Switch>
          
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/topics">
            <Topics />
          </Route>
          <Route exact path="/login">
            <Login/>
          </Route>
          <Route exact path="/addPost">
            <AddPost />
          </Route>
          <Route exact path="/registration">
            <AddUser />
          </Route>
          <Route exact path="/profile">
            <UserProfile />
          </Route>
          
        </Switch>
        
      </div>

    </Router>
  );
}

export default App;
