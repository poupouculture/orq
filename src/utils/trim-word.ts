const trimWord = (word: string, maxLength: number = 15) => {
  if (word.length > maxLength) {
    return word.substring(0, maxLength) + "...";
  }
  return word;
};

export default trimWord;
