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

const verifyProof = async (location) => {
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
    `snarkjs groth16 verify circuit.vk circuit.inst.json circuit.pf.json`
  );
  await execShellCommand(
    `snarkjs zkey export verificationkey circuit.pk circuit.vk`
  );
};

const main = async () => {
  await verifyProof("circuit.circom");

  console.log("Success");
};

main().catch((err) => console.log(err));
