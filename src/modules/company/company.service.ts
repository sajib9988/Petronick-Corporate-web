import { prisma } from "../../database/prisma";
import { AppError } from "../../shared/errors/app-error";
import { destroyImage } from "../../shared/utils/cloudinary-destroy";
import { getPagination } from "../../shared/utils/pagination";
import { ICompanyQuery, IcreateCompany, IupdateCompany,  } from "./company.interface";
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


const getAllCompanies = async (query: ICompanyQuery) => {
  const { page, limit, skip } = getPagination(query);
  const { search, isVisible } = query;

  const where: Record<string, unknown> = {}; // আগে declare করো

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  if (isVisible !== undefined) {
    where.isVisible = isVisible === "true";
  }

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      orderBy: { order: "asc" },
      skip,
      take: limit,
    }),
    prisma.company.count({ where }),
  ]);

  return {
    data: companies,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getCompanyById = async (id:string)=>{
    const company =await prisma.company.findUnique({
        where: {id}
    })

    if (!company){
        throw new AppError(httpStatus.NOT_FOUND, "Company not found");
    
    }

    return company;
}

const updateCompany = async (id: string, payload: IupdateCompany) => {
  const existing = await getCompanyById(id);

  if (payload.name) {
    const nameExists = await prisma.company.findFirst({
      where: { name: payload.name, NOT: { id } },
    });
    if (nameExists) {
          throw new AppError(httpStatus.CONFLICT, "Company with this name already exists");
    }
  }

  if (payload.logo && existing.logo) {
    await destroyImage(existing.logo);
  }

  return await prisma.company.update({
    where: { id },
    data: payload,
  });
};

const deleteCompany = async (id: string) => {
  const existing = await getCompanyById(id);

  if (existing.logo) {
    await destroyImage(existing.logo);
  }

  await prisma.company.delete({ where: { id } });
  return null;
};







export const companyService = {
  createCompany,
  getAllCompanies,
  getCompanyById,
    updateCompany,
    deleteCompany,
}