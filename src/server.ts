
/**
 * Error Handler. Provides full stack - remove for production
 */
import { Server } from "./app";

new Server().start()
  .then(() => {
    console.log('Server started...');
  })
  .catch((err) => {
    console.error(err);
  });