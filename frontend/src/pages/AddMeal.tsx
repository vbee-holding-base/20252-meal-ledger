import React, { useState } from "react";
import TopAppBar from "../components/layout/TopAppBar";
import InputCard from "../components/common/InputCard";

const AddMeal: React.FC = () => {
  const [mealText, setMealText] = useState<string>("");

  return (
    <>
      <TopAppBar title="Thêm bữa ăn" />

      <div className="pt-20 px-4">
        <InputCard value={mealText} onChange={setMealText} />
      </div>
    </>
  );
};

export default AddMeal;
