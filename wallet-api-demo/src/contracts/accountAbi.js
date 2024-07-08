export const accountAbi = [
  {
    name: "AccountCallArray",
    size: 4,
    type: "struct",
    members: [
      {
        name: "to",
        type: "felt",
        offset: 0,
      },
      {
        name: "selector",
        type: "felt",
        offset: 1,
      },
      {
        name: "data_offset",
        type: "felt",
        offset: 2,
      },
      {
        name: "data_len",
        type: "felt",
        offset: 3,
      },
    ],
  },
  {
    name: "constructor",
    type: "constructor",
    inputs: [
      {
        name: "publicKey",
        type: "felt",
      },
    ],
    outputs: [],
  },
  {
    name: "getPublicKey",
    type: "function",
    inputs: [],
    outputs: [
      {
        name: "publicKey",
        type: "felt",
      },
    ],
    stateMutability: "view",
  },
  {
    name: "supportsInterface",
    type: "function",
    inputs: [
      {
        name: "interfaceId",
        type: "felt",
      },
    ],
    outputs: [
      {
        name: "success",
        type: "felt",
      },
    ],
    stateMutability: "view",
  },
  {
    name: "setPublicKey",
    type: "function",
    inputs: [
      {
        name: "newPublicKey",
        type: "felt",
      },
    ],
    outputs: [],
  },
  {
    name: "isValidSignature",
    type: "function",
    inputs: [
      {
        name: "hash",
        type: "felt",
      },
      {
        name: "signature_len",
        type: "felt",
      },
      {
        name: "signature",
        type: "felt*",
      },
    ],
    outputs: [
      {
        name: "isValid",
        type: "felt",
      },
    ],
    stateMutability: "view",
  },
  {
    name: "__validate__",
    type: "function",
    inputs: [
      {
        name: "call_array_len",
        type: "felt",
      },
      {
        name: "call_array",
        type: "AccountCallArray*",
      },
      {
        name: "calldata_len",
        type: "felt",
      },
      {
        name: "calldata",
        type: "felt*",
      },
    ],
    outputs: [],
  },
  {
    name: "__validate_declare__",
    type: "function",
    inputs: [
      {
        name: "class_hash",
        type: "felt",
      },
    ],
    outputs: [],
  },
  {
    name: "__validate_deploy__",
    type: "function",
    inputs: [
      {
        name: "class_hash",
        type: "felt",
      },
      {
        name: "salt",
        type: "felt",
      },
      {
        name: "publicKey",
        type: "felt",
      },
    ],
    outputs: [],
  },
  {
    name: "__execute__",
    type: "function",
    inputs: [
      {
        name: "call_array_len",
        type: "felt",
      },
      {
        name: "call_array",
        type: "AccountCallArray*",
      },
      {
        name: "calldata_len",
        type: "felt",
      },
      {
        name: "calldata",
        type: "felt*",
      },
    ],
    outputs: [
      {
        name: "response_len",
        type: "felt",
      },
      {
        name: "response",
        type: "felt*",
      },
    ],
  },
];
