import config from './config/config.json';
import App from './src/app';

const app = new App(config);
app.start();
