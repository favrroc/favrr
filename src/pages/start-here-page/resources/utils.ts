export const handleOpacity = (wordIndex: number, rowIndex: number, scrollPosition: number) => {
  const rowTop = rowIndex * 5; // Assuming each row is 5px tall
  const rowBottom = (rowIndex + 1) * 5;
  const rowOpacity = (scrollPosition - rowTop) / (rowBottom - rowTop);

  if (rowOpacity < 0) {
    return 0.25;
  } else if (rowOpacity > 1) {
    return 1;
  } else {
    const wordLeft = wordIndex * 20; // Assuming each word is 20px wide
    const wordRight = (wordIndex + 1) * 20;
    const wordOpacity = (scrollPosition - wordLeft) / (wordRight - wordLeft);
    return Math.max(0.25, Math.min(wordOpacity, rowOpacity));
  }
};