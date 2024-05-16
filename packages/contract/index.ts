import { initContract } from '@ts-rest/core';
import z from 'zod';
import { Post, User } from 'database';

const c = initContract();
export const contract = c.router({
    signup: {
        method: 'POST',
        path: '/signup',
        body: z.object({
            email: z.string().email(),
            password: z.string().min(6),
        }),
        responses: {
            200: z.object({
                email: z.string(),
                id: z.number(),
            }),
            400: z.object({
                error: z.string(),
            }),
        }
    },
    login: {
        method: 'POST',
        path: '/login',
        body: z.object({
            email: z.string().email(),
            password: z.string().min(6),
        }),
        responses: {
            200: z.object({
                msg: z.string(),
                token: z.string(),
            }),
            400: z.object({
                error: z.string(),
            }),
        }
    },
    post: {
        method: 'POST',
        path: '/post',
        body: z.object({
            title: z.string(),
            content: z.string(),
        }),
        headers: z.object({
            authorization: z.string(),
        }),
        responses: {
            200: c.type<Post>(),
            400: z.object({
                error: z.string(),
            }),
        }
    },
    posts: {
        method: 'GET',
        path: '/posts',
        query: z.object({
            author: z.number().optional(),
        }),
        responses: {
            200: c.type<Post[]>(),
            400: z.object({
                error: z.string(),
            }),
        }
    },
    me: {
        method: 'GET',
        path: '/me',
        headers: z.object({
            authorization: z.string(),
        }),
        responses: {
            200: c.type<Omit<User, 'passwordHash'>>(),
            400: z.object({
                error: z.string(),
            }),
        }
    }
})