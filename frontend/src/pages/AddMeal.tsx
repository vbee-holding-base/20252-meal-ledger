import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "../components/layout/TopAppBar";
import InputCard from "../components/common/InputCard";
import SubmitButton from "../components/common/SubmitButton";

const AddMeal: React.FC = () => {
  const [mealText, setMealText] = useState<string>("");
  const navigate = useNavigate();

  const handleAnalyzeSubmit = () => {
    if (!mealText.trim()) return;

    navigate("/add-meal-detail", { state: { rawText: mealText } });
  };

  return (
    <div className="bg-background min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-background px-4 pb-24 relative">
        <div className="flex justify-center">
          <TopAppBar title="Thêm bữa ăn" />
        </div>

        <div className="pt-20">
          <InputCard
            value={mealText}
            onChange={setMealText}
            placeholder={
              "Ví dụ:\nMinh ăn bún chả 45k\nKhánh ăn nem chua 10k\nVĩnh ăn phở bò 35k"
            }
          />
        </div>
        <SubmitButton
          title="Phân tích"
          onClick={handleAnalyzeSubmit}
          disabled={!mealText.trim()}
        />
      </div>
    </div>
  );
};

export default AddMeal;
