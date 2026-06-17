import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TopAppBar from "../components/layout/TopAppBar";
import InputCard from "../components/common/InputCard";
import SubmitButton from "../components/common/SubmitButton";
import axiosClient from "../api/axiosClient";

const AddMeal: React.FC = () => {
  const { t } = useTranslation();
  const [mealText, setMealText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAnalyzeSubmit = async () => {
    if (!mealText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await axiosClient.post("/meals/parse", { text: mealText });
      navigate("/add-meal-detail", {
        state: {
          parsedData: res.data.data,
          context: res.data.context,
        },
      });
    } catch {
      setError(t("addMeal.error"));
    } finally {
      setIsLoading(false);
    }
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

        {error && (
          <p className="text-error text-sm text-center mt-2">{error}</p>
        )}

        <SubmitButton
          title={isLoading ? t("addMeal.analyzing") : t("addMeal.analyze")}
          onClick={handleAnalyzeSubmit}
          disabled={!mealText.trim() || isLoading}
        />
      </div>
    </div>
  );
};

export default AddMeal;
