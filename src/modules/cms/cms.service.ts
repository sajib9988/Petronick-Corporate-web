import { prisma } from "../../database/prisma";
import { AppError } from "../../shared/errors/app-error";
import { destroyImage } from "../../shared/utils/cloudinary-destroy";
import { ICreatepage, ICreateSection, IUpdatePage, IUpdateSection } from "./cms.interface";
import httpStatus from "http-status";

const createPage = async (payload: ICreatepage)=>{
    const existing = await prisma.page.findUnique({
        where:{
            slug:payload.slug
        }
    })
    if(existing){
        throw new AppError(httpStatus.CONFLICT, "Page with this slug already exists")
    }
    return await prisma.page.create({ data: payload });
}


const getAllPages = async () => {
  return await prisma.page.findMany({
    include: {
      sections: {
        orderBy: { order: "asc" },
      },
    },
  });
};


const getPageBYSlug = async (slug:string)=>{
    const page =await prisma.page.findUnique({
        where:{slug},
        include:{
            sections:{
                 where:{isVisible:true},
                 orderBy:{order: "asc"}
            }
        }
    })
    if(!page){
        throw new AppError(httpStatus.NOT_FOUND, "Page not found")
    }
    return page;
}

const updatePage = async (slug: string, payload: IUpdatePage) => {
  const existing = await prisma.page.findUnique({ where: { slug } });

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Page not found");
  }

  return await prisma.page.update({
    where: { slug },
    data: payload,
  });
};

const deletePage = async (slug: string) => {
  const existing = await prisma.page.findUnique({ where: { slug } });

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Page not found");
  }

  await prisma.page.delete({ where: { slug } });
  return null;
};


// 
const createSection = async (payload: ICreateSection, image?:string) => {
    const page = await prisma.page.findUnique({
        where:{
            id:payload.pageId
        }
    })

    if (!page){
        throw new AppError(httpStatus.NOT_FOUND, "Page not found")
    }

return await prisma.section.create({
    data:{
        pageId:payload.pageId,
        sectionType:payload.type,
        content:payload.content,
        image: image ?? null,
        order:payload.order??0,
        isVisible:payload.isVisible ?? true

    }
})

}


const getSectionByPage= async (pageId:string )=>{
    const page = await prisma.page.findUnique({
        where:{id:pageId}
    })

     if (!page) {
    throw new AppError(httpStatus.NOT_FOUND, "Page not found");
  }

  return await prisma.section.findMany({
    where: { pageId },
    orderBy: { order: "asc" },
  });
}

const getSectionById = async (id: string) => {
  const section = await prisma.section.findUnique({ where: { id } });

  if (!section) {
    throw new AppError(httpStatus.NOT_FOUND, "Section not found");
  }

  return section;
};


const updateSection = async (
  id: string,
  payload: IUpdateSection,
  image?: string,
) => {
  const existing = await getSectionById(id);

  if (image && existing.image) {
    await destroyImage(existing.image);
  }

  return await prisma.section.update({
    where: { id },
    data: {
      ...(payload.type && { sectionType: payload.type }),
      ...(payload.content && { content: payload.content }),
      ...(payload.order !== undefined && { order: payload.order }),
      ...(payload.isVisible !== undefined && { isVisible: payload.isVisible }),
      ...(image && { image }),
    },
  });
};


const deleteSection = async (id:string) => {
  const existing = await getSectionById(id);

  if (existing.image) {
    await destroyImage(existing.image);
  }

  return await prisma.section.delete({ where: { id } });
};


export const cmsService = {
    createPage,
    getAllPages,
    getPageBYSlug,
    updatePage,
    deletePage,
    createSection, 
    getSectionByPage,
    getSectionById,
    updateSection,
    deleteSection
}