import { Injectable, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'fs';

@Injectable()
export class LoggerService implements OnModuleInit {
  async onModuleInit() {
    await this.verifyDirectory();
    await this.verifyFiles('./logs/combined.log');
    await this.verifyFiles('./logs/error.log');
  }

  private async verifyDirectory() {
    try {
      await fs.access('./logs');
    } catch (error) {
      await fs.mkdir('./logs', { recursive: true });
    }
  }

  private async verifyFiles(filePath: string) {
    try {
      await fs.access(filePath);
    } catch (error) {
      await fs.writeFile(filePath, '');
    }
  }
}
