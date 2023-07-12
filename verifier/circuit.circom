pragma circom 2.0.0;

template Multiply(){
    signal input in0;
    signal input in1;
    signal output out;

    out <== in0 * in1;
}

component main {public [in0]} = Multiply();