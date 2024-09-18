// Here we export some useful types and functions for interacting with the Anchor program.
import RingMeasureIDL from "./IDL/ring_measure.json";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import type { RingMeasure } from "./types/ring_measure";

// Re-export the generated IDL and type
export { RingMeasureIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const RING_MEASURE_PROGRAM_ID = new PublicKey(RingMeasureIDL.address);

//This is a helper function to get the Counter Anchor program.
export function getRingInfoProgram(provider) {
  return new Program(RingMeasureIDL as RingMeasure, provider);
}

// This is a helper function to get the program ID for the Journal program depending on the cluster.
export function getRingInfoProgramId(cluster) {
  switch (cluster) {
    case "devnet":
    case "testnet":
    case "mainnet-beta":
    default:
      return RING_MEASURE_PROGRAM_ID;
  }
}
