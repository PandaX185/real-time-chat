import express = require("express");
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get('/messages/:sender/:receiver', async (req, res) => {
    const { sender, receiver } = req.params

    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        AND: [
                            {
                                sender
                            },
                            {
                                receiver
                            }
                        ]
                    },
                    {
                        AND: [
                            {
                                sender: receiver
                            },
                            {
                                receiver: sender
                            }
                        ]
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
