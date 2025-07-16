import database from '../db/database';
import { Resource } from '../types';

export interface ResourceFilters {
    type?: string;
    status?: 'active' | 'inactive' | 'pending';
    name?: string;
    limit?: number;
    offset?: number;
}

export const resourceQueries = {
    // Create a new resource
    createResource: async (resource: Omit<Resource, 'id' | 'created_at' | 'updated_at'>): Promise<Resource> => {
        const [createdResource] = await database('resources')
            .insert({
                ...resource,
                created_at: new Date(),
                updated_at: new Date()
            })
            .returning('*');
        return createdResource;
    },

    // Get all resources with optional filters
    getResources: async (filters: ResourceFilters = {}): Promise<{data: Resource[], total: number}> => {
        let query = database('resources');
        
        // Apply filters
        if (filters.type) {
            query = query.where('type', 'ilike', `%${filters.type}%`);
        }
        
        if (filters.status) {
            query = query.where('status', filters.status);
        }
        
        if (filters.name) {
            query = query.where('name', 'ilike', `%${filters.name}%`);
        }

        // Get total count for pagination
        const totalResult = await query.clone().count('* as count').first();
        const total = parseInt(totalResult?.count as string) || 0;

        // Apply pagination
        if (filters.limit) {
            query = query.limit(filters.limit);
        }
        
        if (filters.offset) {
            query = query.offset(filters.offset);
        }

        // Order by created_at desc
        query = query.orderBy('created_at', 'desc');

        const data = await query;
        return { data, total };
    },

    // Get a resource by ID
    getResourceById: async (id: number): Promise<Resource | null> => {
        const resource = await database('resources').where('id', id).first();
        return resource || null;
    },

    // Update a resource
    updateResource: async (id: number, updates: Partial<Omit<Resource, 'id' | 'created_at'>>): Promise<Resource | null> => {
        const [updatedResource] = await database('resources')
            .where('id', id)
            .update({
                ...updates,
                updated_at: new Date()
            })
            .returning('*');
        return updatedResource || null;
    },

    // Delete a resource
    deleteResource: async (id: number): Promise<boolean> => {
        const deletedCount = await database('resources').where('id', id).del();
        return deletedCount > 0;
    },

    // Check if a resource exists
    resourceExists: async (id: number): Promise<boolean> => {
        const resource = await database('resources').where('id', id).first();
        return !!resource;
    }
};
