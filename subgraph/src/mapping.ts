import { ByteArray } from "@graphprotocol/graph-ts";

import { Governor, SetMetaEvidenceCall } from "../generated/Governor/Governor";
import { Contract, MetaEvidence } from "../generated/schema";

function getStatus(status: number): string {
  if (status == 0) return "NoDispute";
  if (status == 1) return "DisputeCreated";
  if (status == 2) return "Resolved";
  return "Error";
}

function concatByteArrays(a: ByteArray, b: ByteArray): ByteArray {
  let out = new Uint8Array(a.length + b.length);
  for (let i = 0; i < a.length; i++) out[i] = a[i];
  for (let j = 0; j < b.length; j++) out[a.length + j] = b[j];
  return out as ByteArray;
}

export function setMetaEvidence(call: SetMetaEvidenceCall): void {
  let governor = Governor.bind(call.to);

  let contract = new Contract("0");
  contract.deployer = call.from;
  contract.reservedETH = governor.reservedETH();
  contract.submissionBaseDeposit = governor.submissionBaseDeposit();
  contract.submissionTimeout = governor.submissionTimeout();
  contract.executionTimeout = governor.executionTimeout();
  contract.withdrawTimeout = governor.withdrawTimeout();
  contract.sharedMultiplier = governor.sharedMultiplier();
  contract.winnerMultiplier = governor.winnerMultiplier();
  contract.loserMultiplier = governor.loserMultiplier();
  contract.lastApprovalTime = governor.lastApprovalTime();
  contract.metaEvidenceUpdates = governor.metaEvidenceUpdates();

  let metaEvidence = new MetaEvidence(
    contract.metaEvidenceUpdates.toHexString()
  );
  metaEvidence.URI = call.inputs._metaEvidence;
  metaEvidence.save();

  contract.metaEvidence = metaEvidence.id;
  contract.save();
}
