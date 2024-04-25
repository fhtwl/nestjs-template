import * as path from 'path';
import * as fs from 'fs';
import { DynamicModule, Global, Module } from '@nestjs/common';

export interface AutoRegisterOptions {
  path: string;
}

@Global()
@Module({})
export class AutoRegisterModule {
  static registerControllers(options: AutoRegisterOptions): DynamicModule {
    const controllers = this.loadControllers(options.path);
    return {
      module: AutoRegisterModule,
      controllers,
    };
  }
  static registerModules(options: AutoRegisterOptions): DynamicModule {
    const modules = this.loadModules(options.path);
    return {
      module: AutoRegisterModule,
      imports: modules,
    };
  }

  private static loadControllers(directory: string): any[] {
    const normalizedPath = path.join(__dirname, directory);
    return this.loadControllersRecursively(normalizedPath);
  }

  private static loadControllersRecursively(directory: string): any[] {
    const files = fs.readdirSync(directory);

    return files.reduce((controllers, file) => {
      const filePath = path.join(directory, file);
      const isDirectory = fs.statSync(filePath).isDirectory();

      if (isDirectory) {
        // Recursively load controllers from subdirectories
        controllers.push(...this.loadControllersRecursively(filePath));
      } else if (file.endsWith('.controller.js')) {
        // Load controllers ending with '.controller.ts'
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const module = require(filePath);
        if (module && module.default) {
          controllers.push(module.default);
        } else {
          console.error(
            `Module at ${filePath} does not have a default export.`,
          );
        }
        // console.log('file', filePath);
        // console.log('filePath', require(filePath).default);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        // controllers.push(require(filePath).default);
      }

      return controllers;
    }, []);
  }

  private static loadModules(directory: string): any[] {
    const normalizedPath = path.join(__dirname, directory);
    return this.loadModulesRecursively(normalizedPath);
  }

  private static loadModulesRecursively(directory: string): any[] {
    const files = fs.readdirSync(directory);

    return files.reduce((importedModules, file) => {
      const filePath = path.join(directory, file);
      const isDirectory = fs.statSync(filePath).isDirectory();
      if (isDirectory) {
        // Recursively load controllers from subdirectories
        importedModules.push(...this.loadModulesRecursively(filePath));
      } else if (file.endsWith('.module.js')) {
        // Load controllers ending with '.controller.ts'
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const module = require(filePath);
        if (module && module.default) {
          importedModules.push(module.default);
        } else {
          console.error(
            `Module at ${filePath} does not have a default export.`,
          );
        }
        // console.log('file', filePath);
        // console.log('filePath', require(filePath).default);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        // controllers.push(require(filePath).default);
      }

      return importedModules;
    }, []);
  }
}
