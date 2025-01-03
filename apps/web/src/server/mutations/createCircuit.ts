'use server';

import { createClient } from '@/supabase/server';
import { PrismaClient } from '@prisma/client';

export const createCircuit = async () => {
    const supabase = createClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const prisma = new PrismaClient();
    const circuit = await prisma.node.create({
        data: {
            name: 'Untitled',
            type: 'CIRCUIT',
            position: {
                create: {
                    x: 0,
                    y: 0
                }
            },
            userId: user?.id
        }
    });

    return circuit;
};
