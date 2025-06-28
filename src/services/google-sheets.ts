import { google } from 'googleapis';
import knex from '../db';
import config from '../config';
import { WarehouseTariff } from '../services/wb-api';


export async function updateSpreadsheets() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  await auth.authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  const today = new Date().toISOString().split('T')[0];
  const record = await knex('wb_tariffs')
      .where('date', today)
      .first();

  if (!record || !record.data?.warehouseList) {
    console.log(`[Google Sheets] Не найдено тарифов на текущую дату: ${today}`);
    return;
  }

  const warehouseList: WarehouseTariff[] = record.data.warehouseList;

  const rows = warehouseList.map(warehouse => [
    warehouse.warehouseName,
    warehouse.boxDeliveryAndStorageExpr,
    warehouse.boxDeliveryBase,
    warehouse.boxDeliveryLiter,
    warehouse.boxStorageBase,
    warehouse.boxStorageLiter
  ]);

  // Сортировка по коэффициенту (boxDeliveryLiter)
  rows.sort((a, b) => {
    const aVal = parseFloat(a[3].replace(',', '.'));
    const bVal = parseFloat(b[3].replace(',', '.'));
    return aVal - bVal;
  });

  const values = [
    [
      'Наименование склада',
      'Коэффициент, %',
      'Доставка 1 литра, ₽',
      'Доставка каждого дополнительного литра, ₽',
      'Хранение 1 литра, ₽',
      'Хранение каждого дополнительного литра, ₽'
    ],
    ...rows
  ];

  for (const spreadsheetId of config.spreadsheetIds) {
    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `A1`,
        valueInputOption: 'RAW',
        requestBody: { values }
      });
      console.log(`[Google Sheets] Обновили таблицу ${spreadsheetId}`);
    } catch (error) {
      console.error(`[Google Sheets] Ошибка при обновлении таблицы ${spreadsheetId}:`, error);
    }
  }
}