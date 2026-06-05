import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "../components/layout/TopAppBar";
import InputCard from "../components/common/InputCard";
import SubmitButton from "../components/common/SubmitButton"; // Import nút bấm đa năng vào đây

const AddMeal: React.FC = () => {
  const [mealText, setMealText] = useState<string>("");
  const navigate = useNavigate();

  const handleAnalyzeSubmit = () => {
    if (!mealText.trim()) return;

    // Chuyển trang sang chi tiết bữa ăn kèm dữ liệu
    navigate("/add-meal-detail", { state: { rawText: mealText } });
  };

  return (
    <div className="bg-background min-h-screen flex justify-center">
      {/* Khung container chuẩn Mobile Layout */}
      <div className="w-full max-w-md bg-background px-4 pb-28 relative">
        {/* 1. Thanh tiêu đề trên cùng */}
        <TopAppBar title="Thêm bữa ăn" />

        {/* 2. Thẻ nhập liệu (Đã tháo nút bấm bên trong) */}
        <div className="pt-20">
          <InputCard
            value={mealText}
            onChange={setMealText}
            placeholder={
              "Ví dụ:\nMinh ăn bún chả 45k\nKhánh ăn nem chua 10k\nVĩnh ăn phở bò 35k"
            }
          />
        </div>

        {/* 3. Đặt nút bấm nằm ở đây (Fixed sát đáy nhờ CSS nội bộ của SubmitButton) */}
        <SubmitButton
          title="Phân tích"
          onClick={handleAnalyzeSubmit}
          disabled={!mealText.trim()} // Tự động khóa nếu người dùng chưa gõ chữ
        />
      </div>
    </div>
  );
};

export default AddMeal;
