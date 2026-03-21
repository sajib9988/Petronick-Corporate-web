export interface IcreateCompany {
  name: string;
  description: string;
  logo: string;
  website?: string | null;
  order?: number;
  isVisible?: boolean;
  revenueStage?: string | null;
}

export interface IupdateCompany {
  name?: string;
  description?: string;
  logo?: string;
  website?: string | null;
  order?: number;
  isVisible?: boolean;
  revenueStage?: string | null;
}

export interface ICompanyQuery {
  page?: string;
  limit?: string;
  search?: string;
  isVisible?: string;
}