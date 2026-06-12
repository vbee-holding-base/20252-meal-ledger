import { AuthRequest } from "../middlewares/auth";

export const getOwnerId = (req: AuthRequest) => {
  let ownerId = req.user?.id;
  if (!ownerId) ownerId = req.body.ownerId;
  return ownerId;
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
export const escapeRegex = (text: string): string => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
