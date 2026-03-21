import { Sequelize } from 'sequelize';

export interface DbConfig {
  databaseUrl: string;
  schema?: string;
  logging?: boolean;
}

export function createSequelize(config: DbConfig): Sequelize {
  const sequelizeOptions: ConstructorParameters<typeof Sequelize>[1] = {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: config.logging ?? false,
  };

  if (config.schema) {
    sequelizeOptions.define = { schema: config.schema };
    (sequelizeOptions.dialectOptions as any).options = `-c search_path=${config.schema},public`;
  }

  return new Sequelize(config.databaseUrl, sequelizeOptions);
}
