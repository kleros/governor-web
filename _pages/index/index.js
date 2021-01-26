import { Button, Flex, NextLink, useQuery } from "@kleros/components";
import { graphql } from "relay-hooks";

import SessionCard from "./session-card";

export default function Index() {
  const { props } = useQuery();
  return (
    <>
      {props?.contract && props?.sessions?.[0] && (
        <SessionCard contract={props.contract} session={props.sessions[0]} />
      )}
      <Flex sx={{ justifyContent: "flex-end", marginTop: 2 }}>
        <NextLink href="/list/new">
          <Button>New List</Button>
        </NextLink>
      </Flex>
    </>
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
