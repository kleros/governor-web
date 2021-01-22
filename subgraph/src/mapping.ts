import { BigInt } from "@graphprotocol/graph-ts";
import { ListSubmitted } from "../generated/Governor/Governor";
import { Contract } from "../generated/schema";

export function listSubmitted(event: ListSubmitted): void {
  let ID = new BigInt(0);
  let contract = new Contract(ID.toString());
  contract.save();
}
