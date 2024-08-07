import { defineAction, z } from 'astro:actions';


export const registerUser = defineAction({
  accept: 'form',
  input: z.object({
    username: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
  handler: async ({ username, password, email }, { cookies }) => {
    return {
      ok: true
    };
  },
});
