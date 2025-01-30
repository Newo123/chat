import { useState } from 'react';

interface LoginProps {
	onLogin: (idInstance: string, apiTokenInstance: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
	const [idInstance, setIdInstance] = useState('');
	const [apiTokenInstance, setApiTokenInstance] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onLogin(idInstance, apiTokenInstance);
	};

	return (
		<div className='card'>
			<h2>Login to WhatsApp Clone</h2>
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					className='input'
					placeholder='idInstance'
					value={idInstance}
					onChange={e => setIdInstance(e.target.value)}
					required
				/>
				<input
					type='text'
					className='input'
					placeholder='apiTokenInstance'
					value={apiTokenInstance}
					onChange={e => setApiTokenInstance(e.target.value)}
					required
				/>
				<button type='submit' className='button'>
					Login
				</button>
			</form>
		</div>
	);
}
