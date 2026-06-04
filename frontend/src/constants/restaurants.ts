import type { Restaurant } from "../types";

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "Cơm Tấm Ba Ghiền",
    address: "84 Đặng Văn Ngữ, P.10, Phú Nhuận",
    icon: "restaurant",
    bg: "bg-primary-fixed",
    text: "text-primary-container",
  },
  {
    id: "2",
    name: "Mì Gói Cô Giang",
    address: "140 Cô Giang, Quận 1",
    icon: "ramen_dining",
    bg: "bg-tertiary-fixed",
    text: "text-tertiary",
  },
  {
    id: "3",
    name: "Cà Phê Sáng",
    address: "22 Lý Tự Trọng, Quận 1",
    icon: "coffee",
    bg: "bg-secondary-fixed",
    text: "text-secondary",
  },
  {
    id: "4",
    name: "Phở Hòa Pasteur",
    address: "260C Pasteur, Quận 3",
    icon: "storefront",
    bg: "bg-primary-fixed",
    text: "text-primary-container",
  },
];
