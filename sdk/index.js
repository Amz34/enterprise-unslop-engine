/**
 * Enterprise Node.js / TypeScript SDK for Programmatic UI Slop Auditing
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class UnslopGovernanceSDK {
  constructor(options = {}) {
    this.failOnFindings = options.failOnFindings ?? false;
    this.sarifOutput = options.sarifOutput ?? 'unslop-results.sarif';
    this.gateScript = path.resolve(__dirname, '../scripts/enterprise-unslop-gate.js');
  }

  auditDirectory(targetDir) {
    try {
      const output = execSync(
        `node "${this.gateScript}" --target="${targetDir}" --fail="${this.failOnFindings}" --sarif="${this.sarifOutput}"`,
        { encoding: 'utf8' }
      );
      return { success: true, log: output };
    } catch (err) {
      return { success: false, log: err.stdout || err.message };
    }
  }

  getSarifReport() {
    if (fs.existsSync(this.sarifOutput)) {
      return JSON.parse(fs.readFileSync(this.sarifOutput, 'utf8'));
    }
    return null;
  }
}

module.exports = { UnslopGovernanceSDK };
