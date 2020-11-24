export default {
  // Log data in custom format
  log: (message) => {
    const timestamp = (new Date()).toLocaleString();
    console.log(`[${timestamp}]: ${message}`);
  },
};
