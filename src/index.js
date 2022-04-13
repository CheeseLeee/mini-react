//import {parse} from "../recast";
const { parse, print } = require("../recast");
 console.log("???")
// Let's turn this function declaration into a variable declaration.
const code = [
  "function add(a, b) {",
  "  return a +",
  "    // Weird formatting, huh?",
  "    b;",
  "}"
].join("\n");
debugger
// Parse the code using an interface similar to require("esprima").parse.
const ast = parse(code);
console.log(ast)
