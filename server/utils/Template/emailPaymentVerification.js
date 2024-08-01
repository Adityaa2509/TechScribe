const paymentCompletionTemplate = (username, plan) => {
	const planDetails = plan === 'Basic'
		? {
			planName: 'Sapphire (Basic)',
			access: 'access to our paid articles and blogs',
			color: '#0d6efd' // Blue
		}
		: {
			planName: 'Emerald (Premium)',
			access: 'access to all our paid and private content, articles, and blogs',
			color: '#6610f2' // Purple
		};

	return `<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF-8">
		<title>Payment Completion</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}
	
			.logo {
				max-width: 200px;
				margin-bottom: 20px;
			}
	
			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}
	
			.cta {
				display: inline-block;
				padding: 10px 20px;
				background-color: #FFD60A;
				color: #000000;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
	
			.highlight {
				font-weight: bold;
				color: ${planDetails.color};
			}
		</style>
	
	</head>
	
	<body>
		<div class="container">
			<div class="message">Welcome to TechScribe, ${username}!</div>
			<div class="body">
				<p>Dear ${username},</p>
				<p>Thank you for your payment and welcome to the TechScribe family!</p>
				<p>We are thrilled to have you as a part of our community. You have successfully subscribed to our <span class="highlight">${planDetails.planName}</span> plan. This plan gives you ${planDetails.access}.</p>
				<p>We are committed to providing you with the best content and services. Stay tuned for the latest updates, articles, and exclusive content.</p>
				<p>If you have any questions or need assistance, please feel free to reach out to us. We are here to help you make the most out of your subscription.</p>
			</div>
			<div class="support">
				If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:info@techScribe.com">info@techScribe.com</a>. We are here to help!
			</div>
		</div>
	</body>
	</html>`;
};

module.exports = paymentCompletionTemplate;
