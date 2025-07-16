import { ResourceService } from '../service/resourceService';

// Mock the resource queries module
jest.mock('../queries/resourceQueries', () => ({
    resourceQueries: {
        createResource: jest.fn(),
        getResources: jest.fn(),
        getResourceById: jest.fn(),
        updateResource: jest.fn(),
        deleteResource: jest.fn(),
        resourceExists: jest.fn()
    }
}));

import { resourceQueries } from '../queries/resourceQueries';
const mockResourceQueries = resourceQueries as jest.Mocked<typeof resourceQueries>;

describe('ResourceService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createResource', () => {
        it('should create a resource with valid data', async () => {
            const resourceData = {
                name: 'Test Resource',
                type: 'test',
                status: 'active' as const,
                description: 'A test resource'
            };

            const createdResource = {
                id: 1,
                ...resourceData,
                created_at: new Date(),
                updated_at: new Date()
            };

            mockResourceQueries.createResource.mockResolvedValue(createdResource);

            const result = await ResourceService.createResource(resourceData);

            expect(result).toEqual(createdResource);
            expect(mockResourceQueries.createResource).toHaveBeenCalledWith(resourceData);
        });

        it('should throw error if name is missing', async () => {
            const resourceData = {
                name: '',
                type: 'test',
                status: 'active' as const
            };

            await expect(ResourceService.createResource(resourceData))
                .rejects.toThrow('Name and type are required fields');
        });
    });
});
