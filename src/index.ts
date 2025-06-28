import knex from './db';
import config from './config';
import { startTariffScheduler, startSheetsScheduler } from './services/scheduler';
import { fetchAndSaveTariffs } from './services/wb-api';
import { updateSpreadsheets } from './services/google-sheets';

const runMigrations = async () => {
  try {
    console.log('Выполнение миграций...');
    await knex.migrate.latest();
    console.log('Миграции успешно выполнены');
  } catch (error) {
    console.error('Миграции прошли неудачно:', error);
    process.exit(1);
  }
};

async function main() {
  try {
    await knex.raw('SELECT 1');
    console.log('База данных запущена');

    // Запуск миграций
    await runMigrations();

    // Запуск планировщиков
    startTariffScheduler();
    startSheetsScheduler();
    
    // Принудительный запуск при старте
    console.log('Запуск проверки работы функций при старте...');
    try {
      await fetchAndSaveTariffs();
      console.log('fetchAndSaveTariffs успешно работает');
      
      await updateSpreadsheets();
      console.log('updateSpreadsheets успешно работает');
    } catch (startupError) {
      console.error('Проверка функций прошла с ошибкой:', startupError);
    }
    
    console.log('Сервис запущен');
  } catch (error) {
    console.error('Ошибка сервиса:', error);
    process.exit(1);
  }
}

main();