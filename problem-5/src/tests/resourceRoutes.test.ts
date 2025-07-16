import request from 'supertest';
import app from '../app';

// Mock the ResourceService module
jest.mock('../service/resourceService', () => ({
    ResourceService: {
        createResource: jest.fn(),
        getResources: jest.fn(),
        getResourceById: jest.fn(),
        updateResource: jest.fn(),
        deleteResource: jest.fn(),
        getResourceStats: jest.fn()
    }
}));

import { ResourceService } from '../service/resourceService';
const mockResourceService = ResourceService as jest.Mocked<typeof ResourceService>;

describe('Resource Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /resources', () => {
        it('should create a new resource successfully', async () => {
            const newResource = {
                name: 'Test Resource',
                description: 'A test resource',
                type: 'test',
                status: 'active' as const,
                metadata: { test: true }
            };

            const createdResource = {
                id: 1,
                ...newResource,
                created_at: new Date(),
                updated_at: new Date()
            };

            mockResourceService.createResource.mockResolvedValue(createdResource);

            const response = await request(app)
                .post('/resources')
                .send(newResource)
                .expect(201);

            expect(response.body).toEqual({
                success: true,
                message: 'Resource created successfully',
                data: expect.objectContaining({
                    id: 1,
                    name: 'Test Resource',
                    type: 'test'
                })
            });

            expect(mockResourceService.createResource).toHaveBeenCalledWith(newResource);
        });

        it('should return 400 if resource creation fails', async () => {
            const newResource = {
                name: '',
                type: 'test',
                status: 'active' as const
            };

            mockResourceService.createResource.mockRejectedValue(new Error('Name is required'));

            const response = await request(app)
                .post('/resources')
                .send(newResource)
                .expect(400);

            expect(response.body).toEqual({
                success: false,
                message: 'Name is required'
            });
        });
    });

    describe('GET /resources', () => {
        it('should return list of resources with pagination', async () => {
            const mockResult = {
                data: [
                    {
                        id: 1,
                        name: 'Resource 1',
                        type: 'test',
                        status: 'active' as const,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                ],
                total: 1,
                page: 1,
                totalPages: 1
            };

            mockResourceService.getResources.mockResolvedValue(mockResult);

            const response = await request(app)
                .get('/resources')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                message: 'Resources retrieved successfully',
                data: expect.arrayContaining([
                    expect.objectContaining({
                        id: 1,
                        name: 'Resource 1',
                        type: 'test',
                        status: 'active'
                    })
                ]),
                pagination: {
                    total: 1,
                    page: 1,
                    totalPages: 1,
                    limit: 10
                }
            });
        });

        it('should handle query parameters for filtering', async () => {
            const mockResult = {
                data: [],
                total: 0,
                page: 1,
                totalPages: 0
            };

            mockResourceService.getResources.mockResolvedValue(mockResult);

            await request(app)
                .get('/resources?type=database&status=active&page=2&limit=5')
                .expect(200);

            expect(mockResourceService.getResources).toHaveBeenCalledWith({
                type: 'database',
                status: 'active',
                limit: 5,
                offset: 5
            });
        });
    });

    describe('GET /resources/:id', () => {
        it('should return a specific resource', async () => {
            const mockResource = {
                id: 1,
                name: 'Test Resource',
                type: 'test',
                status: 'active' as const,
                created_at: new Date(),
                updated_at: new Date()
            };

            mockResourceService.getResourceById.mockResolvedValue(mockResource);

            const response = await request(app)
                .get('/resources/1')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                message: 'Resource retrieved successfully',
                data: expect.objectContaining({
                    id: 1,
                    name: 'Test Resource',
                    type: 'test',
                    status: 'active'
                })
            });

            expect(mockResourceService.getResourceById).toHaveBeenCalledWith(1);
        });

        it('should return 404 if resource not found', async () => {
            mockResourceService.getResourceById.mockRejectedValue(new Error('Resource not found'));

            const response = await request(app)
                .get('/resources/999')
                .expect(404);

            expect(response.body).toEqual({
                success: false,
                message: 'Resource not found'
            });
        });

        it('should return 400 for invalid ID', async () => {
            const response = await request(app)
                .get('/resources/invalid')
                .expect(400);

            expect(response.body).toEqual({
                success: false,
                message: 'Invalid resource ID'
            });
        });
    });

    describe('PUT /resources/:id', () => {
        it('should update a resource successfully', async () => {
            const updates = {
                name: 'Updated Resource',
                status: 'inactive' as const
            };

            const updatedResource = {
                id: 1,
                name: 'Updated Resource',
                type: 'test',
                status: 'inactive' as const,
                created_at: new Date(),
                updated_at: new Date()
            };

            mockResourceService.updateResource.mockResolvedValue(updatedResource);

            const response = await request(app)
                .put('/resources/1')
                .send(updates)
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                message: 'Resource updated successfully',
                data: expect.objectContaining({
                    id: 1,
                    name: 'Updated Resource',
                    status: 'inactive',
                    type: 'test'
                })
            });

            expect(mockResourceService.updateResource).toHaveBeenCalledWith(1, updates);
        });

        it('should return 404 if resource not found', async () => {
            mockResourceService.updateResource.mockRejectedValue(new Error('Resource not found'));

            const response = await request(app)
                .put('/resources/999')
                .send({ name: 'Updated' })
                .expect(404);

            expect(response.body).toEqual({
                success: false,
                message: 'Resource not found'
            });
        });
    });

    describe('DELETE /resources/:id', () => {
        it('should delete a resource successfully', async () => {
            mockResourceService.deleteResource.mockResolvedValue();

            const response = await request(app)
                .delete('/resources/1')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                message: 'Resource deleted successfully'
            });

            expect(mockResourceService.deleteResource).toHaveBeenCalledWith(1);
        });

        it('should return 404 if resource not found', async () => {
            mockResourceService.deleteResource.mockRejectedValue(new Error('Resource not found'));

            const response = await request(app)
                .delete('/resources/999')
                .expect(404);

            expect(response.body).toEqual({
                success: false,
                message: 'Resource not found'
            });
        });
    });

    describe('GET /resources/stats', () => {
        it('should return resource statistics', async () => {
            const mockStats = {
                total: 5,
                byStatus: { active: 3, inactive: 1, pending: 1 },
                byType: { server: 2, database: 1, cache: 1, storage: 1 }
            };

            mockResourceService.getResourceStats.mockResolvedValue(mockStats);

            const response = await request(app)
                .get('/resources/stats')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                message: 'Resource statistics retrieved successfully',
                data: mockStats
            });
        });
    });
});
