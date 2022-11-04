import app from './app';
import config from './config';
import { AppDataSource } from './data-source';

const PORT = config.PORT || 8000;

AppDataSource.initialize()
  .then(() => {
    console.log('db connected...');

    app.listen(PORT, () => console.log(`server running on PORT:: 🚀💥> ${PORT}`));
  })
  .catch((_error) => console.log('error connecting db'));
