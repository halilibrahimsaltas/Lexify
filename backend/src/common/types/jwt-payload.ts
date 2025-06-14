import { UserRole } from "../enum/user-role.enum";

export type JwtPayload = {
    sub : number;
    email : string;
    role : UserRole;
    
};

