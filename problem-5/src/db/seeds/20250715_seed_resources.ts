import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('resources').del();

    // Inserts seed entries
    await knex('resources').insert([
        {
            name: 'Database Server',
            description: 'Primary PostgreSQL database server for production environment',
            type: 'database',
            status: 'active',
            metadata: {
                version: '13.4',
                location: 'us-east-1',
                cpu: '4 cores',
                memory: '16GB'
            },
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            name: 'Web Application Server',
            description: 'Node.js application server running the main web application',
            type: 'server',
            status: 'active',
            metadata: {
                nodeVersion: '18.16.0',
                port: 3000,
                environment: 'production'
            },
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            name: 'Redis Cache',
            description: 'Redis server for caching frequently accessed data',
            type: 'cache',
            status: 'active',
            metadata: {
                version: '6.2',
                maxMemory: '2GB',
                evictionPolicy: 'allkeys-lru'
            },
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            name: 'Load Balancer',
            description: 'NGINX load balancer for distributing incoming requests',
            type: 'networking',
            status: 'active',
            metadata: {
                maxConnections: 1000,
                algorithm: 'round-robin',
                healthCheck: true
            },
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            name: 'Backup Storage',
            description: 'S3 bucket for storing application backups',
            type: 'storage',
            status: 'active',
            metadata: {
                size: '500GB',
                encryption: 'AES-256',
                retentionDays: 30
            },
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            name: 'Development Environment',
            description: 'Staging environment for testing new features',
            type: 'environment',
            status: 'pending',
            metadata: {
                branch: 'develop',
                autoDeployment: true,
                testCoverage: '85%'
            },
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            name: 'Legacy API Server',
            description: 'Old API server that needs to be decommissioned',
            type: 'server',
            status: 'inactive',
            metadata: {
                version: '1.0',
                deprecatedSince: '2024-01-01',
                replacedBy: 'Web Application Server'
            },
            created_at: new Date(),
            updated_at: new Date()
        }
    ]);
}
