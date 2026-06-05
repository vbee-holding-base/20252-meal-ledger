import React from "react";
import TopAppBar from "../components/layout/TopAppBar";
import SubmitButton from "../components/common/SubmitButton";
import ParticipantMealCard from "../components/common/ParticipantMealCard";
import { useNavigate } from "react-router-dom";

const AddMealDetail: React.FC = () => {
  const navigate = useNavigate();
  const handleSubmit = () => {
    console.log("Đã bấm lưu thông tin bữa ăn");
    navigate("/");
  };

  return (
    <>
      <TopAppBar title="Chi tiết bữa ăn" />

      <main className="flex-1 w-full max-w-md pt-20 px-4 pb-28 overflow-y-auto space-y-4">
        <ParticipantMealCard
          participantName="Minh Thư"
          dishName="Bún chả đặc biệt"
          price="65.000"
          onDishNameChange={(value) => console.log(value)}
          onPriceChange={(value) => console.log(value)}
          onDelete={() => alert("Bấm nút xóa thành viên")}
        />

        <ParticipantMealCard
          participantName="Minh Thư"
          dishName="Bún chả đặc biệt"
          price="65.000"
          onDishNameChange={(value) => console.log(value)}
          onPriceChange={(value) => console.log(value)}
          onDelete={() => alert("Bấm nút xóa thành viên")}
        />

        <ParticipantMealCard
          participantName="Minh Thư"
          dishName="Bún chả đặc biệt"
          price="65.000"
          onDishNameChange={(value) => console.log(value)}
          onPriceChange={(value) => console.log(value)}
          onDelete={() => alert("Bấm nút xóa thành viên")}
        />

        <ParticipantMealCard
          participantName="Minh Thư"
          dishName="Bún chả đặc biệt"
          price="65.000"
          onDishNameChange={(value) => console.log(value)}
          onPriceChange={(value) => console.log(value)}
          onDelete={() => alert("Bấm nút xóa thành viên")}
        />
      </main>

      <SubmitButton title="Lưu thông tin" onClick={handleSubmit} />
    </>
  );
};

export default AddMealDetail;
