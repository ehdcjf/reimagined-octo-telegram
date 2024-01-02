declare global {
        namespace NodeJS {
                interface ProcessEnv {
                        [key: string]: string | undefined;
                        ACCESS_KEY: string;
                        SECRET_KEY: string;
                        // add more environment variables and their types here
                }
        }
}

export {};
