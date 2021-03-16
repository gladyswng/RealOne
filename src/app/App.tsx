import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/navbar/Navbar'
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import Login from '../pages/Login';
import AddPost from '../pages/AddPost';
import AddUser from '../pages/SignUp';
import Home from '../pages/Home'
import UserProfile from '../pages/UserProfile';
import { retrieveUser, selectUser } from '../pages/userSlice';
import Topics from '../pages/Topics';
import Message from '../pages/Message';




function App() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
  useEffect(() => {
    if (storedUser) {
      dispatch(retrieveUser({ email: storedUser}))   
    }
  },[])

  let routes 
  
  if (storedUser !== '{}') {
    // TODO - FIX REDIRECTION ISSUE WHEN TOKEN WAS FALSE YET
    
    routes = (
      <Switch>
      <Route exact path="/home">
        <Home />
      </Route>
      <Route exact path="/topics">
        <Topics />
      </Route>
      <Route exact path="/message">
        <Message />
      </Route>
      <Route exact path="/login">
        <Login/>
      </Route>
      <Route exact path="/addPost">
        <AddPost />
      </Route>
      <Route exact path="/profile">
        <UserProfile />
      </Route>
      <Route exact path="/registration">
          <AddUser />
      </Route>
      <Redirect to="/login" />
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/login">
          <Login/>
        </Route>
        <Route exact path="/registration">
          <AddUser />
        </Route>
        <Redirect to="/login"/>
      </Switch>
    )
  }

  

  return (
    <Router>
      <div className="">
        <Navbar />
        <div className="mt-10">
          {routes}
        </div>
        
        
      </div>

    </Router>
  );
}

export default App;
