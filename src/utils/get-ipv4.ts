import os, { NetworkInterfaceInfo } from "os";

// 获取本地 IPv4 地址
const getLocalIPv4Address = (): string | undefined => {
  const interfaces = os.networkInterfaces();

  for (const key in interfaces) {
    const iface: NetworkInterfaceInfo[] | undefined = interfaces[key];

    if (!iface) return undefined;
    for (let i = 0; i < iface.length; i++) {
      const { address, family, internal } = iface[i];
      if (family === "IPv4" && !internal) {
        return address;
      }
    }
  }
  return undefined;
};

export default getLocalIPv4Address;
