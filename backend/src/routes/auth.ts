import express from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';

const router = express.Router();
const prisma = new PrismaClient();

dotenv.config();


router.post('/auth/register', async (req,res)=>{    
    const { username, password } = req.body;
    
    try {
        const hashedPass = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPass
            }
        });

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || '',
            {
                expiresIn: '24h',
            }
        );
        res.json({ token });
    } catch (err) {
        console.log(err);
        
        res.status(500).json({ message: 'User registration failed', error: err });
    }
});

router.post('/auth/login', async(req,res)=>{
    const {username,password} = req.body;
    const user = await prisma.user.findUnique({
        where: {
            username
        }
    });

    if (user && await bcrypt.compare(password,user.password)){
        const token = jwt.sign(
            {id:user.id},
            process.env.JWT_SECRET!,
            {
                expiresIn: '24h',
            }
        )
        res.json({token});
    }else{
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

export default router;