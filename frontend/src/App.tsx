import { useState } from 'react';
import Login from './components/Login';
import SignUp from './components/SignUp';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'signup'>('login');

  return (
    <div className="App">
      {currentView === 'login' ? (
        <Login onSwitchToSignUp={() => setCurrentView('signup')} />
      ) : (
        <SignUp onSwitchToLogin={() => setCurrentView('login')} />
      )}
    </div>
  );
}

export default App;
