import { ReportSubCategory } from "./report-sub-category";

export interface ReportCategory {
    reportCategoryId: number;
    categoryName: string;
    
    reportSubCategories?: ReportSubCategory[];
  }