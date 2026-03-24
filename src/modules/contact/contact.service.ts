import { prisma } from "../../database/prisma";
import { AppError } from "../../shared/errors/app-error";
import { getPagination } from "../../shared/utils/pagination";
import { IContactQuery, ICreateContact } from "./contact.interface";
import httpStatus from "http-status";
import { Parser } from "json2csv";

const createContact = async (payload: ICreateContact) => {
  return await prisma.contact.create({
    data: payload,
  });
};

const getAllContacts = async (query: IContactQuery) => {
  const { page, limit, skip } = getPagination(query);
  const { search } = query;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.contact.count({ where }),
  ]);

  return {
    data: contacts,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getContactById = async (id: string) => {
  const contact = await prisma.contact.findUnique({ where: { id } });

  if (!contact) {
    throw new AppError(httpStatus.NOT_FOUND, "Contact not found");
  }

  return contact;
};

const deleteContact = async (id: string) => {
  await getContactById(id);
  await prisma.contact.delete({ where: { id } });
  return null;
};

const exportCSV = async () => {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  const fields = ["id", "name", "email", "phone", "message", "createdAt"];
  const parser = new Parser({ fields });
  const csv = parser.parse(contacts);

  return csv;
};

export const contactService = {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact,
  exportCSV,
};