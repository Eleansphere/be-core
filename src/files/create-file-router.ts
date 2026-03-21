import { Router } from 'express';
import { ModelStatic } from 'sequelize';
import multer from 'multer';

export interface FileFieldConfig {
  fieldName: string;
  blobColumn: string;
  mimeTypeColumn?: string;
}

export function createFileRouter(Model: ModelStatic<any>, fieldConfig: FileFieldConfig): Router {
  const { fieldName, blobColumn, mimeTypeColumn } = fieldConfig;
  const router = Router();
  const upload = multer();

  // Upload file
  router.post('/:id/' + fieldName, upload.single(fieldName), async (req, res) => {
    try {
      const entity = await Model.findByPk(req.params.id);
      if (!entity) {
        return res.status(404).json({ message: 'Not found' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const updateData: Record<string, any> = { [blobColumn]: req.file.buffer };
      if (mimeTypeColumn) {
        updateData[mimeTypeColumn] = req.file.mimetype;
      }

      await entity.update(updateData);
      res.json({ message: 'File updated' });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Download file
  router.get('/:id/' + fieldName, async (req, res) => {
    try {
      const entity = await Model.findByPk(req.params.id);
      if (!entity || !entity[blobColumn]) {
        return res.status(404).json({ message: 'No file' });
      }

      const mimeType = mimeTypeColumn ? entity[mimeTypeColumn] : 'application/octet-stream';
      res.set('Content-Type', mimeType);
      res.send(entity[blobColumn]);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}
