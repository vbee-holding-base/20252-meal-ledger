import { findParticipantById } from "../repo/participantRepo";
import { findUnpaidMealsByParticipant } from "../repo/debtRepo";

export const getDetailDebt = async (participantId: string) => {
  const participant = await findParticipantById(participantId);
  const participantMeal = await findUnpaidMealsByParticipant(participantId);
  const historyDebts = participantMeal
    .map((meal) => {
      const participantInfo = meal.participantsInfo.find(
        (p) => p.participantId.toString() === participantId.toString(),
      );
      if (!participantInfo || participantInfo.status !== "unpaid") {
        return null;
      }
      return {
        restaurantName: meal.restaurantName,
        date: meal.date,
        amount: participantInfo.amount,
      };
    })
    .filter(
      (item): item is { restaurantName: string; date: Date; amount: number } =>
        item !== null,
    );
  return historyDebts;
};
export const checkParticipant = async (participantId: string) => {
  const participant = await findParticipantById(participantId);
  return participant;
};
