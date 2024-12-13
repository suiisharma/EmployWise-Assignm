import { useAuth } from './context/Usercontext';
import UserList from './components/UserList';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";


const App = () => {
  const { token} = useAuth();  

  return (
      <Router>
        <Routes>
          <Route path="/" element={token ? <UserList /> : <Login />} />
        </Routes>
      </Router>
  );
};

export default App;
