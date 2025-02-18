import os from 'node:os';

export function getIPForInterface(desiredInterface: 'en0' | 'en1'): string {
  const interfaces = os.networkInterfaces();

  // Look for 'en0' which is typically the Wi-Fi interface on a Mac
  for (const [interfaceName, iface] of Object.entries(interfaces)) {
    if (interfaceName === desiredInterface && iface != null) {
      for (const interfaceInfo of iface) {
        if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
          return interfaceInfo.address;
        }
      }
    }
  }

  throw new Error(
    `Could not find IP address for interface ${desiredInterface}`,
  );
}
