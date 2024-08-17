
export interface AccountSignInFromEmailDto {
    SignInType: string;
    email: string;
    password: string;
  }
  
  export interface AccountSignInFromContactDto {
    SignInType: string;
    contactNum: number;
    password: string;
  }
  
  
  export interface ResultMessage {
    code: number;
    message: string;
  }
  