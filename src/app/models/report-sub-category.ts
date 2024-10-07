import { ReportCategory } from './report-category'; 
import { Report } from './report'; 

export interface ReportSubCategory {
  reportSubCategoryId: number;
  subCategoryName?: string;
  reportCategoryId: number;
  reportCategory?: ReportCategory;
  reports?: Report[];
}
