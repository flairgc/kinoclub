#!/usr/bin/env node
import { copyFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// получить __dirname в ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

// исходный .env в корне
const src = join(__dirname, '../.env');

// куда копировать
const targets = [
    join(__dirname, '../frontend/.env'),
    join(__dirname, '../backend/.env'),
];

if (!existsSync(src)) {
    console.error('Файл .env не найден в корне проекта');
    process.exit(1);
}

for (const dest of targets) {
    try {
        copyFileSync(src, dest);
        console.info(`✔ Скопировано: ${src} → ${dest}`);
    } catch (err) {
        console.error(`✘ Не удалось скопировать в ${dest}:`, err.message);
        process.exit(1);
    }
}
