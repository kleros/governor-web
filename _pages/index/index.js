import { useQuery } from "@kleros/components";
import { graphql } from "relay-hooks";

import SessionCard from "./session-card";

export default function Index() {
  const { props } = useQuery();
  return (
    <SessionCard contract={props?.contract} session={props?.sessions?.[0]} />
  );
}

export const indexQuery = graphql`
  query indexQuery {
    contract(id: 0) {
      ...sessionCardContract
    }
    sessions(orderBy: creationTime, orderDirection: desc, first: 1) {
      ...sessionCardSession
    }
  }
`;
