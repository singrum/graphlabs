export const sampleGraph = {
  title: "New Graph",
  
  nodes: new Map([
    [
      "d1025e9e-3a92-4a70-acf9-ed5da6136389",
      {
        _id: "d1025e9e-3a92-4a70-acf9-ed5da6136389",
        _label: "Node 1",
        _color: "#00a2ff",
        _x: 450,
        _y: 210,
      },
    ],
    [
      "7d8c94da-773d-4073-8ceb-2f0e84877193",
      {
        _id: "7d8c94da-773d-4073-8ceb-2f0e84877193",
        _label: "Node 2",
        _color: "#00a2ff",
        _x: 603,
        _y: 239,
      },
    ],
    [
      "a6a733f5-da94-442a-b3d2-67ca08c653c4",
      {
        _id: "a6a733f5-da94-442a-b3d2-67ca08c653c4",
        _label: "Node 3",
        _color: "#00a2ff",
        _x: 453,
        _y: 371,
      },
    ],
    [
      "3fc845b8-a59d-4137-8b4f-3ebaaea16e28",
      {
        _id: "3fc845b8-a59d-4137-8b4f-3ebaaea16e28",
        _label: "Node 4",
        _color: "#00a2ff",
        _x: 390,
        _y: 503,
      },
    ],
    [
      "f60227cd-883d-4d4e-b592-03485b5c4ffb",
      {
        _id: "f60227cd-883d-4d4e-b592-03485b5c4ffb",
        _label: "Node 5",
        _color: "#00a2ff",
        _x: 554,
        _y: 586,
      },
    ],
  ]),
  edges: new Map([
    [
      "8d74755c-2e8e-4744-94db-d467e7989372",
      {
        _id: "8d74755c-2e8e-4744-94db-d467e7989372",
        _source: "d1025e9e-3a92-4a70-acf9-ed5da6136389",
        _target: "a6a733f5-da94-442a-b3d2-67ca08c653c4",
        _label: "Edge 1",
      },
    ],
    [
      "4371788e-762c-4dc0-b916-37dd542caaa1",
      {
        _id: "4371788e-762c-4dc0-b916-37dd542caaa1",
        _source: "a6a733f5-da94-442a-b3d2-67ca08c653c4",
        _target: "3fc845b8-a59d-4137-8b4f-3ebaaea16e28",
        _label: "Edge 2",
      },
    ],
    [
      "8c6d6cd6-b1bc-4da0-9319-8fa96f2fc34b",
      {
        _id: "8c6d6cd6-b1bc-4da0-9319-8fa96f2fc34b",
        _source: "3fc845b8-a59d-4137-8b4f-3ebaaea16e28",
        _target: "f60227cd-883d-4d4e-b592-03485b5c4ffb",
        _label: "Edge 3",
      },
    ],
    [
      "966e8368-b4f7-4d79-8751-78ed693c0e4a",
      {
        _id: "966e8368-b4f7-4d79-8751-78ed693c0e4a",
        _source: "f60227cd-883d-4d4e-b592-03485b5c4ffb",
        _target: "7d8c94da-773d-4073-8ceb-2f0e84877193",
        _label: "Edge 4",
      },
    ],
    [
      "f92b09c5-9caf-4f17-8a5c-630169ea56a3",
      {
        _id: "f92b09c5-9caf-4f17-8a5c-630169ea56a3",
        _source: "7d8c94da-773d-4073-8ceb-2f0e84877193",
        _target: "d1025e9e-3a92-4a70-acf9-ed5da6136389",
        _label: "Edge 5",
      },
    ],
    [
      "5564a64e-3a4e-4aa9-926b-babd3ab0eb74",
      {
        _id: "5564a64e-3a4e-4aa9-926b-babd3ab0eb74",
        _source: "a6a733f5-da94-442a-b3d2-67ca08c653c4",
        _target: "7d8c94da-773d-4073-8ceb-2f0e84877193",
        _label: "Edge 6",
      },
    ],
    [
      "5bb17650-b376-4bfc-a6b7-42cfdebce201",
      {
        _id: "5bb17650-b376-4bfc-a6b7-42cfdebce201",
        _source: "7d8c94da-773d-4073-8ceb-2f0e84877193",
        _target: "f60227cd-883d-4d4e-b592-03485b5c4ffb",
        _label: "Edge 7",
      },
    ],
    [
      "66fc4e87-1d18-488e-a719-03673057ff53",
      {
        _id: "66fc4e87-1d18-488e-a719-03673057ff53",
        _source: "f60227cd-883d-4d4e-b592-03485b5c4ffb",
        _target: "a6a733f5-da94-442a-b3d2-67ca08c653c4",
        _label: "Edge 8",
      },
    ],
  ]),
  succ: new Map([
    [
      "d1025e9e-3a92-4a70-acf9-ed5da6136389",
      new Map([
        [
          "a6a733f5-da94-442a-b3d2-67ca08c653c4",
          ["8d74755c-2e8e-4744-94db-d467e7989372"],
        ],
      ]),
    ],
    [
      "7d8c94da-773d-4073-8ceb-2f0e84877193",
      new Map([
        [
          "d1025e9e-3a92-4a70-acf9-ed5da6136389",
          ["f92b09c5-9caf-4f17-8a5c-630169ea56a3"],
        ],
        [
          "f60227cd-883d-4d4e-b592-03485b5c4ffb",
          ["5bb17650-b376-4bfc-a6b7-42cfdebce201"],
        ],
      ]),
    ],
    [
      "a6a733f5-da94-442a-b3d2-67ca08c653c4",
      new Map([
        [
          "3fc845b8-a59d-4137-8b4f-3ebaaea16e28",
          ["4371788e-762c-4dc0-b916-37dd542caaa1"],
        ],
        [
          "7d8c94da-773d-4073-8ceb-2f0e84877193",
          ["5564a64e-3a4e-4aa9-926b-babd3ab0eb74"],
        ],
      ]),
    ],
    [
      "3fc845b8-a59d-4137-8b4f-3ebaaea16e28",
      new Map([
        [
          "f60227cd-883d-4d4e-b592-03485b5c4ffb",
          ["8c6d6cd6-b1bc-4da0-9319-8fa96f2fc34b"],
        ],
      ]),
    ],
    [
      "f60227cd-883d-4d4e-b592-03485b5c4ffb",
      new Map([
        [
          "7d8c94da-773d-4073-8ceb-2f0e84877193",
          ["966e8368-b4f7-4d79-8751-78ed693c0e4a"],
        ],
        [
          "a6a733f5-da94-442a-b3d2-67ca08c653c4",
          ["66fc4e87-1d18-488e-a719-03673057ff53"],
        ],
      ]),
    ],
  ]),
  pred: new Map([
    [
      "d1025e9e-3a92-4a70-acf9-ed5da6136389",
      new Map([
        [
          "7d8c94da-773d-4073-8ceb-2f0e84877193",
          ["f92b09c5-9caf-4f17-8a5c-630169ea56a3"],
        ],
      ]),
    ],
    [
      "7d8c94da-773d-4073-8ceb-2f0e84877193",
      new Map([
        [
          "f60227cd-883d-4d4e-b592-03485b5c4ffb",
          ["966e8368-b4f7-4d79-8751-78ed693c0e4a"],
        ],
        [
          "a6a733f5-da94-442a-b3d2-67ca08c653c4",
          ["5564a64e-3a4e-4aa9-926b-babd3ab0eb74"],
        ],
      ]),
    ],
    [
      "a6a733f5-da94-442a-b3d2-67ca08c653c4",
      new Map([
        [
          "d1025e9e-3a92-4a70-acf9-ed5da6136389",
          ["8d74755c-2e8e-4744-94db-d467e7989372"],
        ],
        [
          "f60227cd-883d-4d4e-b592-03485b5c4ffb",
          ["66fc4e87-1d18-488e-a719-03673057ff53"],
        ],
      ]),
    ],
    [
      "3fc845b8-a59d-4137-8b4f-3ebaaea16e28",
      new Map([
        [
          "a6a733f5-da94-442a-b3d2-67ca08c653c4",
          ["4371788e-762c-4dc0-b916-37dd542caaa1"],
        ],
      ]),
    ],
    [
      "f60227cd-883d-4d4e-b592-03485b5c4ffb",
      new Map([
        [
          "3fc845b8-a59d-4137-8b4f-3ebaaea16e28",
          ["8c6d6cd6-b1bc-4da0-9319-8fa96f2fc34b"],
        ],
        [
          "7d8c94da-773d-4073-8ceb-2f0e84877193",
          ["5bb17650-b376-4bfc-a6b7-42cfdebce201"],
        ],
      ]),
    ],
  ]),
};
