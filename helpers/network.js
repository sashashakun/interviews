// @flow

export function normalizePort(val:string):number|string {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  return port;
}
