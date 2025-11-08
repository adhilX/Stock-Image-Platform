import { compare, hash } from "bcrypt"


export const hashPassword = async(pass:string):Promise<string>=>{

      const saltRounds = 10;
    const hashedPassword = await hash(pass,saltRounds)
    return hashedPassword
} 


export const comparePassword = async(pass:string,hashedPass:string):Promise<boolean>=>{
    const match = await compare(pass,hashedPass)
    return match
}