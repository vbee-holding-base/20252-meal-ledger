export const rawMealParseSchema = {
  type: "object",
  properties: {
    restaurantName: {
      type: "string",
      nullable: true,
    },
    date: {
      type: "string",
      nullable: true,
    },
    payerName: {
      type: "string",
      nullable: true,
    },
    totalAmount: {
      type: "number",
      nullable: true,
    },
    entries: {
      type: "array",
      items: {
        type: "object",
        properties: {
          personName: {
            type: "string",
          },
          amount: {
            type: "number",
            nullable: true,
          },
          rawText: {
            type: "string",
          },
        },
        required: ["personName", "amount"],
      },
    },
    notes: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: [
    "restaurantName",
    "date",
    "payerName",
    "totalAmount",
    "entries",
    "notes",
  ],
};