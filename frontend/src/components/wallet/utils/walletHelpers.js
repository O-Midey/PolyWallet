export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

export const truncateAddress = (addr) => {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
};
