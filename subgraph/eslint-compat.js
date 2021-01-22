const input = [];
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input.push(chunk);
});
process.stdin.on("end", () => {
  const parsedInput = JSON.parse(input.join(""));

  const schemas = parsedInput.__schema.types.find(
    ({ name }) => name === "_Schema_"
  );
  if (schemas)
    schemas.fields = [
      {
        args: [],
        type: {
          kind: "NON_NULL",
          ofType: {
            name: "ID",
          },
        },
      },
    ];
  const schemaOrderBys = parsedInput.__schema.types.find(
    ({ name }) => name === "_Schema__orderBy"
  );
  if (schemaOrderBys) schemaOrderBys.enumValues = [{}];

  process.stdout.write(JSON.stringify(parsedInput, null, 2));
  process.stdout.write("\n");
});
