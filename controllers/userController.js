const sayHi = (req, res) => {
  res.json({message:"hello from node!"});
};

module.exports = { sayHi };
