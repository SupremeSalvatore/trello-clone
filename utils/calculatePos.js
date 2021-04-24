export const calculatePos = (beforeItem, afterItem) => {
  if (beforeItem && afterItem) {
    return (beforeItem.pos + afterItem.pos) / 2;
  } else if (!beforeItem) {
    return afterItem?.pos / 2;
  }
  return beforeItem?.pos * 2;
};
