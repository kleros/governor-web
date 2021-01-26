import { Card } from "@kleros/components";

export default function TXCard({ selectedTX, TX, ...rest }) {
  return (
    <Card
      variant="muted"
      sx={{
        borderRadius: 0,
        padding: 0,
        width: "100%",
        ":hover": {
          backgroundColor: "rgba(0, 154, 255, 0.06)",
        },
        ":hover:not(.active)": {
          borderColor: "transparent !important",
        },
        "&.active": {
          backgroundColor: "rgba(0, 154, 255, 0.06)",
          borderBottomColor: "transparent !important",
          borderRightColor: "transparent !important",
          borderTopColor: "transparent !important",
        },
      }}
      active={selectedTX === TX}
      mainSx={{
        justifyContent: "flex-start",
        paddingX: 2,
        paddingY: 1,
      }}
      {...rest}
    >
      {TX.title}
    </Card>
  );
}
