import { UsersRepository } from "../repositories/index.js";

export const existeEmail = async (email) => {
  const emailExiste = await UsersRepository.getUserByEmail(email);
  if (emailExiste) throw new Error(`El email ${email} ya esta registrado.`);
};
