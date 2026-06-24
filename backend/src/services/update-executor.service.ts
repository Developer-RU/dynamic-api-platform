import { spawn } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { env } from '../config/env';
import { updateService } from './update.service';
import { UpdateJob } from '../models/UpdateJob';

const UPDATER_IMAGE = process.env.UPDATE_RUNNER_IMAGE || 'docker:26-cli';

export class UpdateExecutorService {
  isAvailable(): boolean {
    if (!env.updateExecutorEnabled) return false;
    if (env.updateDeployMode === 'docker' || env.updateDeployMode === 'docker-replica') {
      return existsSync('/var/run/docker.sock') && existsSync(env.updateComposeFile);
    }
    if (env.updateDeployMode === 'native') {
      return existsSync(env.updateProjectRoot);
    }
    return false;
  }

  getScriptPath(): string {
    return join(env.updateProjectRoot, 'scripts/self-update.sh');
  }

  private writeJobManifest(jobId: string, job: { targetTag: string; targetVersion: string; fromVersion: string }): void {
    const manifestPath = join(env.updateDataDir, `job-${jobId}.json`);
    writeFileSync(
      manifestPath,
      JSON.stringify({
        jobId,
        targetTag: job.targetTag,
        targetVersion: job.targetVersion,
        fromVersion: job.fromVersion,
      }),
      'utf8'
    );
  }

  async runJob(jobId: string): Promise<void> {
    const job = await UpdateJob.findById(jobId);
    if (!job) {
      await updateService.finishJob(jobId, 'failed', 'Update job not found');
      return;
    }

    const script = this.getScriptPath();
    if (!existsSync(script)) {
      await updateService.finishJob(jobId, 'failed', `Update script not found: ${script}`);
      return;
    }

    this.writeJobManifest(jobId, job);

    const scriptArgs = [
      jobId,
      env.updateDataDir,
      env.updateDeployMode,
      env.updateComposeFile,
      env.updateProjectRoot,
      String(env.port),
      env.updateHealthUrl,
    ];

    if (env.updateDeployMode === 'docker' || env.updateDeployMode === 'docker-replica') {
      if (!existsSync('/var/run/docker.sock')) {
        await updateService.finishJob(jobId, 'failed', 'Docker socket not available');
        return;
      }

      const containerName = `dap-update-${jobId.slice(-12)}`;
      const containerDataDir = '/data';
      const containerProjectRoot = '/deploy';
      const containerCompose = env.updateComposeFile.replace(env.updateProjectRoot, containerProjectRoot);
      const containerArgs = [
        jobId,
        containerDataDir,
        env.updateDeployMode,
        containerCompose,
        containerProjectRoot,
        String(env.port),
        env.updateHealthUrl,
      ];

      const inner = `apk add --no-cache bash git jq curl >/dev/null 2>&1; sh /deploy/scripts/self-update.sh ${containerArgs.map((a) => `'${a.replace(/'/g, "'\\''")}'`).join(' ')}`;

      const dockerArgs = [
        'run',
        '--rm',
        '-d',
        '--name',
        containerName,
        '--add-host=host.docker.internal:host-gateway',
        '-v',
        '/var/run/docker.sock:/var/run/docker.sock',
        '-v',
        `${env.updateProjectRoot}:${containerProjectRoot}`,
        '-v',
        `${env.updateDataDir}:${containerDataDir}`,
        '-w',
        containerProjectRoot,
        UPDATER_IMAGE,
        'sh',
        '-c',
        inner,
      ];

      const child = spawn('docker', dockerArgs, { detached: true, stdio: 'ignore' });
      child.unref();
      return;
    }

    const child = spawn('bash', [script, ...scriptArgs], {
      detached: true,
      stdio: 'ignore',
    });
    child.unref();
  }

  async rollbackJob(jobId: string, _userId?: string): Promise<void> {
    const script = join(env.updateProjectRoot, 'scripts/self-update-rollback.sh');
    if (!existsSync(script)) {
      throw new Error('Rollback script not found');
    }

    const args = [
      script,
      jobId,
      env.updateDataDir,
      env.updateDeployMode,
      env.updateComposeFile,
      env.updateProjectRoot,
      String(env.port),
      env.updateHealthUrl,
    ];

    await new Promise<void>((resolve, reject) => {
      const child = spawn('bash', args, { stdio: 'inherit' });
      child.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Rollback exited with code ${code}`));
      });
      child.on('error', reject);
    });

    await updateService.finishJob(jobId, 'rolled_back', 'Manual rollback completed');
  }
}

export const updateExecutorService = new UpdateExecutorService();

