const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "049ef71bb1de8ac4911aba930def2d70636db50fe67f1314d6e1b729ad57e8a111f8bfcc2b2d8c17fd81d389a6b58050d5fc3222f572e23fd1ca6a4edfc78c0ac1": 100,
  "045e9bcc42adc7bbaeb8625910ae69db0d57a91107a0bcdd0270b2d360579d539537c70fba097734b3adf5d996117260069279e05495defb587f6f5777cd278070": 50,
  "04dabc9b3992c64c861014cb2a429f7888690254a0af3abcd7f88bbc31b16d2e0b5b674838dbb55a7e97aaee39f1601269346322c2a87fd2085981644bde658fd5": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
