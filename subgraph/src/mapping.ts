import { Address, BigInt, ByteArray, crypto } from "@graphprotocol/graph-ts";

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
  ExecuteSubmissionsCall,
  ExecuteTransactionListCall,
  FundAppealCall,
  Governor,
  Ruling,
  SetMetaEvidenceCall,
  SubmitListCall,
  WithdrawFeesAndRewardsCall,
  WithdrawTransactionListCall,
} from "../generated/Governor/Governor";
import {
  Contract,
  Contribution,
  MetaEvidence,
  Round,
  Session,
  Submission,
  Transaction,
} from "../generated/schema";

function concatByteArrays(a: ByteArray, b: ByteArray): ByteArray {
  let out = new Uint8Array(a.length + b.length);
  for (let i = 0; i < a.length; i++) out[i] = a[i];
  for (let j = 0; j < b.length; j++) out[a.length + j] = b[j];
  return out as ByteArray;
}

function getStatus(status: number): string {
  if (status == 0) return "NoDispute";
  if (status == 1) return "DisputeCreated";
  if (status == 2) return "Resolved";
  return "Error";
}

function initializeContract(
  address: Address,
  deployer: Address,
  creationTime: BigInt
): Contract {
  let contract = Contract.load("0");
  if (contract != null) return contract as Contract;
  let governor = Governor.bind(address);

  contract = new Contract("0");
  contract.arbitrator = governor.arbitrator();
  contract.arbitratorExtraData = governor.arbitratorExtraData();
  contract.deployer = deployer;
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
  contract.sessionsLength = BigInt.fromI32(0);
  contract.submissionsLength = BigInt.fromI32(0);
  contract.save();

  newSession(contract as Contract, creationTime);

  return contract as Contract;
}

function newSession(contract: Contract, creationTime: BigInt): Session {
  let session = new Session(contract.sessionsLength.toHexString());
  session.creationTime = creationTime;
  session.submittedLists = [];
  session.sumDeposit = BigInt.fromI32(0);
  session.status = getStatus(0);
  session.durationOffset = BigInt.fromI32(0);
  session.submissionsLength = BigInt.fromI32(0);
  session.roundsLength = BigInt.fromI32(0);
  session.save();

  contract.sessionsLength = contract.sessionsLength.plus(BigInt.fromI32(1));
  contract.save();

  // Something is broken with The Graph's null type guards so we need these explicit casts in some places.
  return session as Session;
}

function newRound(session: Session, creationTime: BigInt): Round {
  let round = new Round(
    crypto
      .keccak256(
        concatByteArrays(
          ByteArray.fromUTF8(session.id),
          ByteArray.fromUTF8(session.roundsLength.toString())
        )
      )
      .toHexString()
  );
  round.creationTime = creationTime;
  round.session = session.id;
  round.paidFees = [];
  round.hasPaid = [];
  round.feeRewards = BigInt.fromI32(0);
  round.successfullyPaid = BigInt.fromI32(0);
  round.contributionsLength = BigInt.fromI32(0);
  round.save();

  session.roundsLength = session.roundsLength.plus(BigInt.fromI32(1));
  session.save();

  return round as Round;
}

function updateContribution(
  governor: Governor,
  sessionID: BigInt,
  roundIndex: BigInt,
  contributor: Address,
  time: BigInt
): Contribution {
  let roundInfo = governor.getRoundInfo(sessionID, roundIndex);
  let contributions = governor.getContributions(
    sessionID,
    roundIndex,
    contributor
  );

  let roundID = crypto.keccak256(
    concatByteArrays(
      ByteArray.fromUTF8(sessionID.toHexString()),
      ByteArray.fromUTF8(roundIndex.toString())
    )
  );
  let round = Round.load(roundID.toHexString());
  round.paidFees = roundInfo.value0;
  round.hasPaid = roundInfo.value1;
  round.feeRewards = roundInfo.value2;
  round.successfullyPaid = roundInfo.value3;
  round.save();

  let contributionID = crypto
    .keccak256(concatByteArrays(roundID, contributor))
    .toHexString();
  let contribution = Contribution.load(contributionID);
  if (contribution == null) {
    contribution = new Contribution(contributionID);
    contribution.creationTime = time;
    contribution.round = round.id;
    contribution.contributor = contributor;
  }
  contribution.values = contributions;
  contribution.save();

  return contribution as Contribution;
}

export function setMetaEvidence(call: SetMetaEvidenceCall): void {
  let contract = initializeContract(call.to, call.from, call.block.timestamp);

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
  let contract = initializeContract(call.to, call.from, call.block.timestamp);
  contract.submissionBaseDeposit = call.inputs._submissionBaseDeposit;
  contract.save();
}

