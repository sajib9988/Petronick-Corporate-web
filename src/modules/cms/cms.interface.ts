
export interface ICreatepage{
slug:string,
title:string,
}


export interface ICreateSection{
pageId:string,
type:   'HERO' | 'ABOUT' | "CTA" | "TESTIMONIALS" | "GALLERY" | "CONTACT" | "FEATURE";
content: Record<string, any>;
image?:string;
Order?:number;
isVisible?:boolean;

}

export interface IUpdatePage {
  title?: string;
}

export interface IUpdateSection {
  type?: 'HERO' | 'ABOUT' | "CTA" | "TESTIMONIALS" | "GALLERY" | "CONTACT" | "FEATURE";
  content?: Record<string, unknown>;
  image?: string;
  order?: number;
  isVisible?: boolean;
}

export interface IPageQuery {
  slug?: string;
}

export interface ISectionQuery {
  pageId?: string;
  type?: string;
  isVisible?: string;
}

