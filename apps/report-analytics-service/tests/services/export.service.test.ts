import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as service from '../../src/services/export.service';
import * as repo from '../../src/repositories/export.repository';
import * as csv from '../../src/utils/csv.generator';

vi.mock('../../src/repositories/export.repository');
vi.mock('../../src/utils/csv.generator');

const mockedRepo = repo as {
  findAdminExportRows: () => Promise<Array<Record<string, string>>>;
};

const mockedCSV = csv as {
  generateAdminCSV: (rows: Array<Record<string, string>>) => Promise<string>;
};

describe('Export Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate csv for download', async () => {
    mockedRepo.findAdminExportRows = vi
      .fn()
      .mockResolvedValue([{ id: '1', patient: 'John' }]);

    mockedCSV.generateAdminCSV = vi.fn().mockResolvedValue('/tmp/export.csv');

    const result = await service.requestExport(
      'today',
      undefined,
      undefined,
      'download',
      'user1',
      'mail@test.com'
    );

    expect('filePath' in result).toBe(true);
  });
});