export function changeSubmissionTimeout(
  call: ChangeSubmissionTimeoutCall
): void {
  let contract = initializeContract(call.to, call.from, call.block.timestamp);
  contract.submissionTimeout = call.inputs._submissionTimeout;
  contract.save();
}

export function changeExecutionTimeout(call: ChangeExecutionTimeoutCall): void {
  let contract = initializeContract(call.to, call.from, call.block.timestamp);
  contract.executionTimeout = call.inputs._executionTimeout;
  contract.save();
}

export function changeWithdrawTimeout(call: ChangeWithdrawTimeoutCall): void {
  let contract = initializeContract(call.to, call.from, call.block.timestamp);
  contract.withdrawTimeout = call.inputs._withdrawTimeout;
  contract.save();
}

export function changeSharedMultiplier(call: ChangeSharedMultiplierCall): void {
  let contract = initializeContract(call.to, call.from, call.block.timestamp);
  contract.sharedMultiplier = call.inputs._sharedMultiplier;
  contract.save();
}

export function changeWinnerMultiplier(call: ChangeWinnerMultiplierCall): void {
  let contract = initializeContract(call.to, call.from, call.block.timestamp);
  contract.winnerMultiplier = call.inputs._winnerMultiplier;
  contract.save();
}

export function changeLoserMultiplier(call: ChangeLoserMultiplierCall): void {
  let contract = initializeContract(call.to, call.from, call.block.timestamp);
  contract.loserMultiplier = call.inputs._loserMultiplier;
  contract.save();
}

export function changeArbitrator(call: ChangeArbitratorCall): void {
  let contract = initializeContract(call.to, call.from, call.block.timestamp);
  contract.arbitrator = call.inputs._arbitrator;
  contract.arbitratorExtraData = call.inputs._arbitratorExtraData;
  contract.save();
}

export function changeMetaEvidence(call: ChangeMetaEvidenceCall): void {
  let contract = initializeContract(call.to, call.from, call.block.timestamp);

  let metaEvidence = new MetaEvidence(
    contract.metaEvidenceUpdates.toHexString()
  );
  metaEvidence.URI = call.inputs._metaEvidence;
  metaEvidence.save();

  contract.metaEvidence = metaEvidence.id;
  contract.save();
}

export function submitList(call: SubmitListCall): void {
  let governor = Governor.bind(call.to);
  let contract = initializeContract(call.to, call.from, call.block.timestamp);

  let sessionID = contract.sessionsLength.minus(BigInt.fromI32(1));
  let submission = new Submission(contract.submissionsLength.toHexString());
  let _submission = governor.submissions(contract.submissionsLength);
  submission.creationTime = call.block.timestamp;
  submission.session = sessionID.toHexString();
  submission.submitter = _submission.value0;
  submission.deposit = _submission.value1;
  submission.listHash = _submission.value2;
  submission.approved = _submission.value4;
  submission.withdrawn = false;
  submission.transactionsLength = BigInt.fromI32(call.inputs._target.length);
  submission.save();

  for (let i = 0; i < call.inputs._target.length; i++) {
    let transaction = new Transaction(
      concatByteArrays(
        crypto.keccak256(ByteArray.fromUTF8(submission.id)),
        ByteArray.fromUTF8(i.toString())
      ).toHexString()
    );
    let _transaction = governor.getTransactionInfo(
      contract.submissionsLength,
      BigInt.fromI32(i)
    );
    transaction.creationTime = call.block.timestamp;
    transaction.submission = submission.id;
    transaction.target = _transaction.value0;
    transaction.value = _transaction.value1;
    transaction.data = _transaction.value2;
    transaction.executed = _transaction.value3;
    transaction.save();
  }

  contract.reservedETH = governor.reservedETH();
  contract.submissionsLength = contract.submissionsLength.plus(
    BigInt.fromI32(1)
  );
  contract.save();

  let session = Session.load(submission.session);
  session.submittedLists = governor.getSubmittedLists(sessionID);
  session.sumDeposit = session.sumDeposit.plus(submission.deposit);
  session.submissionsLength = session.submissionsLength.plus(BigInt.fromI32(1));
  if (session.submissionsLength.equals(BigInt.fromI32(1)))
    session.durationOffset = call.block.timestamp.minus(
      contract.lastApprovalTime
    );
  session.save();
}

export function withdrawTransactionList(
  call: WithdrawTransactionListCall
): void {
  let governor = Governor.bind(call.to);
  let contract = initializeContract(call.to, call.from, call.block.timestamp);
  contract.reservedETH = governor.reservedETH();
  contract.save();

  let sessionID = contract.sessionsLength.minus(BigInt.fromI32(1));
  let session = Session.load(sessionID.toHexString());

  let submittedLists = session.submittedLists;
  let submission = Submission.load(
    submittedLists[call.inputs._submissionID.toI32()].toHexString()
  );
  submission.withdrawn = true;
  submission.save();

  session.submittedLists = governor.getSubmittedLists(sessionID);
  session.sumDeposit = session.sumDeposit.minus(submission.deposit);
  session.save();
}

