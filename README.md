# WB Tariff Service

Сервис для сбора тарифов Wildberries и обновления Google Таблиц.

## Требования
- Docker
- Docker Compose

## Запуск
1. Склонируйте репозиторий
2. Создайте файл `.env` на основе `.env.example`
3. Заполните переменные окружения:
   - `WB_API_TOKEN` - токен Wildberries API
   - `GOOGLE_CREDENTIALS` - JSON сервисного аккаунта Google
   - `GOOGLE_SHEET_IDS` - ID Google таблиц через запятую
4. Запустите сервис:
```bash
docker compose up --build