import axios from 'axios';
import knex from '../db';
import config from '../config';

export interface WarehouseTariff {
    boxDeliveryAndStorageExpr: string;
    boxDeliveryBase: string;
    boxDeliveryLiter: string;
    boxStorageBase: string;
    boxStorageLiter: string;
    warehouseName: string;
}

export interface TariffsResponse {
    dtNextBox: string;
    dtTillMax: string;
    warehouseList: WarehouseTariff[];
}

export async function fetchAndSaveTariffs() {
  try {
      const today = new Date().toISOString().split('T')[0];
    const response = await axios.get(
      'https://common-api.wildberries.ru/api/v1/tariffs/box',
      {
        params: { date: today },
        headers: { Authorization: `Bearer ${config.wbApiToken}` }
      }
    );

    if (!response.data?.response?.data?.warehouseList) {
          throw new Error('Не пришла дата с API');
    }

      const apiData = response.data.response.data;

    const tariffs: WarehouseTariff[] = response.data.response.data.warehouseList;

    for (const tariff of tariffs) {
      await knex('wb_tariffs')
        .insert({
          date: today,
          data: apiData
        })
        .onConflict('id')
        .merge({
            data: apiData,
            updated_at: knex.fn.now()
        });
    }

    console.log(`[WB API] Сохранили ${tariffs.length} тарифы во время ${today}`);
  } catch (error) {
    console.error('[WB API] Ошибка:', error);
  }
}