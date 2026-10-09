export interface File {
    id: number,
    original_name: string,
    cloudinary_public_id: string,
    url: string,
    mimetype: string,
    size: number,
    created_at: Date
};

export type CreateFileInput = Omit<File, 'id' | 'created_at'>;