function execShellCommand(cmd) {
  const exec = require("child_process").exec;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

const generateWitness = async (location) => {
  await execShellCommand(`circom ${location} --r1cs --wasm`);
  await execShellCommand(`snarkjs powersoftau new bn128 12 tmp.ptau`);
  await execShellCommand(
    `snarkjs powersoftau prepare phase2 tmp.ptau circuit.ptau`
  );
  await execShellCommand(`rm tmp.ptau`);
  await execShellCommand(
    `snarkjs groth16 setup circuit.r1cs circuit.ptau circuit.pk`
  );

  await execShellCommand(
    `node circuit_js/generate_witness.js circuit_js/circuit.wasm circuit.input.json circuit.wtns`
  );
};

const generateProof = async () => {
  await execShellCommand(
    `snarkjs groth16 prove circuit.pk circuit.wtns circuit.pf.json circuit.inst.json`
  );
};

const main = async () => {
  await generateWitness("circuit.circom");
  await generateProof();

  console.log("Success");
};

main().catch((err) => console.log(err));

