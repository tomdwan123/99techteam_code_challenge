import { Resource } from '../types';
import { resourceQueries, ResourceFilters } from '../queries/resourceQueries';

export class ResourceService {
    // Create a new resource
    static async createResource(resourceData: Omit<Resource, 'id' | 'created_at' | 'updated_at'>): Promise<Resource> {
        // Validate required fields
        if (!resourceData.name || !resourceData.type) {
            throw new Error('Name and type are required fields');
        }

        // Validate status
        const validStatuses = ['active', 'inactive', 'pending'];
        if (resourceData.status && !validStatuses.includes(resourceData.status)) {
            throw new Error('Invalid status. Must be one of: active, inactive, pending');
        }

        try {
            const resource = await resourceQueries.createResource(resourceData);
            return resource;
        } catch (error) {
            throw new Error(`Failed to create resource: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Get resources with filters and pagination
    static async getResources(filters: ResourceFilters = {}): Promise<{data: Resource[], total: number, page?: number, totalPages?: number}> {
        try {
            // Set default pagination
            const limit = filters.limit || 10;
            const offset = filters.offset || 0;
            const page = Math.floor(offset / limit) + 1;

            const result = await resourceQueries.getResources({
                ...filters,
                limit,
                offset
            });

            const totalPages = Math.ceil(result.total / limit);

            return {
                ...result,
                page,
                totalPages
            };
        } catch (error) {
            throw new Error(`Failed to fetch resources: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Get a specific resource by ID
    static async getResourceById(id: number): Promise<Resource> {
        if (!id || id <= 0) {
            throw new Error('Valid resource ID is required');
        }

        try {
            const resource = await resourceQueries.getResourceById(id);
            if (!resource) {
                throw new Error('Resource not found');
            }
            return resource;
        } catch (error) {
            throw new Error(`Failed to fetch resource: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Update a resource
    static async updateResource(id: number, updates: Partial<Omit<Resource, 'id' | 'created_at'>>): Promise<Resource> {
        if (!id || id <= 0) {
            throw new Error('Valid resource ID is required');
        }

        // Check if resource exists
        const exists = await resourceQueries.resourceExists(id);
        if (!exists) {
            throw new Error('Resource not found');
        }

        // Validate status if provided
        if (updates.status) {
            const validStatuses = ['active', 'inactive', 'pending'];
            if (!validStatuses.includes(updates.status)) {
                throw new Error('Invalid status. Must be one of: active, inactive, pending');
            }
        }

        try {
            const updatedResource = await resourceQueries.updateResource(id, updates);
            if (!updatedResource) {
                throw new Error('Failed to update resource');
            }
            return updatedResource;
        } catch (error) {
            throw new Error(`Failed to update resource: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Delete a resource
    static async deleteResource(id: number): Promise<void> {
        if (!id || id <= 0) {
            throw new Error('Valid resource ID is required');
        }

        // Check if resource exists
        const exists = await resourceQueries.resourceExists(id);
        if (!exists) {
            throw new Error('Resource not found');
        }

        try {
            const deleted = await resourceQueries.deleteResource(id);
            if (!deleted) {
                throw new Error('Failed to delete resource');
            }
        } catch (error) {
            throw new Error(`Failed to delete resource: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Get resource statistics
    static async getResourceStats(): Promise<any> {
        try {
            const allResources = await resourceQueries.getResources({});
            const stats = {
                total: allResources.total,
                byStatus: {} as Record<string, number>,
                byType: {} as Record<string, number>
            };

            // Calculate statistics
            allResources.data.forEach(resource => {
                // Count by status
                stats.byStatus[resource.status] = (stats.byStatus[resource.status] || 0) + 1;
                
                // Count by type
                stats.byType[resource.type] = (stats.byType[resource.type] || 0) + 1;
            });

            return stats;
        } catch (error) {
            throw new Error(`Failed to fetch resource statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
