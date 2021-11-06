import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
	exceptionHandlers: [
		new transports.File({
			filename: `${__dirname}/../logs/exceptions.log`,
			format: format.combine(
				format.timestamp(),
				format.json(),
				format.printf((info) =>
					JSON.stringify({
						level: info.level,
						timestamp: info.timestamp,
						message: info.message,
					})
				)
			),
		}),
	],
	exitOnError: false,
	transports: [
		new transports.File({
			level: 'warn',
			filename: `${__dirname}/../logs/warns.log`,
			format: format.combine(
				format.timestamp(),
				format.json(),
				format.printf((info) =>
					JSON.stringify({
						level: info.level,
						timestamp: info.timestamp,
						message: info.message,
					})
				)
			),
		}),
		new transports.File({
			level: 'error',
			filename: `${__dirname}/../logs/errors.log`,
			format: format.combine(
				format.timestamp(),
				format.json(),
				format.printf((info) =>
					JSON.stringify({
						level: info.level,
						timestamp: info.timestamp,
						message: info.message,
					})
				)
			),
		}),
		new transports.File({
			maxsize: 5120000,
			maxFiles: 5,
			filename: `${__dirname}/../logs/combined.log`,
			format: format.combine(
				format.timestamp(),
				format.json(),
				format.ms(),
				format.printf((info) =>
					JSON.stringify({
						level: info.level,
						timestamp: info.timestamp,
						at: info.ms,
						message: info.message,
					})
				)
			),
		}),
		new transports.Console({
			handleExceptions: true,
			level: 'debug',
			format: format.combine(
				format.simple(),
				format.colorize({
					all: true,
					colors: {
						info: 'green',
						error: 'red',
						warn: 'yellow',
					},
				}),
				format.timestamp(),
				format.printf(
					(info) =>
						`[${info.timestamp}] ${info.level}: ${info.message}`
				)
			),
		}),
	],
});

export const PORT = process.env.PORT || 3001;
export const DB_URL_STRING =
	process.env.DB_URI || 'mongodb://localhost:27017/thap-nang-luong';
export const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const DATABASE_INSTANCE_KEY = 'db';

export const {
	MQTT_BROKER = "https://test.mosquitto.org/",
	MQTT_BRAND = "mandevices",
  } = process.env;