export function executeSubmissions(call: ExecuteSubmissionsCall): void {
  let governor = Governor.bind(call.to);
  let contract = initializeContract(call.to, call.from, call.block.timestamp);

  let sessionID = contract.sessionsLength.minus(BigInt.fromI32(1));
  let session = Session.load(sessionID.toHexString());
  if (session.submissionsLength.equals(BigInt.fromI32(0))) {
    contract.lastApprovalTime = call.block.timestamp;
    contract.save();

    session.status = getStatus(2);
    session.save();

    newSession(contract as Contract, call.block.timestamp);
  } else if (session.submissionsLength.equals(BigInt.fromI32(1))) {
    contract.reservedETH = governor.reservedETH();
    contract.lastApprovalTime = call.block.timestamp;
    contract.save();

    session.sumDeposit = BigInt.fromI32(0);
    session.status = getStatus(2);
    session.save();

    let submission = Submission.load(
      contract.submissionsLength.minus(BigInt.fromI32(1)).toHexString()
    );
    submission.approved = true;
    submission.approvalTime = call.block.timestamp;
    submission.save();

    newSession(contract as Contract, call.block.timestamp);
  } else {
    contract.reservedETH = governor.reservedETH();
    contract.save();

    let _session = governor.sessions(sessionID);
    session.disputeID = _session.value1;
    session.sumDeposit = _session.value2;
    session.status = getStatus(0);
    session.save();

    newRound(session as Session, call.block.timestamp);
  }
}

export function fundAppeal(call: FundAppealCall): void {
  let governor = Governor.bind(call.to);
  let contract = initializeContract(call.to, call.from, call.block.timestamp);

  let sessionID = contract.sessionsLength.minus(BigInt.fromI32(1));
  let session = Session.load(sessionID.toHexString());
  updateContribution(
    governor,
    sessionID,
    session.roundsLength.minus(BigInt.fromI32(1)),
    call.from,
    call.block.timestamp
  );

  contract.reservedETH = governor.reservedETH();
  contract.shadowWinner = governor.shadowWinner().toHexString();
  contract.save();

  let sessionRoundsNumber = governor.getSessionRoundsNumber(sessionID);
  if (sessionRoundsNumber.gt(session.roundsLength))
    newRound(session as Session, call.block.timestamp);
}

export function withdrawFeesAndRewards(call: WithdrawFeesAndRewardsCall): void {
  let governor = Governor.bind(call.to);
  let contract = initializeContract(call.to, call.from, call.block.timestamp);

  updateContribution(
    governor,
    call.inputs._session,
    call.inputs._round,
    call.inputs._beneficiary,
    call.block.timestamp
  );

  contract.reservedETH = governor.reservedETH();
  contract.save();
}

export function ruling(event: Ruling): void {
  let governor = Governor.bind(event.address);
  let contract = initializeContract(
    event.transaction.to as Address,
    event.transaction.from,
    event.block.timestamp
  );

  let session = Session.load(
    contract.sessionsLength.minus(BigInt.fromI32(1)).toHexString()
  );

  if (event.params._ruling.notEqual(BigInt.fromI32(0))) {
    let submittedLists = session.submittedLists;
    let submission = Submission.load(
      submittedLists[event.params._ruling.toI32()].toHexString()
    );
    submission.approved = true;
    submission.approvalTime = event.block.timestamp;
    submission.save();
  }

  contract.reservedETH = governor.reservedETH();
  contract.lastApprovalTime = event.block.timestamp;
  contract.shadowWinner = governor.shadowWinner().toHexString();
  contract.save();

  session.ruling = event.params._ruling;
  session.sumDeposit = BigInt.fromI32(0);
  session.status = getStatus(2);
  session.save();

  newSession(contract, event.block.timestamp);
}

export function executeTransactionList(call: ExecuteTransactionListCall): void {
  let governor = Governor.bind(call.to);

  let submission = Submission.load(call.inputs._listID.toHexString());
  for (let i = 0; i < submission.transactionsLength.toI32(); i++) {
    let transaction = Transaction.load(
      concatByteArrays(
        crypto.keccak256(ByteArray.fromUTF8(submission.id)),
        ByteArray.fromUTF8(i.toString())
      ).toHexString()
    );
    let _transaction = governor.getTransactionInfo(
      call.inputs._listID,
      BigInt.fromI32(i)
    );
    transaction.executed = _transaction.value3;
    transaction.save();
  }
}
