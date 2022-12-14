import { useState } from 'react';

//import Container from 'react-bootstrap/Container';
//import Row from 'react-bootstrap/Row';
//import Col from 'react-bootstrap/Col';
//import Form from 'react-bootstrap/Form';

//import NavBar from './components/NavBar';
import Loading from './components/Loading';
import Error from './components/Error';
import Login from './components/Login';
import UsageReport from './components/UsageReport';
import useAuth from './state/useAuth';

function App() {
  const { isLoading, error, profile, login, logout } = useAuth();
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (user,password) => {
    const success = await login(user,password);
    setLoginError( success ? '' : 'Bad user/password, try again.');
  }

  const handleLogout = async () => {
    await logout();
  }

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;
  if (profile) return <UsageReport onLogout={handleLogout}/>;

  return <Login onLogin={handleLogin} loginError={loginError} />;
}

export default App;
