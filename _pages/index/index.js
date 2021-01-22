import { graphql } from "relay-hooks";

export default function Index() {
  return "Index";
}

export const indexQuery = graphql`
  query indexQuery {
    contract(id: 0) {
      id
    }
  }
`;
