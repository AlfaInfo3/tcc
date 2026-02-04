require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

console.log('--- Debugging Prisma Configuration ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PRISMA_CLIENT_ENGINE_TYPE (env):', process.env.PRISMA_CLIENT_ENGINE_TYPE);

// Check schema.prisma content matching
try {
    const schemaContent = fs.readFileSync(path.join(__dirname, 'prisma', 'schema.prisma'), 'utf8');
    console.log('Schema engineType config:', /engineType\s*=\s*"(.*)"/.exec(schemaContent)?.[1] || 'Not found');
} catch (e) {
    console.log('Could not read schema.prisma');
}

console.log('Initializing PrismaClient...');
try {
    const prisma = new PrismaClient({
        log: ['info', 'warn', 'error'],
    });
    
    // Inspect internals if possible (safe access)
    console.log('Prisma Client initialized.');
    
    // Attempt connection
    prisma.$connect()
        .then(() => {
            console.log('Successfully connected to DB!');
            return prisma.adminUser.count();
        })
        .then((count) => {
            console.log('Admin count:', count);
            process.exit(0);
        })
        .catch((e) => {
            console.error('Connection failed:', e.message);
            console.error('Full Error:', e);
            process.exit(1);
        });

} catch (e) {
    console.error('Initialization failed:', e.message);
    process.exit(1);
}
