import { Sequelize, ModelStatic } from 'sequelize';
import { Express } from 'express';

export interface ProjectPlugin {
  registerModels?: (sequelize: Sequelize) => void;
  registerRoutes: (
    app: Express,
    sequelize: Sequelize,
    models: Record<string, ModelStatic<any>>
  ) => void;
}
