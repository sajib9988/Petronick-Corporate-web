import { prisma } from "../../database/prisma";
import { AppError } from "../../shared/errors/app-error";
import { IcreateCompany } from "./company.interface";
import httpStatus from "http-status";

const  createCompany= async (payload:IcreateCompany)=>{
  const existingCompany = await prisma.company.findUnique({

    where: { name: payload.name },
  });

  if (existingCompany) {
    throw new AppError(httpStatus.CONFLICT, "Company with this name already exists");
  }

  const company = await prisma.company.create({
    data: payload,
  });

  return company;
}

export const companyService = {
  createCompany,
}