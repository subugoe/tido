import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uiComponentFolder = path.join(__dirname, '../src/components/ui');

// Get component names from filenames
function getComponentNames(folder) {
  const files = fs.readdirSync(folder);
  return files.map((file) => path.parse(file).name);
}

function getComponentPaths(componentName) {
  const mainFile = path.join(uiComponentFolder, `${componentName}.tsx`);
  return fs.existsSync(mainFile) ? [mainFile] : [];
}

function runESLintOnFiles(files) {
  const validFiles = files.filter((f) =>
    ['.ts', '.tsx', '.js'].includes(path.extname(f))
  );
  if (validFiles.length === 0) return;

  try {
    console.log('🛠 Running ESLint...');
    execSync(`npx eslint --fix ${validFiles.join(' ')}`, {
      stdio: 'inherit',
      shell: true,
    });
  } catch (err) {
    console.error('❌ ESLint error:', err.message);
  }
}

// Install one component and fix it
function installComponent(component) {
  console.log(`📦 Installing ${component}...`);
  try {
    execSync(`yes | npx shadcn@latest add ${component}`, {
      stdio: 'inherit',
      shell: true,
    });
  } catch (err) {
    console.error(`❌ Failed to install ${component}:`, err.message);
    return;
  }

  const paths = getComponentPaths(component);
  if (paths.length > 0) {
    runESLintOnFiles(paths);
  } else {
    console.warn(`⚠️  No matching component file found for: ${component}`);
  }
}

// Run all
function installAllComponents() {
  const components = getComponentNames(uiComponentFolder);
  if (components.length === 0) {
    console.log('📭 No components to install.');
    return;
  }

  components.forEach(installComponent);
}

installAllComponents();
