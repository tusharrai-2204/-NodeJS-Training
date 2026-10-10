import 'dotenv/config';
import app from './app.js';

const PORT = 3000;

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception: ', err.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection: ', reason);
    process.exit(1);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});