import cron from 'node-cron';
import { fetchAndSaveTariffs } from './wb-api';
import { updateSpreadsheets } from './google-sheets';

export function startTariffScheduler() {
  console.log('Запускается планировщик тарифов...');
  cron.schedule('0 * * * *', () => {
    console.log('[Scheduler] Запуск обновления WB тарифов');
    fetchAndSaveTariffs();
  });
}

export function startSheetsScheduler() {
  cron.schedule('30 * * * *', () => {
    console.log('[Scheduler] Запуск обновления Google Sheets');
    updateSpreadsheets();
  });
}