import {
  Button,
  Field,
  Form,
  Popup,
  Textarea,
  ethereumAddressRegExp,
} from "@kleros/components";

const createValidationSchema = ({ string, eth }) => ({
  title: string()
    .max(50, "Must be 50 characters or less.")
    .required("Required"),
  target: string()
    .matches(ethereumAddressRegExp, "Must be a valid ETH address.")
    .required("Required"),
  value: eth(),
  data: string().matches(/^[\dA-Fa-f]*$/, "Must be valid bytes."),
});
export default function AddTXButton({ onAdd }) {
  return (
    <Popup trigger={<Button variant="secondary">Add TX</Button>} modal>
      {(close) => (
        <Form
          sx={{ padding: 2 }}
          createValidationSchema={createValidationSchema}
          onSubmit={(TX) => {
            onAdd(TX);
            close();
          }}
        >
          {({ isSubmitting }) => (
            <>
              <Field
                name="title"
                label="Title"
                placeholder="Title of the transaction."
              />
              <Field
                name="target"
                label="Target"
                placeholder="Target to send it to."
              />
              <Field
                name="value"
                label="Value"
                placeholder="Amount of ETH to send."
              />
              <Field
                as={Textarea}
                name="data"
                label="Data"
                placeholder="Hex encoded bytes to send."
              />
              <Button
                sx={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: 0,
                }}
                type="submit"
                loading={isSubmitting}
              >
                Add
              </Button>
            </>
          )}
        </Form>
      )}
    </Popup>
  );
}
