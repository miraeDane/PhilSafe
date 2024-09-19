
export interface AccountSignInFromEmailDto {
    SignInType?: string;
    email: string;
    password: string;
    role?: string;
  }
  
  export interface AccountSignInFromContactDto {
    SignInType?: string;
    contactNum: any;
    password: string;
    role?: string;
  }
  
  
  export interface ResultMessage {
    code: number;
    message: string;
    
  }
  