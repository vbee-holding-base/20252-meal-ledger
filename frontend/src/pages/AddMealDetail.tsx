import React from "react";
import TopAppBar from "../components/layout/TopAppBar";
import SubmitButton from "../components/common/SubmitButton";

const AddMealDetail: React.FC = () => {
  const handleSubmit = () => {
    console.log("Đã bấm lưu thông tin bữa ăn");
  };

  return (
    <>
      <TopAppBar title="Chi tiết bữa ăn" />

      <SubmitButton title="Lưu thông tin" onClick={handleSubmit} />
    </>
  );
};

export default AddMealDetail;
