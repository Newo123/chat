import { useCallback, useEffect, useState } from 'react';

interface ChatProps {
	credentials: {
		idInstance: string;
		apiTokenInstance: string;
	};
}

interface Message {
	type: 'sent' | 'received';
	text: string;
}

export default function Chat({ credentials }: ChatProps) {
	const [phoneNumber, setPhoneNumber] = useState('');
	const [message, setMessage] = useState('');
	const [chat, setChat] = useState<Message[]>([]);

	const sendMessage = async () => {
		try {
			const response = await fetch(
				`https://1103.api.green-api.com/waInstance${credentials.idInstance}/SendMessage/${credentials.apiTokenInstance}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						chatId: `${phoneNumber}@c.us`,
						message: message,
					}),
				}
			);

			if (response.ok) {
				setChat([...chat, { type: 'sent', text: message }]);
				setMessage('');
			} else {
				console.error('Failed to send message');
			}
		} catch (error) {
			console.error('Error sending message:', error);
		}
	};

	const receiveMessages = useCallback(async () => {
		try {
			const response = await fetch(
				`https://1103.api.green-api.com/waInstance${credentials.idInstance}/ReceiveNotification/${credentials.apiTokenInstance}?receiveTimeout=5`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				console.log(data);

				if (
					data &&
					data.body &&
					data.body.messageData &&
					data.body.messageData.textMessageData
				) {
					setChat(prevChat => [
						...prevChat,
						{
							type: 'received',
							text: data.body.messageData.textMessageData.textMessage,
						},
					]);

					await fetch(
						`https://1103.api.green-api.com/waInstance${credentials.idInstance}/DeleteNotification/${credentials.apiTokenInstance}/${data.receiptId}`,
						{
							method: 'DELETE',
						}
					);
				}
			}
		} catch (error) {
			console.error('Error receiving message:', error);
		}
	}, [credentials]);

	useEffect(() => {
		const interval = setInterval(receiveMessages, 5000);
		return () => clearInterval(interval);
	}, [receiveMessages]);

	return (
		<div className='card'>
			<h2>WhatsApp Chat</h2>
			<div className='chat-container'>
				{chat.map((msg, index) => (
					<div key={index} className={`message ${msg.type}`}>
						{msg.text}
					</div>
				))}
			</div>
			<input
				type='text'
				className='input'
				placeholder='Enter phone number'
				value={phoneNumber}
				onChange={e => setPhoneNumber(e.target.value)}
			/>
			<input
				type='text'
				className='input'
				placeholder='Type a message'
				value={message}
				onChange={e => setMessage(e.target.value)}
			/>
			<button onClick={sendMessage} className='button'>
				Send
			</button>
		</div>
	);
}
