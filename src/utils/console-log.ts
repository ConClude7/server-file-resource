const consoleLog = (message?: string, data?: any) => {
  if (message) console.log(`${message}${data ? ":" : ""}`);
  if (data) console.log(JSON.stringify(data, null, 2));
};

export default consoleLog;
