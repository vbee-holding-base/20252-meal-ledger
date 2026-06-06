import { AuthRequest } from "../middlewares/auth";

export const getOwnerId = (req: AuthRequest) => {
  const ownerId = req.user?.id;
  if (!ownerId) return req.body.ownerId;
};

export const participantIdFromParams = (req: AuthRequest) => {
  const { participantId } = req.params as { participantId: string };
  return participantId;
};

export const normaliseName = (name: unknown) => {
  if (!name || typeof name !== "string") return null;
  const norm = name.trim();
  if (norm === "") return null;
  return norm;
};
