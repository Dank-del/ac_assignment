import dotenv from 'dotenv'
dotenv.config();
import { createExpressEndpoints, initServer } from '@ts-rest/express';
import express from 'express';
import * as bodyParser from 'body-parser';
import { contract } from 'contract';
import { prisma } from 'database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from "cors";
import { generateOpenApi } from '@ts-rest/open-api';
import * as swaggerUi from 'swagger-ui-express';
import cookieparser from 'cookie-parser';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const openApiDocument = generateOpenApi(contract, {
    info: {
        title: 'Attack Capital Assignment API',
        version: '1.0.0',
    },
});

const s = initServer();
const router = s.router(contract, {
    signup: async ({ body: { email, password } }) => {
        const passwordHash = await bcrypt.hash(password, 10);
        const result = await prisma.user.create({
            data: {
                email,
                passwordHash,
            },
            select: {
                id: true,
                email: true,

            }
        })
        return {
            status: 200,
            body: result,
        };
    },
    login: async ({ body: { email, password }, res }) => {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return {
                status: 400,
                body: {
                    error: 'User not found',
                },
            };
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '6h' });
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            return {
                status: 400,
                body: {
                    error: 'Invalid password',
                },
            };
        }
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        })
        return {
            status: 200,
            body: {
                msg: 'Logged in',
                token: token,
            },
        };
    },
    post: {
        middleware: [
            async (req, res, next) => {
                const token = req.headers.authorization?.split(' ')[1];
                if (!token) {
                    return res.status(400).json({
                        error: 'Unauthorized',
                    });
                }
                try {
                    const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
                    const exists = await prisma.user.findUnique({ where: { id } });
                    if (!exists) {
                        return res.status(400).json({
                            error: 'User not found',
                        });
                    }
                    next();
                } catch (e) {
                    return res.status(400).json({
                        error: 'Unauthorized',
                    });
                }
            },
        ],
        handler: async ({ body: { title, content }, req }) => {
            const token = req.headers.authorization?.split(' ')[1];
            const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
            const result = await prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: id,
                },
            });
            return {
                status: 200,
                body: result,
            };
        }
    },
    // posts: async () => {
    //     const result = await prisma.post.findMany();
    //     return {
    //         status: 200,
    //         body: result,
    //     };
    // },
    posts: async ({ query: { author } }) => {
        if (author) {
            const result = await prisma.post.findMany({
                where: {
                    authorId: author,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return {
                status: 200,
                body: result,
            };
        }
        const result = await prisma.post.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return {
            status: 200,
            body: result,
        };
    },
    me: async ({ req }) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return {
                status: 400,
                body: {
                    error: 'Unauthorized',
                },
            };
        }
        try {
            const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
            const exists = await prisma.user.findUnique({ where: { id } });
            if (!exists) {
                return {
                    status: 400,
                    body: {
                        error: 'User not found',
                    },
                };
            }
            return {
                status: 200,
                body: exists,
            };
        } catch (e) {
            return {
                status: 400,
                body: {
                    error: 'Unauthorized',
                },
            };
        }
    }
});

app.use(cors());
app.use(cookieparser(process.env.COOKIE_SECRET));
app.use(express.json());
createExpressEndpoints(contract, router, app);
app.use('/', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.listen(process.env.API_PORT, () => {
    console.debug({
        NODE_ENV: process.env.NODE_ENV,
        JWT_SECRET: process.env.JWT_SECRET,
        COOKIE_SECRET: process.env.COOKIE_SECRET,
    })
    console.log(`Server started on http://localhost:${process.env.API_PORT}`);
});