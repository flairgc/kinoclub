#!/usr/bin/env node

// Скрипт для рекурсивного сбора всего кода проекта в один файл all_code_project.txt
// Использует ESM-модули. Настройте при необходимости whiteList и blackList путей

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Для вычисления __dirname в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Белый список (при непустом массиве будут включаться только указанные файлы/директории)
const whiteList = [
    // Пример: 'src', 'lib/utils.js'
];

// Черный список (будут исключены файлы/директории с указанными именами или путями)
const blackList = [
    'node_modules', // папка node_modules
    '.env',          // файл .env
    'combine_code_project.js'          // этот эже файл
];

// Корневая директория скрипта
const rootDir = __dirname;
// Итоговый файл
const outputFile = path.join(rootDir, 'all_code_project.txt');

// Проверка на черный список
function isBlacklisted(relPath) {
    return blackList.some(pattern => {
        const base = path.basename(pattern);
        return relPath.split(path.sep).includes(base) || relPath.includes(pattern);
    });
}

// Проверка на белый список
function isWhitelisted(relPath) {
    return whiteList.some(pattern => {
        const base = path.basename(pattern);
        return relPath.split(path.sep).includes(base) || relPath.includes(pattern);
    });
}

// Рекурсивный обход директорий
async function traverse(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.relative(rootDir, fullPath);

        // Исключения: .env и node_modules
        if (entry.name === '.env' || relPath.endsWith('.env')) continue;
        if (entry.isDirectory() && entry.name === 'node_modules') continue;

        // Логика white/black листа
        if (whiteList.length > 0) {
            if (!isWhitelisted(relPath)) continue;
        } else {
            if (isBlacklisted(relPath)) continue;
        }

        if (entry.isDirectory()) {
            await traverse(fullPath);
        } else if (entry.isFile()) {
            const content = await fs.readFile(fullPath, 'utf8');
            await fs.appendFile(outputFile, `// ${relPath}\n`);
            await fs.appendFile(outputFile, content + "\n\n");
        }
    }
}

// Основная функция
async function main() {
    // Очищаем или создаем файл
    await fs.writeFile(outputFile, '');

    // Запускаем обход
    await traverse(rootDir);

    console.log(`Все файлы проекта объединены в ${outputFile}`);
}

main().catch(err => {
    console.error('Ошибка:', err);
    process.exit(1);
});
