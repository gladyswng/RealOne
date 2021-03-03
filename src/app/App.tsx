import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Navbar from '../components/navbar/Navbar'
import PostList from '../components/posts/PostList';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Login from '../pages/Login';
import AddPost from '../pages/AddPost';
import AddUser from '../pages/SignUp';
import Home from '../pages/Home'
import UserProfile from '../pages/UserProfile';
import { retrieveUser } from '../pages/userSlice';



function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
    if (storedUser) {
      console.log(storedUser)
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
          <Route exact path="/">
            <PostList />
          </Route>
          <Route exact path="/home">
            <Home />
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
