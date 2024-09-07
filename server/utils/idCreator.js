const idFieldCreator = async (word, modal, idName) => {
  try {
    const modalArray = await modal.findOne().sort({ _id: -1 });
    if (!modalArray) {
      return `${word}00001`;
    }
    const lastIdNumber = parseInt(modalArray[idName].slice(1)) + 1;
    const newIdNumber = String(lastIdNumber).padStart(5, "0");
    return Promise.resolve(`${word}${newIdNumber}`);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = idFieldCreator;
