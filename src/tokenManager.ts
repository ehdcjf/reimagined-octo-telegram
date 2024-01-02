import jwt from "jsonwebtoken";

export class TokenManager {
        private static instance: TokenManager;
        private token: string;
        private constructor() {
                const payload = {
                        access_key: Bun.env.ACCESS_KEY,
                        nonce: crypto.randomUUID(),
                };
                this.token = jwt.sign(payload, Bun.env.SECRET_KEY);
        }

        public static getInstance() {
                TokenManager.instance ??= new TokenManager();
                return TokenManager.instance;
        }

        public getJWT() {
                return this.token;
        }
}
