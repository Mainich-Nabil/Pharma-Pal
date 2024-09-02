import logo from './logo.svg';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Main from './main';
import Sign_Up from './SignUp';
import Login from './Login';
import ChatApp from './Bot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element = {<Main/>}/>
        <Route path="/Sign_Up" element = {<Sign_Up/>}/>
        <Route path='/Login' element = {<Login/>}/>
        <Route path='/Chat' element = {<ChatApp/>}/>
        <Route/>
        <Route/>
      </Routes>
    </Router>
  );
}

export default App;
