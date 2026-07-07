require("dotenv").config();

if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  throw new Error("DATABASE_URL e JWT_SECRET precisam estar configurados.");
}

const app = require("./app");
const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`API LACE disponível na porta ${port}.`);
});
