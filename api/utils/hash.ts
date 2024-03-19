import bcrypt from "bcryptjs"

let salt = bcrypt.genSaltSync(16)

export let generateHash = function(password: string): string {
    let salt = bcrypt.genSaltSync(16)
    return bcrypt.hashSync(password, salt)
}

export let isPasswordValid = function(password: string, oldHash: string): boolean {
    let doesEqual = bcrypt.compareSync(password, oldHash)
    return doesEqual
}

