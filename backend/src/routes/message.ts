import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post('/messages', async (req, res) => {
    const { content, receiver, sender } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Invalid credentials' });
    }
    try {
        const message = await prisma.message.create({
            data: {
                content,
                sender,
                receiver,
            },
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ error: `Failed to send message ${error}` });
    }
});

router.get('/messages/:user', async (req, res) => {
    const { user } = req.params
    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        sender: user
                    },
                    {
                        receiver: user
                    }
                ]
            },
            orderBy: {
                createdAt: 'asc',
            }
        })

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: `Failed to get messages ${err}` });
    }
});

export default router;
