import { LoginRequest, LoginResponse } from "./type";

export const loginQueryOptions = {
    mutationKey: ['userInfo'],
    mutationFn: async (loginRequest: LoginRequest) => {
        const res = await fetch('/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginRequest),
        });
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg);
        }
        return res.json() as Promise<LoginResponse>;
      }
};
