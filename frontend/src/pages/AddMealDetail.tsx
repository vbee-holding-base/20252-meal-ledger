import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "../components/layout/TopAppBar";
import SubmitButton from "../components/common/SubmitButton";
import ParticipantMealCard from "../components/common/ParticipantMealCard";

interface Participant {
  id: number;
  name: string;
  dish: string;
  price: string | number;
}

const AddMealDetail: React.FC = () => {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, name: "Minh", dish: "Bún chả", price: "45000" },
    { id: 2, name: "Khánh", dish: "Nem chua", price: "10000" },
    { id: 3, name: "Vĩnh", dish: "Phở bò", price: "35000" },
  ]);

  const handleAddParticipant = () => {
    const newId = Date.now();
    setParticipants([
      ...participants,
      {
        id: newId,
        name: `Thành viên ${participants.length + 1}`,
        dish: "",
        price: "",
      },
    ]);
  };

  const handleDishChange = (id: number, value: string) => {
    setParticipants(
      participants.map((item) =>
        item.id === id ? { ...item, dish: value } : item,
      ),
    );
  };

  const handlePriceChange = (id: number, value: string) => {
    setParticipants(
      participants.map((item) =>
        item.id === id ? { ...item, price: value } : item,
      ),
    );
  };

  const handleDeleteParticipant = (id: number) => {
    setParticipants(participants.filter((item) => item.id !== id));
  };

  const handleSubmit = () => {
    navigate("/");
  };

  return (
    <div className="bg-background min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-background px-4 pb-24 relative flex flex-col">
        <div className="flex justify-center">
          <TopAppBar title="Chi tiết bữa ăn" />
        </div>

        <main className="flex-1 pt-20 pb-4 overflow-y-auto space-y-4">
          {participants.map((person) => (
            <ParticipantMealCard
              key={person.id}
              participantName={person.name}
              dishName={person.dish}
              price={person.price}
              onDishNameChange={(value) => handleDishChange(person.id, value)}
              onPriceChange={(value) => handlePriceChange(person.id, value)}
              onDelete={() => handleDeleteParticipant(person.id)}
            />
          ))}

          <button
            type="button"
            onClick={handleAddParticipant}
            className="w-full h-14 border-2 border-dashed border-outline/40 hover:border-primary/60 hover:bg-primary/5 rounded-3xl text-on-surface-variant font-semibold text-base transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Thêm thành viên
          </button>
        </main>

        <SubmitButton title="Lưu thông tin" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default AddMealDetail;
