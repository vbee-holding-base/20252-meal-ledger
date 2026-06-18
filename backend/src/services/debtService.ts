import { findParticipantById } from "../repo/participantRepo";
import { findAllMealsByParticipant } from "../repo/debtRepo";

export const getDetailDebt = async (participantId: string) => {
  const participant = await findParticipantById(participantId);
  const participantMeal = await findAllMealsByParticipant(participantId);
  const historyDebts = participantMeal
    .map((meal) => {
      const participantInfo = meal.participantsInfo.find(
        (p) => p.participantId.toString() === participantId.toString(),
      );
      if (!participantInfo) {
        return null;
      }
      return {
        restaurantName: meal.restaurantName,
        date: meal.date,
        amount: participantInfo.amount,
        status: participantInfo.status,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
  return historyDebts;
};
export const checkParticipant = async (participantId: string) => {
  const participant = await findParticipantById(participantId);
  return participant;
};
