import { useState } from 'react';
import Chat from './components/Chat';
import Login from './components/Login';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [credentials, setCredentials] = useState({
		idInstance: '',
		apiTokenInstance: '',
	});

	const handleLogin = (idInstance: string, apiTokenInstance: string) => {
		setCredentials({ idInstance, apiTokenInstance });
		setIsLoggedIn(true);
	};
	return (
		<div className='container'>
			{!isLoggedIn ? (
				<Login onLogin={handleLogin} />
			) : (
				<Chat credentials={credentials} />
			)}
		</div>
	);
}

export default App;
