import {
  ArchonProvider,
  Box,
  Layout,
  Link,
  NextLink,
  RelayProvider,
  SocialIcons,
  Text,
  ThemeProvider,
  Web3Provider,
  AccountSettingsPopup as _AccountSettingsPopup,
  createWrapConnection,
  klerosTheme,
} from "@kleros/components";
import { SecuredByKleros } from "@kleros/icons";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { animated, useTransition } from "react-spring";

import { indexQuery } from "_pages/index";
import Governor from "subgraph/abis/governor";
import { address } from "subgraph/config/kovan";

const queries = {
  "/": indexQuery,
};
const wrapConnection = createWrapConnection(queries, {});
const contracts = [
  {
    name: "governor",
    abi: Governor,
    address: { kovan: address },
  },
];
const settings = {
  governorNotifications: {
    label: "Enable",
    info: "Subscribe to updates.",
  },
};
const parseSettings = (rawSettings) => ({
  ...Object.keys(settings).reduce((acc, setting) => {
    acc[setting] =
      rawSettings?.payload?.settings?.Item?.[setting]?.BOOL || false;
    return acc;
  }, {}),
  email: rawSettings?.payload?.settings?.Item?.email?.S || "",
});
const normalizeSettings = ({ email, ...rest }) => ({
  email: { S: email },
  ...Object.keys(rest).reduce((acc, setting) => {
    acc[setting] = {
      BOOL: rest[setting] || false,
    };
    return acc;
  }, {}),
});
function AccountSettingsPopup() {
  return (
    <_AccountSettingsPopup
      userSettingsURL="https://hgyxlve79a.execute-api.us-east-2.amazonaws.com/production/user-settings"
      settings={settings}
      parseSettings={parseSettings}
      normalizeSettings={normalizeSettings}
    />
  );
}
const header = {
  left: (
    <NextLink href="/">
      <Link variant="unstyled" sx={{ marginLeft: 1 }}>
        <Text>KLEROS</Text>
        <Text>GOVERNOR</Text>
      </Link>
    </NextLink>
  ),
  right: <AccountSettingsPopup />,
};
const footer = {
  left: <SecuredByKleros width={100} />,
  right: <SocialIcons />,
};
const AnimatedBox = animated(Box);
export default function App({ Component, pageProps }) {
  const router = useRouter();
  const { network = "mainnet" } = useMemo(
    () => wrapConnection.parseAsPath(router.asPath).query,
    [router.asPath]
  );

  const [routeChangeConnection, setRouteChangeConnection] = useState();
  const connectToRouteChange = useCallback((connection) => {
    const wrappedConnection = wrapConnection(connection);
    wrappedConnection(location.pathname + location.search);
    setRouteChangeConnection(() => wrappedConnection);
  }, []);
  useEffect(() => {
    if (routeChangeConnection) {
      router.events.on("routeChangeStart", routeChangeConnection);
      return () => router.events.off("routeChangeStart", routeChangeConnection);
    }
  }, [routeChangeConnection, router.events]);

  const onNetworkChange = useCallback(
    ({ name: _network }) => {
      if (router.query.network !== _network) {
        const query = new URLSearchParams(location.search);
        if (!_network) query.delete("network");
        else query.set("network", _network);
        router.replace({
          pathname: location.pathname,
          query: query.toString(),
        });
      }
    },
    [router]
  );

  const transitions = useTransition(
    [{ key: router.route, Component, pageProps }],
    (item) => item.key,
    {
      from: { opacity: 0, transform: "translate3d(0%,0,0)" },
      enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
      leave: {
        opacity: 0,
        position: "absolute",
        transform: "translate3d(-100%,0,0)",
      },
    }
  );
  return (
    <ThemeProvider theme={klerosTheme}>
      <RelayProvider
        endpoint={`https://api.thegraph.com/subgraphs/name/epiqueras/governor-${network}`}
        queries={queries}
        connectToRouteChange={connectToRouteChange}
      >
        <Web3Provider
          infuraURL={`wss://${network}.infura.io/ws/v3/dd555294ec53482f952f78d2d955c34d`}
          contracts={contracts}
          onNetworkChange={onNetworkChange}
        >
          <ArchonProvider>
            <Layout header={header} footer={footer}>
              {transitions.map(({ key, props, item }) => (
                <AnimatedBox key={key} style={props} sx={{ padding: 3 }}>
                  <item.Component {...item.pageProps} />
                </AnimatedBox>
              ))}
            </Layout>
          </ArchonProvider>
        </Web3Provider>
      </RelayProvider>
    </ThemeProvider>
  );
}
