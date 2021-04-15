"use strict";
exports.__esModule = true;
exports.contractAddress = exports.abi = void 0;
exports.abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "uploader",
                type: "address"
            },
            {
                indexed: false,
                internalType: "string",
                name: "cid",
                type: "string"
            },
            {
                indexed: false,
                internalType: "string",
                name: "config",
                type: "string"
            },
            {
                indexed: false,
                internalType: "enum FPS.storageStatus",
                name: "status",
                type: "uint8"
            },
        ],
        name: "CidStatusUpdate",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "uploader",
                type: "address"
            },
            {
                indexed: false,
                internalType: "string",
                name: "cid",
                type: "string"
            },
            {
                indexed: false,
                internalType: "string",
                name: "config",
                type: "string"
            },
        ],
        name: "StorageRequest",
        type: "event"
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "cid",
                type: "string"
            },
            {
                internalType: "string",
                name: "config",
                type: "string"
            },
        ],
        name: "store",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "cid",
                type: "string"
            },
            {
                internalType: "enum FPS.storageStatus",
                name: "status",
                type: "uint8"
            },
        ],
        name: "updateStorageStatus",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
];
exports.contractAddress = "0xbbeff2b19d8d4b2fcbed78bf4a7a51bc5d912d76";
