export interface Resource {
    id?: number;
    name: string;
    description?: string;
    type: string;
    status: 'active' | 'inactive' | 'pending';
    metadata?: any;
    created_at?: Date;
    updated_at?: Date;
}