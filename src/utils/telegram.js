const axios = require('axios');

const sendNotifyToTelegram = async (message) => {
	try {
		const response = await axios.post(`https://api.telegram.org/bot${  process.env.TELEGRAM_TOKEN  }/sendMessage`, {
			chat_id: '-4048541171',
			text: message,
			parse_mode: 'HTML'
		})
		return response;
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
	}
}
module.exports = {sendNotifyToTelegram};