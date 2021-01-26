import {
  Card,
  Flex,
  Link,
  NextLink,
  useQuery,
  useWeb3,
} from "@kleros/components";
import { useState } from "react";
import { graphql } from "relay-hooks";

import AddTXButton from "./add-tx-button";
import TXCard from "./tx-card";

import { LeftArrow } from "icons";

export default function ListWithID() {
  useQuery();
  const { web3 } = useWeb3();
  const [selectedTX, setSelectedTX] = useState();
  const [addedTXs, setAddedTXs] = useState([]);
  return (
    <Flex sx={{ flexDirection: "column", height: "100%" }}>
      <NextLink href="/">
        <Link
          variant="unstyled"
          sx={{
            alignItems: "center",
            color: "primary",
            display: "flex",
            marginBottom: 2,
          }}
        >
          <LeftArrow sx={{ marginRight: 1 }} />
          Return
        </Link>
      </NextLink>
      <Flex sx={{ flex: 1, minHeight: 0 }}>
        <Card
          sx={{ flex: 1, "> div": { height: "100%" } }}
          mainSx={{
            flexDirection: "column",
            justifyContent: "flexStart",
            overflowY: "scroll",
            paddingX: 0,
            paddingY: 1,
          }}
          footer={
            <AddTXButton
              onAdd={(TX) => setAddedTXs((_addedTXs) => [..._addedTXs, TX])}
            />
          }
        >
          {addedTXs.length > 0
            ? addedTXs.map((TX, i) => (
                <TXCard
                  key={i}
                  onClick={() => setSelectedTX(TX)}
                  selectedTX={selectedTX}
                  TX={TX}
                />
              ))
            : "The list is empty, add some transactions."}
        </Card>
        <Flex
          sx={{
            flex: 1,
            flexDirection: "column",
            marginLeft: 2,
          }}
        >
          <Card
            sx={{ marginBottom: 2 }}
            header="Target"
            mainSx={{ justifyContent: "flex-start", padding: 2 }}
          >
            {selectedTX?.title}
          </Card>
          <Card
            sx={{ marginBottom: 2 }}
            header="Value (ETH)"
            mainSx={{ justifyContent: "flex-start", padding: 2 }}
          >
            {selectedTX?.value &&
              String(selectedTX.value) !== "" &&
              web3.utils.fromWei(selectedTX.value)}
          </Card>
          <Card
            sx={{ flex: 1 }}
            header="Data"
            mainSx={{ justifyContent: "flex-start", padding: 2 }}
          >
            {selectedTX?.data}
          </Card>
        </Flex>
      </Flex>
    </Flex>
  );
}

export const IdQuery = graphql`
  query IdQuery {
    contract(id: 0) {
      id
    }
  }
`;
