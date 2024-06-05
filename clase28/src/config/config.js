import dotenv from "dotenv";
import { Command } from "commander";

dotenv.config();
const program = new Command();

program
  .option("-p, --port <number>", "set port", "8080")
  .option("-pm, --persistence <string>", "set persistence", "MEMORY")
  .parse(process.argv);

const { port, persistence } = program.opts();

export const options = {
  server: {
    port,
    persistence,
  },
  mongo: {
    url: process.env.MONGO_URL,
  },
};

// export const options = {
//   server: {
//     port: process.env.PORT,
//     persistence: process.env.PERSISTENCE,
//   },
//   mongo: {
//     url: process.env.MONGO_URL,
//   },
// };