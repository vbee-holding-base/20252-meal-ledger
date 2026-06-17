import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TopAppBar from "../components/layout/TopAppBar";
import InputCard from "../components/common/InputCard";
import SubmitButton from "../components/common/SubmitButton";

const AddMeal: React.FC = () => {
  const { t } = useTranslation();
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
          <TopAppBar title={t("addMeal.title")} />
        </div>

        <div className="pt-20">
          <InputCard
            value={mealText}
            onChange={setMealText}
            placeholder={t("addMeal.placeholder")}
          />
        </div>
        <SubmitButton
          title={t("addMeal.analyze")}
          onClick={handleAnalyzeSubmit}
          disabled={!mealText.trim()}
        />
      </div>
    </div>
  );
};

export default AddMeal;
