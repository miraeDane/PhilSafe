import { Crime } from "./crime";

export interface Medium {
    mediaId: number;
    content?: Uint8Array; 
    contentType?: string;
    description?: string; 
    reportId?: number; 
    crimeId?: number; 
    extension?: string;
    filename: any;
    file?: any;
    crime?: Crime; 
    report?: Report; 
  } 