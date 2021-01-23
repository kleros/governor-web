import { Address, ByteArray } from "@graphprotocol/graph-ts";

import {
  ChangeArbitratorCall,
  ChangeExecutionTimeoutCall,
  ChangeLoserMultiplierCall,
  ChangeMetaEvidenceCall,
  ChangeSharedMultiplierCall,
  ChangeSubmissionDepositCall,
  ChangeSubmissionTimeoutCall,
  ChangeWinnerMultiplierCall,
  ChangeWithdrawTimeoutCall,
  Governor,
  SetMetaEvidenceCall,
} from "../generated/Governor/Governor";
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

function initializeContract(address: Address, deployer: Address): Contract {
  let contract = Contract.load("0");
  if (contract != null) return contract as Contract;
  let governor = Governor.bind(address);

  contract = new Contract("0");
  contract.arbitrator = governor.arbitrator();
  contract.arbitratorExtraData = governor.arbitratorExtraData();
  contract.deployer = contract.deployer || deployer;
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
  contract.metaEvidence = contract.metaEvidenceUpdates.toHexString();
  contract.save();

  return contract as Contract;
}

export function setMetaEvidence(call: SetMetaEvidenceCall): void {
  let contract = initializeContract(call.to, call.from);

  let metaEvidence = new MetaEvidence(
    contract.metaEvidenceUpdates.toHexString()
  );
  metaEvidence.URI = call.inputs._metaEvidence;
  metaEvidence.save();

  contract.metaEvidence = metaEvidence.id;
  contract.save();
}

export function changeSubmissionDeposit(
  call: ChangeSubmissionDepositCall
): void {
  let contract = initializeContract(call.to, call.from);
  contract.submissionBaseDeposit = call.inputs._submissionBaseDeposit;
  contract.save();
}

export function changeSubmissionTimeout(
  call: ChangeSubmissionTimeoutCall
): void {
  let contract = initializeContract(call.to, call.from);
  contract.submissionTimeout = call.inputs._submissionTimeout;
  contract.save();
}

export function changeExecutionTimeout(call: ChangeExecutionTimeoutCall): void {
  let contract = initializeContract(call.to, call.from);
  contract.executionTimeout = call.inputs._executionTimeout;
  contract.save();
}

export function changeWithdrawTimeout(call: ChangeWithdrawTimeoutCall): void {
  let contract = initializeContract(call.to, call.from);
  contract.withdrawTimeout = call.inputs._withdrawTimeout;
  contract.save();
}

export function changeSharedMultiplier(call: ChangeSharedMultiplierCall): void {
  let contract = initializeContract(call.to, call.from);
  contract.sharedMultiplier = call.inputs._sharedMultiplier;
  contract.save();
}

export function changeWinnerMultiplier(call: ChangeWinnerMultiplierCall): void {
  let contract = initializeContract(call.to, call.from);
  contract.winnerMultiplier = call.inputs._winnerMultiplier;
  contract.save();
}

export function changeLoserMultiplier(call: ChangeLoserMultiplierCall): void {
  let contract = initializeContract(call.to, call.from);
  contract.loserMultiplier = call.inputs._loserMultiplier;
  contract.save();
}

export function changeArbitrator(call: ChangeArbitratorCall): void {
  let contract = initializeContract(call.to, call.from);
  contract.arbitrator = call.inputs._arbitrator;
  contract.arbitratorExtraData = call.inputs._arbitratorExtraData;
  contract.save();
}

export function changeMetaEvidence(call: ChangeMetaEvidenceCall): void {
  let contract = initializeContract(call.to, call.from);

  let metaEvidence = new MetaEvidence(
    contract.metaEvidenceUpdates.toHexString()
  );
  metaEvidence.URI = call.inputs._metaEvidence;
  metaEvidence.save();

  contract.metaEvidence = metaEvidence.id;
  contract.save();
}
