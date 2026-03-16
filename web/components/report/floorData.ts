export interface RoomData {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  assetCount?: number;
}

export interface FloorData {
  level: number;
  label: string;
  rooms: RoomData[];
}

export const floors: FloorData[] = [
  {
    level: 1,
    label: "Ground Floor",
    rooms: [
      { id: "101", label: "Room 101", x: 20, y: 20, width: 100, height: 70, assetCount: 5 },
      { id: "102", label: "Room 102", x: 130, y: 20, width: 100, height: 70, assetCount: 3 },
      { id: "103", label: "Room 103", x: 240, y: 20, width: 100, height: 70, assetCount: 8 },
      { id: "104", label: "Server Room", x: 20, y: 100, width: 150, height: 80, assetCount: 12 },
      { id: "105", label: "Lobby", x: 180, y: 100, width: 160, height: 80, assetCount: 2 },
    ],
  },
  {
    level: 2,
    label: "2nd Floor",
    rooms: [
      { id: "201", label: "Room 201", x: 20, y: 20, width: 100, height: 80, assetCount: 4 },
      { id: "202", label: "Room 202", x: 130, y: 20, width: 100, height: 80, assetCount: 6 },
      { id: "203", label: "Room 203", x: 240, y: 20, width: 100, height: 80, assetCount: 3 },
      { id: "204", label: "Suite A", x: 20, y: 110, width: 155, height: 70, assetCount: 9 },
      { id: "205", label: "Suite B", x: 185, y: 110, width: 155, height: 70, assetCount: 7 },
    ],
  },
  {
    level: 3,
    label: "3rd Floor",
    rooms: [
      { id: "301", label: "Room 301", x: 20, y: 20, width: 320, height: 60, assetCount: 5 },
      { id: "302", label: "Boardroom", x: 20, y: 90, width: 200, height: 90, assetCount: 11 },
      { id: "303", label: "Storage", x: 230, y: 90, width: 110, height: 90, assetCount: 0 },
    ],
  },
  {
    level: 4,
    label: "4th Floor",
    rooms: [
      { id: "401", label: "Executive Suite", x: 20, y: 20, width: 200, height: 160, assetCount: 14 },
      { id: "402", label: "Conf Room A", x: 230, y: 20, width: 110, height: 70, assetCount: 4 },
      { id: "403", label: "Conf Room B", x: 230, y: 100, width: 110, height: 80, assetCount: 3 },
    ],
  },
  {
    level: 5,
    label: "Rooftop",
    rooms: [
      { id: "501", label: "Utility Room", x: 20, y: 20, width: 140, height: 120, assetCount: 6 },
      { id: "502", label: "Common Area", x: 170, y: 20, width: 170, height: 120, assetCount: 1 },
    ],
  },
];
