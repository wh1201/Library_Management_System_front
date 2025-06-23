import { RegisterRequest, RegisterResponse } from "./type";

export const registerQueryOptions = {
    mutationKey: ['userInfo'],
    mutationFn: async (registerRequest: RegisterRequest) => {
        const res = await fetch('/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerRequest),
        })
        if (!res.ok) {
            const errorData = await res.text();
            throw new Error(errorData);
        }
        return res.json() as Promise<RegisterResponse>;
    }
}