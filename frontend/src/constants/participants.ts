import type { Participant } from "../types";

export const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: "1",
    name: "Việt Anh",
    debt: 100000,
    initial: "A",
    bg: "bg-primary-fixed",
    text: "text-on-primary-fixed",
  },
  {
    id: "2",
    name: "Đăng Khánh",
    debt: 0,
    initial: "B",
    bg: "bg-secondary-fixed",
    text: "text-on-secondary-fixed",
  },
  {
    id: "3",
    name: "Đình Vĩnh",
    debt: 120000,
    initial: "C",
    bg: "bg-tertiary-fixed",
    text: "text-on-tertiary-fixed",
  },
  {
    id: "4",
    name: "Nhật Minh",
    debt: 0,
    initial: "D",
    bg: "bg-outline-variant",
    text: "text-on-surface-variant",
  },
  {
    id: "5",
    name: "Kim Huy",
    debt: 50000,
    initial: "H",
    bg: "bg-primary-fixed-dim",
    text: "text-on-primary-fixed-variant",
  },
];
