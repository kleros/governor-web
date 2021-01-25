import { Box, Card, Link, Text } from "@kleros/components";
import { graphql, useFragment } from "relay-hooks";

const sessionCardFragments = {
  contract: graphql`
    fragment sessionCardContract on Contract {
      submissionTimeout
      lastApprovalTime
    }
  `,
  session: graphql`
    fragment sessionCardSession on Session {
      durationOffset
    }
  `,
};
export default function SessionCard({ contract, session }) {
  const { lastApprovalTime, submissionTimeout } =
    useFragment(sessionCardFragments.contract, contract) || {};
  const { durationOffset } =
    useFragment(sessionCardFragments.session, session) || {};
  const sessionStart = lastApprovalTime && new Date(lastApprovalTime * 1000);
  const sessionEnd =
    lastApprovalTime &&
    submissionTimeout &&
    durationOffset &&
    new Date(
      (Number(lastApprovalTime) +
        Number(submissionTimeout) +
        Number(durationOffset)) *
        1000
    );
  return (
    <Card
      variant="muted"
      sx={{
        borderTopColor: "primary",
        borderTopStyle: "solid",
        borderTopWidth: 2,
      }}
      mainSx={{
        color: "accent",
        justifyContent: "space-between",
        padding: 1,
      }}
    >
      <Box>
        <Text>
          Governor decisions from{" "}
          <Link newTab href="https://snapshot.page/#/kleros">
            Snapshot.
          </Link>
        </Text>
        <Text>
          <Text as="span" sx={{ fontWeight: "bold" }}>
            Session:
          </Text>{" "}
          Votes approved before{" "}
          <Text as="span">{sessionStart?.toLocaleString()}</Text>
        </Text>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Text>Session ends</Text>
        <Text sx={{ fontWeight: "bold" }}>{sessionEnd?.toLocaleString()}</Text>
      </Box>
    </Card>
  );
}
