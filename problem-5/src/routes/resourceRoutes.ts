import { Router, Request, Response } from 'express';
import { ResourceService } from '../service/resourceService';
import { Resource } from '../types';

const router = Router();

// GET /resources/stats - Get resource statistics (must be before parameterized routes)
router.get('/resources/stats', async (req: Request, res: Response) => {
    try {
        const stats = await ResourceService.getResourceStats();
        
        res.status(200).json({
            success: true,
            message: 'Resource statistics retrieved successfully',
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch resource statistics'
        });
    }
});

// POST /resources - Create a new resource
router.post('/resources', async (req: Request, res: Response) => {
    try {
        const resourceData: Omit<Resource, 'id' | 'created_at' | 'updated_at'> = req.body;
        const resource = await ResourceService.createResource(resourceData);
        
        res.status(201).json({
            success: true,
            message: 'Resource created successfully',
            data: resource
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to create resource'
        });
    }
});

// GET /resources - List resources with filters
router.get('/resources', async (req: Request, res: Response) => {
    try {
        const {
            type,
            status,
            name,
            page = '1',
            limit = '10'
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const offset = (pageNum - 1) * limitNum;

        const filters = {
            type: type as string,
            status: status as 'active' | 'inactive' | 'pending',
            name: name as string,
            limit: limitNum,
            offset
        };

        // Remove undefined values from filters
        Object.keys(filters).forEach(key => {
            if (filters[key as keyof typeof filters] === undefined) {
                delete filters[key as keyof typeof filters];
            }
        });

        const result = await ResourceService.getResources(filters);
        
        res.status(200).json({
            success: true,
            message: 'Resources retrieved successfully',
            data: result.data,
            pagination: {
                total: result.total,
                page: result.page,
                totalPages: result.totalPages,
                limit: limitNum
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch resources'
        });
    }
});

// GET /resources/:id - Get a specific resource
router.get('/resources/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid resource ID'
            });
        }

        const resource = await ResourceService.getResourceById(id);
        
        res.status(200).json({
            success: true,
            message: 'Resource retrieved successfully',
            data: resource
        });
    } catch (error) {
        const statusCode = error instanceof Error && error.message === 'Resource not found' ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch resource'
        });
    }
});

// PUT /resources/:id - Update a resource
router.put('/resources/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid resource ID'
            });
        }

        const updates: Partial<Omit<Resource, 'id' | 'created_at'>> = req.body;
        const resource = await ResourceService.updateResource(id, updates);
        
        res.status(200).json({
            success: true,
            message: 'Resource updated successfully',
            data: resource
        });
    } catch (error) {
        const statusCode = error instanceof Error && error.message === 'Resource not found' ? 404 : 400;
        res.status(statusCode).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update resource'
        });
    }
});

// DELETE /resources/:id - Delete a resource
router.delete('/resources/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid resource ID'
            });
        }

        await ResourceService.deleteResource(id);
        
        res.status(200).json({
            success: true,
            message: 'Resource deleted successfully'
        });
    } catch (error) {
        const statusCode = error instanceof Error && error.message === 'Resource not found' ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to delete resource'
        });
    }
});

export default router;
